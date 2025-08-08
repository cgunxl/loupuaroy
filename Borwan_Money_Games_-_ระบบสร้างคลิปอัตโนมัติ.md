# Borwan Money Games - ระบบสร้างคลิปอัตโนมัติ

ระบบสร้างคลิปวิดีโอสำหรับช่อง "บวรมันนี่เกมส์" ที่ใช้ AI และ API หลายตัวในการสร้างเนื้อหาข่าวการเงิน คริปโตเคอร์เรนซี่ และเคล็ดลับการลงทุนแบบอัตโนมัติ

## ✨ คุณสมบัติหลัก

### 🎯 การสร้างเนื้อหาอัตโนมัติ
- **วิเคราะห์หัวข้อ**: ระบบ AI วิเคราะห์หัวข้อและแนะนำประเภทเนื้อหาที่เหมาะสม
- **ดึงข้อมูลเรียลไทม์**: เชื่อมต่อกับ API หลายตัวเพื่อดึงข้อมูลข่าวและราคาล่าสุด
- **สร้างสคริปต์**: AI สร้างสคริปต์ที่เหมาะสมกับแต่ละประเภทเนื้อหา
- **หัวข้อเทรนด์**: แนะนำหัวข้อที่กำลังเป็นที่นิยมจากข้อมูลตลาด

### 🎙️ การสร้างเสียงพากย์
- **ElevenLabs Integration**: เสียงพากย์คุณภาพสูงแบบ AI
- **Google Text-to-Speech**: ทางเลือกสำรองสำหรับเสียงพื้นฐาน
- **รองรับหลายภาษา**: ไทย, อังกฤษ, ญี่ปุ่น, เกาหลี

### 🎬 การสร้างวิดีโอ
- **วิดีโอแนวตั้ง**: รูปแบบ 1080x1920 เหมาะสำหรับ TikTok และ YouTube Shorts
- **เพิ่มรูปภาพ**: สามารถใส่รูปภาพประกอบได้หลายรูป
- **ข้อความและ Hashtags**: เพิ่มข้อความหัวเรื่องและแฮชแท็กอัตโนมัติ
- **ปรับแต่งได้**: สามารถกำหนดสี ฟอนต์ และเลย์เอาต์ได้

### 📊 API Integration
- **CoinGecko**: ข้อมูลคริปโตเคอร์เรนซี่
- **Yahoo Finance**: ข้อมูลหุ้นและตลาดการเงิน
- **News APIs**: ข่าวการเงินล่าสุด
- **Crypto Panic**: ข่าวคริปโตเฉพาะทาง

## 🚀 การติดตั้งและใช้งาน

### ความต้องการของระบบ
- Python 3.11+
- FFmpeg (สำหรับการประมวลผลวิดีโอ)
- 4GB RAM ขึ้นไป
- พื้นที่ว่าง 2GB สำหรับไฟล์ output

### การติดตั้ง

1. **Clone Repository**
```bash
git clone https://github.com/your-username/borwan-money-games.git
cd borwan-money-games
```

2. **สร้าง Virtual Environment**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# หรือ
venv\\Scripts\\activate  # Windows
```

3. **ติดตั้ง Dependencies**
```bash
pip install -r requirements.txt
```

4. **ตั้งค่า Environment Variables**
```bash
cp .env.example .env
# แก้ไขไฟล์ .env ใส่ API keys ของคุณ
```

5. **รันระบบ**
```bash
python src/main.py
```

ระบบจะรันที่ `http://localhost:5000`

## 🔧 การตั้งค่า API Keys

สร้างไฟล์ `.env` และใส่ API keys ดังนี้:

```env
# ElevenLabs (สำหรับเสียงพากย์คุณภาพสูง)
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# CoinGecko (ข้อมูลคริปโต)
COINGECKO_API_KEY=your_coingecko_api_key

# News API (ข่าวการเงิน)
NEWS_API_KEY=your_news_api_key

# Crypto Panic (ข่าวคริปโต)
CRYPTO_PANIC_API_KEY=your_crypto_panic_api_key

# OpenAI (สำหรับ AI content generation)
OPENAI_API_KEY=your_openai_api_key
```

## 📖 การใช้งาน API

### 1. สร้างวิดีโอจากหัวข้อ
```bash
curl -X POST http://localhost:5000/api/workflow/create-from-topic \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Bitcoin ราคาขึ้น 15% วันนี้",
    "voice_type": "standard"
  }'
```

