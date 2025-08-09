from __future__ import annotations

from typing import Literal


Category = Literal["economy", "tech", "weird", "auto"]


def generate_script(category: Category, title: str, summary: str, source: str) -> str:
    title = title.strip()
    summary = summary.strip() or title

    if category == "economy":
        return (
            f"เฮ้ย! {title} / วันนี้ {summary} / ตอนนี้ลองนึกภาพในชีวิตประจำวันดูสิ ว่ามันส่งผลยังไงกับเรา / "
            f"คอมเมนต์มาบอกว่าคิดยังไง! (ที่มา: {source})"
        )
    if category == "tech":
        return (
            f"AI ตัวใหม่ {title}! / มีเทคโนโลยีที่ {summary} / ตอนนี้ลองเปรียบเทียบแบบขำๆ ว่า AI จะไปแทนอะไรในชีวิตเรา / "
            f"บอกมาว่าอยากให้ AI ทำอะไรให้บ้าง! (ที่มา: {source})"
        )
    if category == "weird":
        return (
            f"เรื่องนี้แปลกมาก! / วันนี้มีข่าวว่า {title} / ผมว่า {summary} / แชร์เรื่องแปลกที่เจอมาด้วย! (ที่มา: {source})"
        )
    # auto / default general
    return (
        f"เฮ้ย! {title} / วันนี้มีข่าวว่า {summary} / แต่รู้มั้ยว่า ถ้ามองอีกมุมมันก็ฮาดีนะ / "
        f"คอมเมนต์มาบอกความคิดเห็น! (ที่มา: {source})"
    )


def generate_image_prompt(title: str) -> str:
    return f"cartoon news illustration about {title}"