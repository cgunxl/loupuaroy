from __future__ import annotations

from typing import List, Dict, Any


def generate_storyboard(script_text: str, prompts: List[str]) -> List[Dict[str, Any]]:
    lines = [ln.strip() for ln in script_text.splitlines() if ln.strip()]
    scenes: List[Dict[str, Any]] = []
    prompt_idx = 0

    def next_prompt() -> str:
        nonlocal prompt_idx
        if not prompts:
            return ""
        p = prompts[prompt_idx % len(prompts)]
        prompt_idx += 1
        return p

    for ln in lines:
        label = "generic"
        text = ln
        if ln.startswith("[Hook]"):
            label = "hook"
            text = ln.replace("[Hook]", "").strip()
        elif ln.startswith("[Context]"):
            label = "context"
            text = ln.replace("[Context]", "").strip()
        elif ln.startswith("[Twist]"):
            label = "twist"
            text = ln.replace("[Twist]", "").strip()
        elif ln.startswith("[Beat]"):
            label = "beat"
            text = ln.replace("[Beat]", "").strip()
        elif ln.startswith("[CTA]"):
            label = "cta"
            text = ln.replace("[CTA]", "").strip()

        scenes.append({
            "type": label,
            "narration": text,
            "image_prompt": next_prompt(),
            "suggested_motion": "zoom-in slow" if label in ("hook", "twist") else "pan-left slow",
            "on_screen_text": text[:40] + ("…" if len(text) > 40 else ""),
        })
    return scenes