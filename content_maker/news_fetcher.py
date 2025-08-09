from __future__ import annotations

from dataclasses import dataclass
from typing import List, Optional

import feedparser


GOOGLE_NEWS_RSS_BASE = "https://news.google.com/rss"

CATEGORY_KEYWORDS = {
    "economy": ["เศรษฐกิจ", "เงินเฟ้อ", "ดอกเบี้ย", "หุ้น", "การเงิน"],
    "tech": ["เทคโนโลยี", "AI", "ปัญญาประดิษฐ์", "สมาร์ตโฟน", "แอป"],
    "weird": ["แปลก", "ประหลาด", "ไวรัล", "ขำขัน"],
}


@dataclass
class NewsItem:
    title: str
    link: str
    published: str
    summary: str


def build_feed_url(language: str, region: str, query: Optional[str]) -> str:
    hl = f"{language}"
    gl = f"{region}"
    ceid = f"{region}:{language}"
    if query:
        from urllib.parse import quote_plus

        return f"{GOOGLE_NEWS_RSS_BASE}/search?q={quote_plus(query)}&hl={hl}&gl={gl}&ceid={ceid}"
    return f"{GOOGLE_NEWS_RSS_BASE}?hl={hl}&gl={gl}&ceid={ceid}"


def fetch_news(language: str = "th", region: str = "TH", query: Optional[str] = None, max_items: int = 10) -> List[NewsItem]:
    url = build_feed_url(language, region, query)
    feed = feedparser.parse(url)
    items: List[NewsItem] = []
    for entry in feed.entries[:max_items]:
        items.append(
            NewsItem(
                title=str(getattr(entry, "title", "")).strip(),
                link=str(getattr(entry, "link", "")).strip(),
                published=str(getattr(entry, "published", "")).strip(),
                summary=str(getattr(entry, "summary", "")).strip(),
            )
        )
    return items


def fetch_by_category(language: str, region: str, category: str, max_items: int = 10) -> List[NewsItem]:
    keywords = CATEGORY_KEYWORDS.get(category, [])
    # Merge results from multiple keywords, deduplicate by title
    seen_titles = set()
    results: List[NewsItem] = []
    for kw in (keywords or [""]):
        for item in fetch_news(language, region, kw or None, max_items=max_items):
            if item.title not in seen_titles:
                seen_titles.add(item.title)
                results.append(item)
    return results[:max_items]