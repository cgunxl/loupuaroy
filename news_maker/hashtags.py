from __future__ import annotations

from typing import List, Tuple

from slugify import slugify


def build_caption_and_tags(title: str, base_tags: List[str], topic_tags: List[str] | None = None) -> Tuple[str, List[str]]:
    lead = f"{title.strip()} — สรุปฮาๆ เข้าใจไว พร้อมความเห็นจัดจ้าน! 🤟"
    tags = []
    for t in (topic_tags or []):
        if t:
            tags.append(t.strip())
    for t in base_tags:
        tags.append(t)

    # Normalize to hashtag format and unique
    hash_tags = []
    seen = set()
    for t in tags:
        tag = slugify(t, separator="").lower()
        if not tag:
            continue
        ht = f"#{tag}"
        if ht not in seen:
            hash_tags.append(ht)
            seen.add(ht)

    return lead, hash_tags