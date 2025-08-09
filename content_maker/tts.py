from __future__ import annotations

from pathlib import Path

from gtts import gTTS


def synthesize_speech(text: str, out_path: Path, lang: str = "th") -> Path:
    tts = gTTS(text=text, lang=lang)
    tts.save(str(out_path))
    return out_path