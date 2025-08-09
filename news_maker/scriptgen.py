from __future__ import annotations

from typing import Literal, Tuple

Tone = Literal["witty", "rude"]


def _select_hook_word(tone: Tone) -> str:
    if tone == "rude":
        return "เฮ้ย!"
    return "โอ้โห!"


def build_script(title: str, summary: str | None, seconds: int = 45, tone: Tone = "witty") -> Tuple[str, str]:
    hook = _select_hook_word(tone)
    clean_title = (title or "").strip()
    clean_summary = (summary or "").strip()

    # Length-aware: very rough sizing by seconds
    body_sentences_target = max(2, min(5, seconds // 10))

    if tone == "rude":
        voice = "โหด ดิบ เถื่อน"
        twist = (
            f"แต่เอาจริง {clean_title} นี่มันเหมือนเราไปเจอเซลส์พูดหวานๆ แต่จ่ายจริงเจ็บสุดอะ!"
            if clean_title
            else "แต่เอาจริง เรื่องนี้แม่งเหมือนเซลส์พูดหวานๆ แต่จ่ายจริงเจ็บสุดอะ!"
        )
        filler = [
            "อะไรวะเนี่ย",
            "บ้าไปแล้ว",
            "โคตรจริง",
            "เดี๋ยวนะ ขอหายใจแป๊บ",
        ]
    else:
        voice = "สนุกเล่นคำ"
        twist = (
            f"ถ้าจะให้เปรียบ {clean_title} ก็เหมือนชาบูเติมน้ำซุปไม่หยุด แต่ใจเรายังบางอยู่นะ"
            if clean_title
            else "ถ้าจะให้เปรียบก็เหมือนชาบูเติมน้ำซุปไม่หยุด แต่ใจเรายังบางอยู่นะ"
        )
        filler = [
            "จริงดิ",
            "เดี๋ยวนะ",
            "เอ็นดูอะ",
            "ขำแห้งเลย",
        ]

    # Construct script
    lines = []
    lines.append(f"[Hook] {hook} {clean_title if clean_title else 'เรื่องนี้มันบ้าไปแล้ว!'}")
    if clean_summary:
        lines.append(f"[Context] วันนี้มีข่าวว่า {clean_summary}")
    else:
        lines.append("[Context] วันนี้มีข่าวที่คนพูดถึงกันหนักมาก!")

    lines.append(f"[Twist] {twist}")

    # Add fillers to reach target rhythm
    for i in range(body_sentences_target):
        if i < len(filler):
            lines.append(f"[Beat] {filler[i]}")

    lines.append("[CTA] คอมเมนต์มาบอกว่าคิดยังไงกับเรื่องนี้! กดไลก์ กดแชร์ แล้วติดตามด้วยนะ")

    script = "\n".join(lines)

    # TTS friendly version
    tts_lines = []
    for ln in lines:
        ln = ln.replace("[Hook] ", "").replace("[Context] ", "").replace("[Twist] ", "").replace("[Beat] ", "").replace("[CTA] ", "")
        ln = ln.replace("!", "! …")
        tts_lines.append(ln)
    tts_text = "\n".join(tts_lines)

    return script, tts_text