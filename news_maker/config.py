from __future__ import annotations

import os
from typing import Any, Dict

import yaml

DEFAULT_CONFIG_PATH = os.getenv("NEWS_MAKER_CONFIG", "/workspace/config.yaml")


def load_config(path: str | None = None) -> Dict[str, Any]:
    config_path = path or DEFAULT_CONFIG_PATH
    if not os.path.exists(config_path):
        return {
            "locale": "th_TH",
            "region": "TH",
            "timezone": "Asia/Bangkok",
            "rss_feeds": [
                {
                    "name": "Google News TH",
                    "url": "https://news.google.com/rss?hl=th&gl=TH&ceid=TH:th",
                }
            ],
            "keywords": ["AI", "เทคโนโลยี", "น้ำมัน"],
            "script": {"default_tone": "witty", "default_seconds": 45},
            "hashtags_base": ["ข่าวฮา", "ข่าวไวรัล", "ข่าววันนี้", "fyp", "viral"],
        }
    with open(config_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}