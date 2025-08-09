from __future__ import annotations

from typing import List, Optional

from pytrends.request import TrendReq


def get_trending_searches(pn: str = "th") -> List[str]:
    pytrends = TrendReq(hl="th-TH", tz=420)
    df = pytrends.trending_searches(pn=pn)
    return [str(x).strip() for x in df[0].tolist() if str(x).strip()]


def is_topic_trending(topic: str, pn: str = "th") -> bool:
    topic_norm = topic.strip().lower()
    trends = [t.lower() for t in get_trending_searches(pn=pn)]
    return any(topic_norm in t or t in topic_norm for t in trends)


def related_queries_top(keyword: str, pn: str = "TH") -> List[str]:
    pytrends = TrendReq(hl="th-TH", tz=420)
    pytrends.build_payload([keyword], geo=pn)
    data = pytrends.related_queries()
    result: List[str] = []
    try:
        top_df = data.get(keyword, {}).get("top")
        if top_df is not None:
            result = [str(x).strip() for x in top_df["query"].tolist()]
    except Exception:
        pass
    return result