from __future__ import annotations

from typing import List


def emphasize(text: str, words_to_bold: List[str] | None = None) -> str:
    if not words_to_bold:
        return text
    out = text
    for w in words_to_bold:
        out = out.replace(w, w.upper())
    return out


def chunk_for_srt(text: str, max_chars: int = 80) -> List[str]:
    parts: List[str] = []
    for para in text.splitlines():
        buf = ""
        for token in para.split(" "):
            if len(buf) + 1 + len(token) > max_chars:
                parts.append(buf.strip())
                buf = token
            else:
                buf = f"{buf} {token}" if buf else token
        if buf.strip():
            parts.append(buf.strip())
    return [p for p in parts if p]