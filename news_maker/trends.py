from __future__ import annotations

from typing import List

from pytrends.request import TrendReq


def get_trending_searches_th(top_n: int = 20, hl: str = "th-TH", tz: int = 420) -> List[str]:
    try:
        pytrends = TrendReq(hl=hl, tz=tz)
        df = pytrends.trending_searches(pn="thailand")
        trends = [str(x).strip() for x in df[0].tolist() if str(x).strip()]
        return trends[:top_n]
    except Exception:
        # Fallback: return empty; caller can ignore
        return []