#!/usr/bin/env python3
import os
import math
import argparse
import io
import sys
from typing import Tuple

from PIL import Image, ImageDraw, ImageFont
import numpy as np
import imageio_ffmpeg as iioff
import subprocess

try:
    import requests
except Exception:
    requests = None

FONT_URL = "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSansThai/NotoSansThai-Regular.ttf"
DEFAULT_TEXT = "สวัสดี นี่คือวิดีโอทดสอบระบบ"


def ensure_dir(path: str) -> None:
    if not os.path.isdir(path):
        os.makedirs(path, exist_ok=True)


def download_font_if_needed(font_path: str) -> None:
    if os.path.isfile(font_path):
        return
    ensure_dir(os.path.dirname(font_path))
    if requests is None:
        print("requests not available; cannot auto-download font. Will use PIL default.")
        return
    try:
        print(f"Downloading Thai font to {font_path} ...")
        resp = requests.get(FONT_URL, timeout=20)
        resp.raise_for_status()
        with open(font_path, "wb") as f:
            f.write(resp.content)
        print("Font downloaded.")
    except Exception as e:
        print(f"Failed to download font: {e}. Will use PIL default font.")


def load_font(font_path: str, size: int) -> ImageFont.FreeTypeFont:
    try:
        if os.path.isfile(font_path):
            return ImageFont.truetype(font_path, size=size)
    except Exception as e:
        print(f"Error loading font '{font_path}': {e}")
    # Fallback
    return ImageFont.load_default()


def draw_text_centered(draw: ImageDraw.ImageDraw, text: str, center_xy: Tuple[int, int], font: ImageFont.ImageFont, fill: Tuple[int, int, int]) -> None:
    bbox = draw.textbbox((0, 0), text, font=font, align="center")
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = int(center_xy[0] - text_w / 2)
    y = int(center_xy[1] - text_h / 2)
    # Shadow for readability
    shadow_offset = 3
    draw.text((x + shadow_offset, y + shadow_offset), text, font=font, fill=(0, 0, 0))
    draw.text((x, y), text, font=font, fill=fill, align="center")


def make_frame_generator(width: int, height: int, text: str, font: ImageFont.ImageFont):
    center = (width // 2, height // 2)

    def make_frame(t: float) -> np.ndarray:
        # Animated gradient background with consistent shapes
        yy = np.linspace(0, 1, height)
        xx = np.linspace(0, 1, width)
        X, Y = np.meshgrid(xx, yy)
        r = 0.5 + 0.5 * np.sin(2 * math.pi * (X + 0.10 * t))
        g = 0.5 + 0.5 * np.sin(2 * math.pi * (Y + 0.13 * t))
        b = 0.5 + 0.5 * np.sin(2 * math.pi * (X + Y + 0.07 * t))
        bg = np.stack([r, g, b], axis=2)
        frame = (bg * 200 + 30).clip(0, 255).astype(np.uint8)

        # Convert to PIL for crisp text rendering
        pil_img = Image.fromarray(frame)
        draw = ImageDraw.Draw(pil_img)

        # Title
        draw_text_centered(draw, text, center, font, fill=(255, 255, 255))

        # Sub text with timestamp
        sub = f"เวลา {t:0.2f} วินาที"
        sub_font = font.font_variant(size=max(24, int(font.size * 0.5))) if hasattr(font, 'font_variant') else font
        draw_text_centered(draw, sub, (center[0], center[1] + int(font.size * 0.9)), sub_font, fill=(255, 255, 255))

        return np.array(pil_img)

    return make_frame


def main():
    parser = argparse.ArgumentParser(description="Generate a Thai text test video without system ffmpeg.")
    parser.add_argument("--output", default="/workspace/output/test_video.mp4", help="Output video path")
    parser.add_argument("--seconds", type=int, default=5, help="Duration in seconds")
    parser.add_argument("--width", type=int, default=1280, help="Video width")
    parser.add_argument("--height", type=int, default=720, help="Video height")
    parser.add_argument("--fps", type=int, default=30, help="Frames per second")
    parser.add_argument("--text", default=DEFAULT_TEXT, help="Main Thai text to render")
    parser.add_argument("--font_path", default="/workspace/assets/fonts/NotoSansThai-Regular.ttf", help="Path to TTF font file")
    args = parser.parse_args()

    ensure_dir(os.path.dirname(args.output))
    download_font_if_needed(args.font_path)

    # Choose font size based on height
    font_size = max(32, int(args.height * 0.09))
    font = load_font(args.font_path, size=font_size)

    print(f"Rendering video to {args.output} ...")
    make_frame = make_frame_generator(args.width, args.height, args.text, font)

    width, height, fps = args.width, args.height, args.fps
    total_frames = args.seconds * fps

    # Encode frames using imageio-ffmpeg's bundled ffmpeg
    ffmpeg_bin = iioff.get_ffmpeg_exe()
    cmd = [
        ffmpeg_bin,
        "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-pix_fmt", "rgb24",
        "-s", f"{width}x{height}",
        "-r", str(fps),
        "-i", "-",
        "-an",
        "-vcodec", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "medium",
        "-crf", "20",
        args.output,
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    error: Exception | None = None
    try:
        for frame_index in range(total_frames):
            t = frame_index / fps
            frame = make_frame(t)
            if frame.shape[1] != width or frame.shape[0] != height:
                frame = np.array(Image.fromarray(frame).resize((width, height), Image.BICUBIC))
            proc.stdin.write(frame.astype(np.uint8).tobytes())
    except Exception as e:
        error = e
    finally:
        try:
            if proc.stdin and not proc.stdin.closed:
                proc.stdin.close()
        except Exception:
            pass
        # Avoid communicate() to prevent flush on closed pipe; manually drain and wait
        try:
            _ = proc.stdout.read() if proc.stdout else b""
        except Exception:
            pass
        stderr = b""
        try:
            stderr = proc.stderr.read() if proc.stderr else b""
        except Exception:
            pass
        ret = proc.wait()
        if ret != 0:
            sys.stderr.write(stderr.decode("utf-8", errors="ignore"))
            if error is None:
                raise SystemExit(f"ffmpeg failed with code {ret}")
        if error is not None:
            raise error

    print("Done.")


if __name__ == "__main__":
    main()