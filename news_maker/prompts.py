from __future__ import annotations

from typing import List


def build_image_prompts(topic: str) -> List[str]:
    t = topic.strip()
    base = [
        f"funny cartoon illustration of {t} in Thai pop-art style, vibrant colors, clean background",
        f"news reporter cartoon character explaining {t}, bold outlines, 2D animation style",
        f"humorous infographic about {t}, simple icons, minimal, high contrast",
        f"cartoon style breaking news scene about {t}, dynamic composition",
    ]
    return base