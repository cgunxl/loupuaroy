from dataclasses import dataclass
from pathlib import Path


@dataclass
class AppConfig:
    language: str = "th"
    region: str = "TH"
    output_dir: Path = Path("output")
    max_title_length: int = 120


config = AppConfig()