# Borwan Money Games

ระบบสร้างคลิปอัตโนมัติสำหรับเกมส์การเงิน

## 🌐 เว็บไซต์

เว็บไซต์หลัก: https://cgunxl.github.io/loupuaroy/

## 🚀 การพัฒนา

```bash
# ติดตั้ง dependencies
npm install

# เริ่มเซิร์ฟเวอร์พัฒนา
npm run dev

# เปิด http://localhost:5173
```

## 📦 การ Build

```bash
# Build สำหรับ production
npm run build

# ดูตัวอย่าง production build
npm run preview
```

## 🎯 ฟีเจอร์

- 🎬 สร้างคลิปอัตโนมัติ
- 🎨 เอฟเฟกต์สวยงาม
- ⚡ เร็วและง่าย
- 📱 รองรับมือถือ

## 🛠️ เทคโนโลยี

- React 18
- TypeScript
- Vite
- Pixi.js
- GSAP
- Zustand

## 📄 License

MIT License

## ระบบทำคอนเทนต์ข่าวสั้น (ไทย)

เครื่องมือนี้ช่วยอัตโนมัติขั้นตอนหลักตามเวิร์กโฟลว์ 30 นาที:
- หาข่าวจาก Google News (RSS) + เช็คเทรนด์จาก Google Trends
- เขียนสคริปต์ด้วยเทมเพลต (เศรษฐกิจ/เทคโนโลยี/ข่าวแปลก)
- สร้างพรอมพ์ภาพสำหรับ Perchance.org
- (ตัวเลือก) แปลงข้อความเป็นเสียงไทยด้วย gTTS
- (ตัวเลือก) สร้างวิดีโอสั้นพร้อมซับไตเติ้ลด้วย MoviePy

### ติดตั้ง

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

MoviePy ต้องการ `ffmpeg` ในระบบด้วย หากยังไม่มี ติดตั้งบน Debian/Ubuntu:
```bash
sudo apt-get update && sudo apt-get install -y ffmpeg
```

### การใช้งานเบื้องต้น

```bash
python content_maker/cli.py --category tech --max-items 5 --use-tts --make-video
```

ออปชันสำคัญ:
- `--category [economy|tech|weird|auto]` เลือกหมวดข่าว หรือใช้ `--query` คำค้นเอง
- `--query "คำค้น"` ระบุคำค้นภาษาไทย
- `--max-items N` จำนวนข่าวที่ดึงมาพิจารณา (ค่าเริ่มต้น 5)
- `--use-tts` เปิดการสร้างไฟล์เสียง (gTTS)
- `--make-video` เปิดการเรนเดอร์วิดีโอ (ต้องมี ffmpeg)
- `--image /path/to/img.jpg` ใส่ภาพเอง (ไม่ใส่จะสร้างภาพพื้นหลังตัวอักษรอัตโนมัติ)

ผลลัพธ์จะถูกบันทึกในโฟลเดอร์ `output/YYYY-MM-DD_<slug>/` ประกอบด้วย:
- `news.json` รายละเอียดข่าวที่เลือก
- `script.txt` สคริปต์พร้อมอ่าน
- `image_prompt.txt` พรอมพ์ไว้ใช้กับ Perchance.org
- `voice.mp3` (ถ้าเปิด `--use-tts`)
- `video.mp4` (ถ้าเปิด `--make-video`)

### หมายเหตุ
- หากต้องการใช้ NaturalReader / Perchance / Edit.video ตามเวิร์กโฟลว์เดิม ระบบนี้ยังช่วยเตรียมสคริปต์และพรอมพ์ให้ครบ แล้วค่อยอัปโหลด/แปลงด้วยเครื่องมือดังกล่าว
- หากต้องการทำอัตโนมัติเต็มรูป ใช้ `--use-tts` และ `--make-video` เพื่อให้ได้วิดีโอจบในเครื่อง