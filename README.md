# TikTok Funny News Maker (Thai)

เครื่องมือ CLI ช่วยทำเวิร์กโฟลว์คอนเทนต์ข่าวฮาๆไวรัลแบบ 30 นาที/คลิป

ฟีเจอร์หลัก
- ดึงเทรนด์ (Google Trends) ประเทศไทย
- ดึงข่าวจาก RSS (เช่น Google News RSS ภาษาไทย)
- สร้างสคริปต์แนวฮา 30-60 วิ (โหมด "ดิบเถื่อน" หรือ "สนุกเล่นคำ")
- สร้างพรอมต์ภาพประกอบ (พร้อมหลายสไตล์)
- เตรียมข้อความสำหรับ TTS (เน้นคำ/เว้นจังหวะ)
- สร้างสตอรี่บอร์ด + SRT ซับไตเติล
- สร้างแคปชัน + แฮชแท็ก

ติดตั้ง
```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

การใช้งานเร็ว
```bash
python -m news_maker --help | cat
```

ตัวอย่างเวิร์กโฟลว์เต็ม
```bash
python -m news_maker full --tone rude --seconds 45 --max-items 20 --out /workspace/output
```

เลือกข่าวเอง
```bash
python -m news_maker fetch --keywords "น้ำมัน,AI" --max-items 30 --out /workspace/output | cat
```

สร้างสคริปต์จากหัวข้อ
```bash
python -m news_maker draft --title "ราคาน้ำมันขึ้นอีกแล้ว" --summary "ราคาน้ำมันปรับขึ้น 50 สตางค์ต่อลิตร" --tone witty --seconds 45 --out /workspace/output | cat
```

ตั้งค่า RSS และคีย์เวิร์ด
- ดูที่ `config.yaml` เพื่อเพิ่ม/ลบฟีดและคำที่สนใจ

ผลลัพธ์
- โฟลเดอร์วันเวลาใน `output/` มีไฟล์: `script.txt`, `script_tts.txt`, `prompts.txt`, `storyboard.json`, `captions.srt`, `caption_hashtags.txt`, `sources.json`

หมายเหตุ
- เครื่องมือสร้างภาพ/ตัดต่อ/เสียงเป็นเว็บฟรีที่ไม่ต้องสมัคร (เช่น Perchance.org, Edit.video, Kapwing, NaturalReader/TTSMaker) ให้คัดลอกผลลัพธ์จากไฟล์ต่างๆ ไปใช้งานในเว็บเหล่านั้นได้ทันที