### 2. สร้างวิดีโอจากสคริปต์ที่กำหนดเอง
```bash
curl -X POST http://localhost:5000/api/workflow/create-from-script \
  -H "Content-Type: application/json" \
  -d '{
    "script": "สวัสดีครับ วันนี้เรามาดูข่าวการเงินที่สำคัญกัน...",
    "topic": "ข่าวการเงินวันนี้",
    "voice_type": "standard"
  }'
```

### 3. ดึงหัวข้อเทรนด์
```bash
curl http://localhost:5000/api/content/trending-topics
```

### 4. สร้างวิดีโออย่างรวดเร็ว
```bash
curl -X POST http://localhost:5000/api/workflow/quick-start
```

## 🏗️ โครงสร้างโปรเจค

```
borwan_money_games/
├── src/
│   ├── routes/          # API endpoints
│   │   ├── api.py       # API ทั่วไป
│   │   ├── content.py   # การสร้างเนื้อหา
│   │   ├── media.py     # การสร้างสื่อ
│   │   └── workflow.py  # จัดการ workflow
│   ├── data_fetchers.py # ดึงข้อมูลจาก API
│   ├── content_generator.py # สร้างเนื้อหา
│   ├── media_generator.py   # สร้างเสียงและวิดีโอ
│   ├── workflow_manager.py  # จัดการ workflow
│   └── main.py         # แอปหลัก
├── output/             # ไฟล์ที่สร้างขึ้น
│   ├── videos/         # วิดีโอ
│   ├── audio/          # เสียงพากย์
│   └── workflows/      # ผลลัพธ์ workflow
├── assets/             # ไฟล์ assets
├── uploads/            # ไฟล์ที่อัปโหลด
└── requirements.txt    # Dependencies
```

## 🎨 การปรับแต่ง

### เปลี่ยนสไตล์วิดีโอ
แก้ไขไฟล์ `src/media_generator.py` ในฟังก์ชัน `create_background_image()`:

```python
# เปลี่ยนสีพื้นหลัง
color = (20, 25, 40)  # สีน้ำเงินเข้ม

# เปลี่ยนขนาดฟอนต์
font_size = 60  # ขนาดฟอนต์หลัก
```

### เพิ่มประเภทเนื้อหาใหม่
แก้ไขไฟล์ `src/content_generator.py` ในคลาส `TopicAnalyzer`:

```python
def analyze_topic(self, topic: str) -> str:
    # เพิ่มเงื่อนไขใหม่
    if 'forex' in topic.lower():
        return 'forex_news'
    # ...
```

## 🔍 การแก้ไขปัญหา

### ปัญหาเสียง ALSA
หากพบ error เกี่ยวกับ ALSA ใน Linux:
```bash
sudo apt-get install alsa-utils
```

### ปัญหา MoviePy
หากมีปัญหากับการสร้างวิดีโอ:
```bash
pip install imageio-ffmpeg
```

### ปัญหา API Rate Limit
- ตรวจสอบ API quotas ในแต่ละบริการ
- เพิ่ม delay ระหว่างการเรียก API
- ใช้ API keys หลายตัวสำหรับ load balancing

## 📈 การพัฒนาต่อ

### ฟีเจอร์ที่วางแผนไว้
- [ ] รองรับภาษาอื่นๆ เพิ่มเติม
- [ ] ระบบ scheduling สำหรับโพสต์อัตโนมัติ
- [ ] การวิเคราะห์ performance ของคลิป
- [ ] ระบบ A/B testing สำหรับ thumbnails
- [ ] Integration กับ social media platforms

### การมีส่วนร่วม
1. Fork repository
2. สร้าง feature branch
3. Commit การเปลี่ยนแปลง
4. Push ไปยัง branch
5. สร้าง Pull Request

## 📄 License

MIT License - ดูรายละเอียดในไฟล์ [LICENSE](LICENSE)

## 🤝 การสนับสนุน

หากมีปัญหาหรือข้อสงสัย:
- เปิด Issue ใน GitHub
- ติดต่อผ่าน email: support@borwan-money-games.com
- เข้าร่วม Discord community: [ลิงก์]

## 🙏 ขอบคุณ

- [ElevenLabs](https://elevenlabs.io/) สำหรับ AI voice generation
- [CoinGecko](https://coingecko.com/) สำหรับข้อมูลคริปโต
- [MoviePy](https://zulko.github.io/moviepy/) สำหรับการประมวลผลวิดีโอ
- [Flask](https://flask.palletsprojects.com/) สำหรับ web framework

---

**Borwan Money Games** - สร้างคลิปการเงินอัตโนมัติด้วย AI 🚀

