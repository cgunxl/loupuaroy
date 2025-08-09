from __future__ import annotations

import argparse
from pathlib import Path
from typing import Optional

from content_maker.config import config
from content_maker.news_fetcher import fetch_news, fetch_by_category
from content_maker.script_generator import generate_script, generate_image_prompt
from content_maker.trends import is_topic_trending
from content_maker.tts import synthesize_speech
from content_maker.utils import ensure_dir, make_output_dir, save_json, save_text, truncate
from content_maker.video import create_placeholder_image, render_video


def pick_best_item(items):
    # Favor titles that are currently trending
    for item in items:
        try:
            if is_topic_trending(item.title):
                return item
        except Exception:
            # Fail open if Trends API not available
            return items[0]
    return items[0]


def main():
    parser = argparse.ArgumentParser(description="Thai short news content maker")
    parser.add_argument("--category", default="auto", choices=["economy", "tech", "weird", "auto"], help="หมวดเนื้อหา")
    parser.add_argument("--query", default=None, help="คำค้นหาข่าว (ภาษาไทย)")
    parser.add_argument("--max-items", type=int, default=5, help="จำนวนข่าวที่จะดึงมาพิจารณา")
    parser.add_argument("--use-tts", action="store_true", help="สร้างไฟล์เสียงด้วย gTTS")
    parser.add_argument("--make-video", action="store_true", help="เรนเดอร์วิดีโอด้วยภาพนิ่ง + ซับไตเติ้ล")
    parser.add_argument("--image", default=None, help="พาธไฟล์ภาพใช้งาน (ถ้าไม่ระบุจะสร้างภาพพื้นหลังให้)")

    args = parser.parse_args()

    language = config.language
    region = config.region

    if args.query:
        items = fetch_news(language=language, region=region, query=args.query, max_items=args.max_items)
    elif args.category and args.category != "auto":
        items = fetch_by_category(language=language, region=region, category=args.category, max_items=args.max_items)
    else:
        items = fetch_news(language=language, region=region, query=None, max_items=args.max_items)

    if not items:
        raise SystemExit("ไม่พบข่าวจาก Google News")

    chosen = pick_best_item(items)

    out_dir = make_output_dir(config.output_dir, chosen.title)
    ensure_dir(out_dir)

    # Save news meta
    save_json(
        out_dir / "news.json",
        {
            "title": chosen.title,
            "link": chosen.link,
            "published": chosen.published,
            "summary": chosen.summary,
        },
    )

    # Generate script
    category = args.category or "auto"
    script_text = generate_script(category, truncate(chosen.title, config.max_title_length), truncate(chosen.summary, config.max_title_length), chosen.link)
    save_text(out_dir / "script.txt", script_text)

    # Image prompt for Perchance
    img_prompt = generate_image_prompt(chosen.title)
    save_text(out_dir / "image_prompt.txt", img_prompt)

    audio_path: Optional[Path] = None
    if args.use_tts:
        audio_path = out_dir / "voice.mp3"
        synthesize_speech(script_text, audio_path)

    # Prepare image
    if args.image:
        image_path = Path(args.image)
        if not image_path.exists():
            raise SystemExit(f"ไม่พบไฟล์ภาพ: {image_path}")
    else:
        image_path = out_dir / "cover.jpg"
        create_placeholder_image(chosen.title, image_path)

    if args.make_video:
        if not audio_path or not audio_path.exists():
            raise SystemExit("ต้องเปิด --use-tts เพื่อเรนเดอร์วิดีโอ")
        video_path = out_dir / "video.mp4"
        render_video(image_path, audio_path, video_path)

    print(f"✅ เสร็จแล้ว ดูไฟล์ใน: {out_dir}")


if __name__ == "__main__":
    main()