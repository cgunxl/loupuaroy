from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Any, Dict

from slugify import slugify


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def make_output_dir(base: Path, title: str) -> Path:
    date_prefix = datetime.now().strftime("%Y-%m-%d")
    safe_slug = slugify(title)[:80] or "news"
    out = base / f"{date_prefix}_{safe_slug}"
    ensure_dir(out)
    return out


def save_text(path: Path, content: str) -> None:
    path.write_text(content.strip() + "\n", encoding="utf-8")


def save_json(path: Path, data: Dict[str, Any]) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def truncate(text: str, max_len: int) -> str:
    return text if len(text) <= max_len else text[: max(0, max_len - 1)] + "…"