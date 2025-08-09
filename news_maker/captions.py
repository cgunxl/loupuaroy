from __future__ import annotations

from typing import List


def to_srt(chunks: List[str], seconds_total: int = 45) -> str:
    n = max(1, len(chunks))
    per = max(1.5, seconds_total / n)

    def fmt(t: float) -> str:
        ms = int((t - int(t)) * 1000)
        s = int(t) % 60
        m = int(t) // 60
        return f"{m:02d}:{s:02d}:{ms:03d}"

    # Note: Using mm:ss:ms format for simplicity for editing tools; many editors accept this.
    # If strict SRT is needed, adjust to HH:MM:SS,mmm
    lines: List[str] = []
    t = 0.0
    for i, ch in enumerate(chunks, start=1):
        start = t
        end = t + per
        lines.append(str(i))
        lines.append(f"00:{fmt(start)} --> 00:{fmt(end)}")
        lines.append(ch)
        lines.append("")
        t = end
    return "\n".join(lines)