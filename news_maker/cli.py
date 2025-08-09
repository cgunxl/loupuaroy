from __future__ import annotations

import json
import os
from datetime import datetime
from typing import Optional, List, cast

import typer
from rich import print

from .config import load_config
from .trends import get_trending_searches_th
from .rss import fetch_rss_items, rank_items_by_keywords, NewsItem
from .scriptgen import build_script
from .prompts import build_image_prompts
from .tts_prep import chunk_for_srt
from .captions import to_srt
from .hashtags import build_caption_and_tags
from .storyboard import generate_storyboard

app = typer.Typer(add_completion=False, help="Funny News Maker CLI (Thai)")


def _ensure_out_dir(base: str, title: str) -> str:
    safe = "".join(c if c.isalnum() or c in ("-", "_") else "_" for c in title)[:60]
    now = datetime.now().strftime("%Y%m%d_%H%M%S")
    outdir = os.path.join(base, f"{now}_{safe}")
    os.makedirs(outdir, exist_ok=True)
    return outdir


@app.command()
def trends(top_n: int = typer.Option(20, help="จำนวนเทรนด์")):
    ts = get_trending_searches_th(top_n=top_n)
    print({"trends": ts})


@app.command()
def fetch(
    keywords: Optional[str] = typer.Option(None, help="คีย์เวิร์ดคั่นด้วยคอมมา"),
    max_items: int = typer.Option(50, help="จำนวนข่าวสูงสุด"),
    out: str = typer.Option("/workspace/output", help="ไดเรกทอรีผลลัพธ์"),
):
    cfg = load_config()
    items = fetch_rss_items(cfg.get("rss_feeds", []), max_items=max_items)
    kw = [k.strip() for k in (keywords.split(",") if keywords else cfg.get("keywords", [])) if k.strip()]
    ranked = rank_items_by_keywords(items, kw)

    outdir = _ensure_out_dir(out, "fetch")
    with open(os.path.join(outdir, "sources.json"), "w", encoding="utf-8") as f:
        json.dump([it.to_dict() for it in ranked], f, ensure_ascii=False, indent=2)
    print({"saved": os.path.join(outdir, "sources.json"), "count": len(ranked)})


@app.command()
def draft(
    title: str = typer.Option(..., help="หัวข้อข่าว/พาดหัว"),
    summary: Optional[str] = typer.Option(None, help="สรุปข่าวสั้น"),
    tone: str = typer.Option("witty", help="witty|rude"),
    seconds: int = typer.Option(45, help="ความยาวโดยประมาณ (วินาที)"),
    out: str = typer.Option("/workspace/output", help="ไดเรกทอรีผลลัพธ์"),
):
    cfg = load_config()
    if tone not in ("witty", "rude"):
        tone = cfg.get("script", {}).get("default_tone", "witty")

    script, tts_text = build_script(title=title, summary=summary, seconds=seconds, tone=cast(str, tone))
    prompts = build_image_prompts(title)

    lead, tags = build_caption_and_tags(title, base_tags=cfg.get("hashtags_base", []), topic_tags=[title])

    outdir = _ensure_out_dir(out, title)
    with open(os.path.join(outdir, "script.txt"), "w", encoding="utf-8") as f:
        f.write(script)
    with open(os.path.join(outdir, "script_tts.txt"), "w", encoding="utf-8") as f:
        f.write(tts_text)
    with open(os.path.join(outdir, "prompts.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(prompts))

    # storyboard
    scenes = generate_storyboard(script, prompts)
    with open(os.path.join(outdir, "storyboard.json"), "w", encoding="utf-8") as f:
        json.dump(scenes, f, ensure_ascii=False, indent=2)

    # captions
    chunks = chunk_for_srt(tts_text, max_chars=70)
    srt = to_srt(chunks, seconds_total=seconds)
    with open(os.path.join(outdir, "captions.srt"), "w", encoding="utf-8") as f:
        f.write(srt)

    with open(os.path.join(outdir, "caption_hashtags.txt"), "w", encoding="utf-8") as f:
        f.write(lead + "\n" + " ".join(tags))

    print({
        "out": outdir,
        "files": [
            "script.txt",
            "script_tts.txt",
            "prompts.txt",
            "storyboard.json",
            "captions.srt",
            "caption_hashtags.txt",
        ],
    })


@app.command()
def full(
    tone: str = typer.Option("witty", help="witty|rude"),
    seconds: int = typer.Option(45, help="ความยาวโดยประมาณ (วินาที)"),
    max_items: int = typer.Option(50, help="จำนวนข่าวสูงสุด"),
    out: str = typer.Option("/workspace/output", help="ไดเรกทอรีผลลัพธ์"),
):
    cfg = load_config()
    ts = get_trending_searches_th(top_n=20) or []

    items = fetch_rss_items(cfg.get("rss_feeds", []), max_items=max_items)
    ranked = rank_items_by_keywords(items, keywords=ts or cfg.get("keywords", []))
    picked: NewsItem | None = ranked[0] if ranked else (items[0] if items else None)

    if not picked:
        print({"error": "ไม่พบข่าวจาก RSS"})
        raise typer.Exit(code=1)

    title = picked.title
    summary = picked.summary or ""

    script, tts_text = build_script(title=title, summary=summary, seconds=seconds, tone=cast(str, tone))
    prompts = build_image_prompts(title)
    lead, tags = build_caption_and_tags(title, base_tags=cfg.get("hashtags_base", []), topic_tags=[title])

    outdir = _ensure_out_dir(out, title)
    with open(os.path.join(outdir, "script.txt"), "w", encoding="utf-8") as f:
        f.write(script)
    with open(os.path.join(outdir, "script_tts.txt"), "w", encoding="utf-8") as f:
        f.write(tts_text)
    with open(os.path.join(outdir, "prompts.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(prompts))

    # storyboard
    scenes = generate_storyboard(script, prompts)
    with open(os.path.join(outdir, "storyboard.json"), "w", encoding="utf-8") as f:
        json.dump(scenes, f, ensure_ascii=False, indent=2)

    chunks = chunk_for_srt(tts_text, max_chars=70)
    srt = to_srt(chunks, seconds_total=seconds)
    with open(os.path.join(outdir, "captions.srt"), "w", encoding="utf-8") as f:
        f.write(srt)

    with open(os.path.join(outdir, "caption_hashtags.txt"), "w", encoding="utf-8") as f:
        f.write(lead + "\n" + " ".join(tags))

    with open(os.path.join(outdir, "sources.json"), "w", encoding="utf-8") as f:
        json.dump([picked.to_dict()], f, ensure_ascii=False, indent=2)

    print({
        "picked": picked.title,
        "out": outdir,
        "files": [
            "script.txt",
            "script_tts.txt",
            "prompts.txt",
            "storyboard.json",
            "captions.srt",
            "caption_hashtags.txt",
            "sources.json",
        ],
    })


def main():  # pragma: no cover
    app()


if __name__ == "__main__":  # pragma: no cover
    main()