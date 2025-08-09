from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import List, Tuple

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from moviepy.editor import AudioFileClip, ImageClip, CompositeVideoClip


@dataclass
class SubtitleSegment:
    text: str
    start: float
    end: float


DEFAULT_SIZE = (1080, 1920)  # 9:16


def create_placeholder_image(text: str, out_path: Path, size: Tuple[int, int] = DEFAULT_SIZE) -> Path:
    img = Image.new("RGB", size, color=(18, 18, 18))
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("DejaVuSans-Bold.ttf", 64)
    except Exception:
        font = ImageFont.load_default()
    # wrap text roughly
    max_width = size[0] - 120
    words = text.split()
    lines: List[str] = []
    current = ""
    for w in words:
        if draw.textlength(current + (" " if current else "") + w, font=font) <= max_width:
            current = (current + " " + w).strip()
        else:
            lines.append(current)
            current = w
    if current:
        lines.append(current)

    total_height = sum([draw.textbbox((0, 0), line, font=font)[3] for line in lines]) + 20 * (len(lines) - 1)
    y = (size[1] - total_height) // 3
    for line in lines:
        w = draw.textlength(line, font=font)
        x = (size[0] - w) // 2
        draw.text((x, y), line, font=font, fill=(255, 255, 255))
        y += draw.textbbox((0, 0), line, font=font)[3] + 20

    img.save(out_path)
    return out_path


def split_script_to_subs(text: str, audio_duration: float) -> List[SubtitleSegment]:
    # Split by "/" or sentence punctuation
    import re

    raw_parts = [p.strip() for p in re.split(r"[\n/]+", text) if p.strip()]
    if not raw_parts:
        raw_parts = [text.strip()]
    # Allocate durations proportionally to text length
    total_chars = sum(len(p) for p in raw_parts)
    segments: List[SubtitleSegment] = []
    cursor = 0.0
    for idx, part in enumerate(raw_parts):
        portion = (len(part) / total_chars) if total_chars else 1.0 / len(raw_parts)
        dur = audio_duration * portion
        start = cursor
        end = audio_duration if idx == len(raw_parts) - 1 else cursor + dur
        segments.append(SubtitleSegment(text=part, start=start, end=end))
        cursor += dur
    return segments


def _render_subtitle_overlay(base_size: Tuple[int, int], text: str) -> Image.Image:
    width, height = base_size
    overlay = Image.new("RGBA", base_size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    try:
        font = ImageFont.truetype("DejaVuSans.ttf", 48)
    except Exception:
        try:
            font = ImageFont.truetype("DejaVuSans-Bold.ttf", 48)
        except Exception:
            font = ImageFont.load_default()

    # background rectangle for readability
    box_margin_x = 60
    box_margin_y = 40
    max_text_width = width - (box_margin_x * 2)

    # wrap lines
    words = text.split()
    lines: List[str] = []
    current = ""
    for w in words:
        candidate = (current + " " + w).strip()
        if draw.textlength(candidate, font=font) <= max_text_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = w
    if current:
        lines.append(current)

    line_heights = [draw.textbbox((0, 0), line, font=font)[3] for line in lines]
    text_height = sum(line_heights) + 10 * (len(lines) - 1)

    # position near bottom
    box_width = max(draw.textlength(line, font=font) for line in lines) + 40
    box_height = text_height + 40
    box_x = (width - box_width) // 2
    box_y = int(height * 0.72)

    # semi-transparent black box
    draw.rectangle(
        [box_x, box_y, box_x + box_width, box_y + box_height],
        fill=(0, 0, 0, 170),
        outline=None,
    )

    # draw lines centered
    y = box_y + 20
    for line in lines:
        line_width = draw.textlength(line, font=font)
        x = box_x + (box_width - line_width) // 2
        draw.text((x, y), line, font=font, fill=(255, 255, 255, 255))
        y += draw.textbbox((0, 0), line, font=font)[3] + 10

    return overlay


def render_video(image_path: Path, audio_path: Path, out_path: Path, fps: int = 30) -> Path:
    audio_clip = AudioFileClip(str(audio_path))
    base_img = Image.open(image_path).convert("RGB").resize(DEFAULT_SIZE)
    base_clip = ImageClip(np.array(base_img)).set_duration(audio_clip.duration)

    # Create subtitles overlays as image clips
    script_text = Path(out_path.parent / "script.txt").read_text(encoding="utf-8")
    segments = split_script_to_subs(script_text, audio_clip.duration)
    subtitle_clips = []
    for seg in segments:
        overlay_img = _render_subtitle_overlay(DEFAULT_SIZE, seg.text)
        overlay_clip = ImageClip(np.array(overlay_img)).set_start(seg.start).set_end(seg.end)
        subtitle_clips.append(overlay_clip)

    video = CompositeVideoClip([base_clip] + subtitle_clips)
    video = video.set_audio(audio_clip)
    video.write_videofile(
        str(out_path),
        fps=fps,
        codec="libx264",
        audio_codec="aac",
        threads=4,
        temp_audiofile=str(out_path.parent / "temp-audio.m4a"),
        remove_temp=True,
    )
    audio_clip.close()
    video.close()
    return out_path