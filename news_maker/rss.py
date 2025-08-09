from __future__ import annotations

import re
import time
from dataclasses import dataclass, asdict
from typing import Iterable, List, Dict, Any

import feedparser


@dataclass
class NewsItem:
    title: str
    link: str
    summary: str
    published: str | None
    source: str | None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def fetch_rss_items(feeds: Iterable[Dict[str, str]], max_items: int = 50) -> List[NewsItem]:
    items: List[NewsItem] = []
    for feed in feeds:
        url = feed.get("url")
        name = feed.get("name")
        if not url:
            continue
        parsed = feedparser.parse(url)
        for entry in parsed.entries[:max_items]:
            title = getattr(entry, "title", "").strip()
            link = getattr(entry, "link", "")
            summary = getattr(entry, "summary", getattr(entry, "description", "")).strip()
            published = getattr(entry, "published", None)
            items.append(NewsItem(title=title, link=link, summary=summary, published=published, source=name))
    # Deduplicate by title
    seen = set()
    unique_items: List[NewsItem] = []
    for it in items:
        key = it.title
        if key not in seen and it.title:
            unique_items.append(it)
            seen.add(key)
    return unique_items[:max_items]


def rank_items_by_keywords(items: List[NewsItem], keywords: Iterable[str]) -> List[NewsItem]:
    scores = []
    kw = [k.strip().lower() for k in keywords if k and k.strip()]
    for it in items:
        text = f"{it.title} {it.summary}".lower()
        score = sum(3 for k in kw if re.search(r"\b" + re.escape(k) + r"\b", text))
        # lightweight recency bonus if available
        if it.published:
            score += 1
        scores.append((score, it))
    scores.sort(key=lambda x: x[0], reverse=True)
    return [it for _, it in scores]