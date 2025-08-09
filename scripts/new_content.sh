#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/new_content.sh YYYY-MM-DD PLATFORM "Topic Title" [HH:MM]
# Example: ./scripts/new_content.sh 2025-08-20 TikTok "CapCut Auto Caption" 18:00

DATE=${1:-}
PLATFORM=${2:-}
TOPIC=${3:-}
TIME=${4:-"18:00"}

if [[ -z "$DATE" || -z "$PLATFORM" || -z "$TOPIC" ]]; then
  echo "Usage: $0 YYYY-MM-DD PLATFORM \"Topic Title\" [HH:MM]" >&2
  exit 1
fi

slugify() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g;s/^-+|-+$//g'
}

SLUG=$(slugify "$TOPIC")
DIR="/workspace/content/${DATE}_${SLUG}"
mkdir -p "$DIR"

# Copy templates
cp -f /workspace/templates/ScriptTemplate.md "$DIR/script.md"
cp -f /workspace/templates/DescriptionTemplate.md "$DIR/description.md"

# Create notes and assets list
cat > "$DIR/notes.md" <<EOF
# Notes — ${TOPIC}

- Owner: …
- Angle/Beats: …
- Assets Needed: ภาพ/เพลง/SFX/กราฟิก
- Status: Ideation
EOF

# Append to calendar CSV if exists
CAL="/workspace/docs/ContentCalendar.csv"
if [[ -f "$CAL" ]]; then
  # Default hashtags/notes placeholders
  echo "${DATE},${PLATFORM},${TOPIC},,Hook→ปัญหา→อินไซท์→วิธีแก้→CTA,ภาพ Unsplash; เพลง Mixkit; กราฟิก Canva,,Ideation,${TIME},#เล่าเรื่อง #ครีเอเตอร์,, , , , " >> "$CAL"
fi

echo "Created: $DIR"
ls -1 "$DIR"