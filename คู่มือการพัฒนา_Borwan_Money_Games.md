# คู่มือการพัฒนา Borwan Money Games

## 📋 สารบัญ

1. [ภาพรวมระบบ](#ภาพรวมระบบ)
2. [การวิเคราะห์คลิป TikTok](#การวิเคราะห์คลิป-tiktok)
3. [สถาปัตยกรรมระบบ](#สถาปัตยกรรมระบบ)
4. [การใช้งาน API](#การใช้งาน-api)
5. [การสร้างเนื้อหา](#การสร้างเนื้อหา)
6. [การสร้างสื่อ](#การสร้างสื่อ)
7. [Workflow Management](#workflow-management)
8. [การปรับแต่งและขยายระบบ](#การปรับแต่งและขยายระบบ)
9. [การแก้ไขปัญหา](#การแก้ไขปัญหา)
10. [การ Deploy](#การ-deploy)

## 🎯 ภาพรวมระบบ

### วัตถุประสงค์
ระบบ Borwan Money Games ถูกออกแบบมาเพื่อสร้างคลิปวิดีโอสำหรับช่อง "บวรมันนี่เกมส์" แบบอัตโนมัติ โดยใช้ AI และข้อมูลเรียลไทม์จากตลาดการเงิน

### คุณสมบัติหลัก
- **การสร้างเนื้อหาอัตโนมัติ**: วิเคราะห์หัวข้อและสร้างสคริปต์ที่เหมาะสม
- **ข้อมูลเรียลไทม์**: ดึงข้อมูลจาก API หลายตัวรวมถึง CoinGecko, Yahoo Finance
- **เสียงพากย์ AI**: ใช้ ElevenLabs และ Google TTS
- **วิดีโอแนวตั้ง**: รูปแบบ 1080x1920 เหมาะสำหรับ TikTok และ YouTube Shorts
- **การจัดการ Workflow**: ระบบจัดการการสร้างคลิปแบบครบวงจร

## 📱 การวิเคราะห์คลิป TikTok

### คลิปตัวอย่างที่ 1: https://vt.tiktok.com/ZSSqKPxjC/

#### จุดเด่นที่วิเคราะห์ได้:
1. **โครงสร้างเนื้อหา**
   - เริ่มด้วยการดึงดูดความสนใจ (Hook)
   - นำเสนอข้อมูลสำคัญอย่างกระชับ
   - จบด้วยการเรียกร้องให้ติดตาม (Call-to-Action)

2. **สไตล์การนำเสนอ**
   - เสียงพูดเร็วและมีพลัง
   - ใช้คำศัพท์ที่เข้าใจง่าย
   - เน้นข้อมูลที่เป็นประโยชน์

3. **องค์ประกอบภาพ**
   - ข้อความหลักที่อ่านง่าย
   - สีสันที่สะดุดตา
   - รูปภาพประกอบที่เกี่ยวข้อง

### คลิปตัวอย่างที่ 2: https://vt.tiktok.com/ZSSqKhfNN/

#### จุดเด่นเพิ่มเติม:
1. **การใช้ข้อมูล**
   - อ้างอิงข้อมูลจริงจากแหล่งที่น่าเชื่อถือ
   - นำเสนอตัวเลขที่ชัดเจน
   - เชื่อมโยงกับเหตุการณ์ปัจจุบัน

2. **การสร้าง Engagement**
   - ใช้คำถามเพื่อกระตุ้นการคิด
   - สร้างความอยากรู้อยากเห็น
   - เชิญชวนให้แสดงความคิดเห็น

### การประยุกต์ใช้ในระบบ

```python
# Template ที่ได้จากการวิเคราะห์
TIKTOK_STYLE_TEMPLATE = {
    "hook": "🚨 ข่าวด่วน! {topic} เพิ่งเกิดอะไรขึ้น?",
    "problem": "หลายคนมักจะ{pain_point} ซึ่งเป็นปัญหาที่พบบ่อย",
    "solution": "วันนี้เรามาดู{data_point} กัน",
    "evidence": "ข้อมูลจาก {source} บอกว่า {fact}",
    "cta": "คอมเมนต์บอกความคิดเห็น!",
    "hashtags": ["#บวรมันนี่เกมส์", "#การเงิน", "#ลงทุน"]
}
```

## 🏗️ สถาปัตยกรรมระบบ

### โครงสร้างหลัก

```
borwan_money_games/
├── src/
│   ├── routes/              # API Endpoints
│   │   ├── api.py          # API ทั่วไป
│   │   ├── content.py      # การสร้างเนื้อหา
│   │   ├── media.py        # การสร้างสื่อ
│   │   ├── workflow.py     # จัดการ workflow
│   │   └── user.py         # จัดการผู้ใช้
│   ├── models/             # Data Models
│   │   └── user.py         # User model
│   ├── data_fetchers.py    # ดึงข้อมูลจาก API
│   ├── content_generator.py # สร้างเนื้อหา
│   ├── media_generator.py  # สร้างเสียงและวิดีโอ
│   ├── workflow_manager.py # จัดการ workflow
│   └── main.py            # แอปหลัก
├── output/                # ไฟล์ที่สร้างขึ้น
├── assets/                # ไฟล์ assets
├── uploads/               # ไฟล์ที่อัปโหลด
└── requirements.txt       # Dependencies
```

### การไหลของข้อมูล (Data Flow)

1. **Input**: หัวข้อหรือสคริปต์จากผู้ใช้
2. **Analysis**: วิเคราะห์ประเภทเนื้อหา
3. **Data Collection**: ดึงข้อมูลจาก APIs
4. **Content Generation**: สร้างสคริปต์ด้วย AI
5. **Media Creation**: สร้างเสียงและวิดีโอ
6. **Output**: ไฟล์วิดีโอพร้อมใช้งาน

### Components หลัก

#### 1. Data Fetchers
```python
class DataAggregator:
    """รวบรวมข้อมูลจาก API หลายตัว"""
    
    def __init__(self):
        self.crypto_fetcher = CryptoDataFetcher()
        self.stock_fetcher = StockDataFetcher()
        self.news_fetcher = NewsDataFetcher()
    
    def get_topic_data(self, topic: str) -> Dict:
        """ดึงข้อมูลที่เกี่ยวข้องกับหัวข้อ"""
        # Implementation details...
```

#### 2. Content Generator
```python
class ContentGenerator:
    """สร้างเนื้อหาด้วย AI"""
    
    def generate_script(self, topic: str, data: Dict, content_type: str) -> Dict:
        """สร้างสคริปต์จากหัวข้อและข้อมูล"""
        # Implementation details...
```

#### 3. Media Generator
```python
class MediaPipeline:
    """จัดการการสร้างสื่อทั้งหมด"""
    
    def create_complete_video(self, script_data: Dict, voice_type: str, 
                            custom_images: List[str] = None) -> Dict:
        """สร้างวิดีโอสมบูรณ์"""
        # Implementation details...
```

## 🔌 การใช้งาน API

### API Endpoints หลัก

#### 1. Content APIs
```bash
# วิเคราะห์หัวข้อ
POST /api/content/analyze-topic
{
    "topic": "Bitcoin ราคาขึ้น 15%"
}

# ดึงหัวข้อเทรนด์
GET /api/content/trending-topics

# สร้างเนื้อหา
POST /api/content/generate
{
    "topic": "Bitcoin ราคาขึ้น 15%",
    "content_type": "crypto_news"
}
```

#### 2. Media APIs
```bash
# สร้างเสียงพากย์
POST /api/media/generate-voice
{
    "text": "สวัสดีครับ วันนี้เรามาดูข่าวการเงิน...",
    "voice_type": "standard"
}

# สร้างวิดีโอ
POST /api/media/generate-video
{
    "script_data": {...},
    "voice_type": "standard",
    "custom_images": [...]
}

# อัปโหลดรูปภาพ
POST /api/media/upload-image
FormData: file
```

#### 3. Workflow APIs
```bash
# สร้างวิดีโอจากหัวข้อ
POST /api/workflow/create-from-topic
{
    "topic": "Bitcoin ราคาขึ้น 15%",
    "voice_type": "standard",
    "custom_images": []
}

# สร้างวิดีโอจากสคริปต์
POST /api/workflow/create-from-script
{
    "script": "สวัสดีครับ...",
    "topic": "ข่าวการเงิน",
    "voice_type": "standard"
}

# สร้างหลายวิดีโอพร้อมกัน
POST /api/workflow/batch-create
{
    "topics": ["หัวข้อ 1", "หัวข้อ 2"],
    "voice_type": "standard"
}
```

### การจัดการ API Keys

#### ไฟล์ .env
```env
# ElevenLabs (เสียงพากย์คุณภาพสูง)
ELEVENLABS_API_KEY=sk_7e6f30dd175fde7e66b712a6c421a6e4f91896a404fc037d

# CoinGecko (ข้อมูลคริปโต)
COINGECKO_API_KEY=CG-AS6UYW7i1WxB7xMvdPJvCQnE

# News API (ข่าวการเงิน)
NEWS_API_KEY=2c1cbf1e00c4437a80c7d9570635efb0

# Crypto Panic (ข่าวคริปโต)
CRYPTO_PANIC_API_KEY=d19a50e6654fcefd49cba2f24f58a3711f15047a

# OpenAI (AI content generation)
OPENAI_API_KEY=your_openai_api_key
```

#### การจัดการ Rate Limiting
```python
import time
from functools import wraps

def rate_limit(calls_per_minute=30):
    """Decorator สำหรับจำกัดอัตราการเรียก API"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            time.sleep(60 / calls_per_minute)
            try:
                return func(*args, **kwargs)
            except requests.exceptions.HTTPError as e:
                if e.response.status_code == 429:
                    # Too Many Requests - รอแล้วลองใหม่
                    time.sleep(60)
                    return func(*args, **kwargs)
                raise
        return wrapper
    return decorator
```

## 📝 การสร้างเนื้อหา

### ประเภทเนื้อหา (Content Types)

#### 1. Crypto News
```python
CRYPTO_NEWS_TEMPLATE = {
    "intro": "🚨 ข่าวด่วน! {coin_name} เพิ่งเกิดอะไรขึ้น?",
    "hook": "หลายคนมักจะกลัวพลาดโอกาสลงทุน ซึ่งเป็นปัญหาที่พบบ่อย",
    "content": "วันนี้เรามาดูข้อมูลเกี่ยวกับ {coin_name} กำลังเทรนด์! ข้อมูลจาก CoinGecko บอกว่า {price_data}",
    "conclusion": "คอมเมนต์บอกความคิดเห็น!",
    "hashtags": ["#บวรมันนี่เกมส์", "#คริปโต", "#Bitcoin", "#การลงทุน"]
}
```

#### 2. Stock News
```python
STOCK_NEWS_TEMPLATE = {
    "intro": "📈 ตลาดหุ้นวันนี้เป็นอย่างไร?",
    "hook": "การลงทุนในหุ้นต้องดูหลายปัจจัย",
    "content": "{stock_symbol} เปลี่ยนแปลง {change_percent}% จากข้อมูล Yahoo Finance",
    "conclusion": "ติดตามข่าวสารต่อไปนะครับ",
    "hashtags": ["#บวรมันนี่เกมส์", "#หุ้น", "#การลงทุน", "#ตลาดหุ้น"]
}
```

#### 3. Financial Tips
```python
FINANCIAL_TIPS_TEMPLATE = {
    "intro": "💡 เคล็ดลับการเงินที่ทุกคนควรรู้!",
    "hook": "หลายคนยังไม่รู้วิธีการ{tip_topic}",
    "content": "วิธีที่ {tip_number} คือ {tip_detail} ซึ่งจะช่วยให้ {benefit}",
    "conclusion": "ลองไปปฏิบัติดูนะครับ",
    "hashtags": ["#บวรมันนี่เกมส์", "#เคล็ดลับการเงิน", "#การออม", "#การลงทุน"]
}
```

### การสร้างสคริปต์ด้วย AI

#### OpenAI Integration
```python
import openai

class AIScriptGenerator:
    def __init__(self):
        self.client = openai.OpenAI()
    
    def generate_script(self, topic: str, data: Dict, template: str) -> str:
        """สร้างสคริปต์ด้วย OpenAI"""
        
        prompt = f"""
        สร้างสคริปต์สำหรับคลิป TikTok ในสไตล์ "บวรมันนี่เกมส์"
        
        หัวข้อ: {topic}
        ข้อมูล: {json.dumps(data, ensure_ascii=False)}
        Template: {template}
        
        เงื่อนไข:
        - ความยาว 45-60 วินาที
        - ใช้ภาษาไทยที่เข้าใจง่าย
        - เน้นข้อมูลที่เป็นประโยชน์
        - มีการเรียกร้องให้ติดตาม
        """
        
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.7
        )
        
        return response.choices[0].message.content
```

### การวิเคราะห์หัวข้อ

```python
class TopicAnalyzer:
    """วิเคราะห์หัวข้อและกำหนดประเภทเนื้อหา"""
    
    def analyze_topic(self, topic: str) -> str:
        topic_lower = topic.lower()
        
        # คำสำคัญสำหรับคริปโต
        crypto_keywords = ['bitcoin', 'btc', 'ethereum', 'eth', 'คริปโต', 'เหรียญ']
        if any(keyword in topic_lower for keyword in crypto_keywords):
            return 'crypto_news'
        
        # คำสำคัญสำหรับหุ้น
        stock_keywords = ['หุ้น', 'stock', 'set', 'ตลาดหุ้น', 'nasdaq', 'dow']
        if any(keyword in topic_lower for keyword in stock_keywords):
            return 'stock_news'
        
        # คำสำคัญสำหรับเคล็ดลับการเงิน
        tips_keywords = ['เคล็ดลับ', 'วิธี', 'การออม', 'การลงทุน', 'เทคนิค']
        if any(keyword in topic_lower for keyword in tips_keywords):
            return 'financial_tips'
        
        return 'general_finance'
```

## 🎬 การสร้างสื่อ

### การสร้างเสียงพากย์

#### ElevenLabs (Premium)
```python
from elevenlabs import generate, set_api_key, voices

class ElevenLabsVoiceGenerator:
    def __init__(self, api_key: str):
        set_api_key(api_key)
        self.available_voices = self.get_voices()
    
    def generate_voice(self, text: str, voice_id: str = "21m00Tcm4TlvDq8ikWAM") -> bytes:
        """สร้างเสียงด้วย ElevenLabs"""
        audio = generate(
            text=text,
            voice=voice_id,
            model="eleven_multilingual_v2"
        )
        return audio
    
    def get_voices(self) -> List[Dict]:
        """ดึงรายการเสียงที่มีอยู่"""
        voice_list = voices()
        return [{"id": v.voice_id, "name": v.name} for v in voice_list]
```

#### Google TTS (Fallback)
```python
from gtts import gTTS

class GTTSVoiceGenerator:
    def generate_voice(self, text: str, lang: str = 'th') -> str:
        """สร้างเสียงด้วย Google TTS"""
        tts = gTTS(text=text, lang=lang, slow=False)
        
        timestamp = int(time.time())
        output_path = f"output/audio/voice_gtts_{timestamp}.mp3"
        tts.save(output_path)
        
        return output_path
```

### การสร้างวิดีโอ

#### การสร้างพื้นหลัง
```python
from PIL import Image, ImageDraw, ImageFont

def create_background_image(width: int = 1080, height: int = 1920, 
                          color: tuple = (20, 25, 40)) -> str:
    """สร้างภาพพื้นหลังแบบ gradient"""
    
    img = Image.new('RGB', (width, height), color)
    draw = ImageDraw.Draw(img)
    
    # สร้าง gradient effect
    for i in range(height):
        alpha = i / height
        new_color = tuple(int(c * (1 - alpha * 0.3)) for c in color)
        draw.line([(0, i), (width, i)], fill=new_color)
    
    # บันทึกไฟล์
    bg_path = "assets/backgrounds/gradient_bg.png"
    img.save(bg_path)
    return bg_path
```

#### การสร้าง Text Overlay
```python
def create_text_overlay(text: str, width: int = 1080, height: int = 200,
                       font_size: int = 60, color: tuple = (255, 255, 255)) -> str:
    """สร้าง overlay ข้อความ"""
    
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # โหลดฟอนต์
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    # คำนวณตำแหน่งกลาง
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    
    # วาดข้อความ
    draw.text((x, y), text, font=font, fill=color)
    
    # บันทึกไฟล์
    timestamp = int(time.time())
    overlay_path = f"assets/overlays/text_{timestamp}.png"
    img.save(overlay_path)
    return overlay_path
```

#### การรวมวิดีโอ
```python
from moviepy.editor import *

def create_video(audio_path: str, script_data: Dict, custom_images: List[str] = None) -> str:
    """สร้างวิดีโอสมบูรณ์"""
    
    # โหลดเสียง
    audio = AudioFileClip(audio_path)
    duration = audio.duration
    
    # สร้างพื้นหลัง
    bg_path = create_background_image()
    background = ImageClip(bg_path).set_duration(duration)
    
    # สร้างข้อความหลัก
    title = script_data.get('topic', 'บวรมันนี่เกมส์')
    title_overlay = create_text_overlay(title, font_size=80)
    title_clip = (ImageClip(title_overlay)
                 .set_duration(3)
                 .set_position(('center', 100)))
    
    # สร้าง hashtags
    hashtags = ' '.join(script_data.get('hashtags', [])[:5])
    hashtag_overlay = create_text_overlay(hashtags, font_size=40)
    hashtag_clip = (ImageClip(hashtag_overlay)
                   .set_duration(duration)
                   .set_position(('center', 1600)))
    
    # เพิ่มรูปภาพที่กำหนดเอง
    clips = [background, title_clip, hashtag_clip]
    
    if custom_images:
        for i, img_path in enumerate(custom_images[:3]):  # จำกัด 3 รูป
            if os.path.exists(img_path):
                start_time = (duration / len(custom_images)) * i
                img_duration = min(3.0, duration - start_time)
                
                img_clip = (ImageClip(img_path)
                           .set_duration(img_duration)
                           .set_start(start_time)
                           .set_position(('center', 'center'))
                           .resize(height=400))
                clips.append(img_clip)
    
    # รวมคลิปทั้งหมด
    final_video = CompositeVideoClip(clips).set_audio(audio)
    
    # ส่งออกวิดีโอ
    timestamp = int(time.time())
    output_path = f"output/videos/video_{timestamp}.mp4"
    
    final_video.write_videofile(
        output_path,
        fps=24,
        codec='libx264',
        audio_codec='aac'
    )
    
    # ปิดคลิป
    audio.close()
    background.close()
    title_clip.close()
    hashtag_clip.close()
    final_video.close()
    
    return output_path
```

## 🔄 Workflow Management

### การจัดการ Workflow แบบครบวงจร

```python
class WorkflowManager:
    """จัดการ workflow การสร้างคลิปทั้งหมด"""
    
    def create_video_from_topic(self, topic: str, custom_images: List[str] = None,
                               voice_type: str = "standard") -> Dict:
        """สร้างวิดีโอจากหัวข้อแบบครบวงจร"""
        
        workflow_id = f"workflow_{int(time.time())}"
        result = {
            'workflow_id': workflow_id,
            'success': False,
            'steps': [],
            'topic': topic,
            'started_at': datetime.now().isoformat(),
            'final_outputs': {},
            'errors': []
        }
        
        try:
            # Step 1: วิเคราะห์หัวข้อ
            content_type = self.topic_analyzer.analyze_topic(topic)
            result['steps'].append({
                'step': 1,
                'name': 'topic_analysis',
                'success': True,
                'output': {'content_type': content_type}
            })
            
            # Step 2: ดึงข้อมูล
            topic_data = self.data_aggregator.get_topic_data(topic)
            result['steps'].append({
                'step': 2,
                'name': 'data_collection',
                'success': True,
                'output': {'data_points': len(str(topic_data))}
            })
            
            # Step 3: สร้างสคริปต์
            script_result = self.content_generator.generate_script(topic, topic_data, content_type)
            result['steps'].append({
                'step': 3,
                'name': 'script_generation',
                'success': script_result['success']
            })
            
            # Step 4: สร้างวิดีโอ
            video_result = self.media_pipeline.create_complete_video(
                script_result, voice_type, custom_images
            )
            result['steps'].append({
                'step': 4,
                'name': 'video_generation',
                'success': video_result['success']
            })
            
            if video_result['success']:
                result['success'] = True
                result['final_outputs'] = {
                    'video_path': video_result['final_video_path'],
                    'audio_path': video_result['audio_path'],
                    'script': script_result['script'],
                    'hashtags': script_result.get('hashtags', [])
                }
            
        except Exception as e:
            result['errors'].append(str(e))
        
        result['completed_at'] = datetime.now().isoformat()
        self.save_workflow_result(workflow_id, result)
        
        return result
```

### การประมวลผลแบบ Batch

```python
def batch_create_videos(self, topics: List[str], voice_type: str = "standard") -> Dict:
    """สร้างวิดีโอหลายเรื่องพร้อมกัน"""
    
    batch_id = f"batch_{int(time.time())}"
    result = {
        'batch_id': batch_id,
        'total_topics': len(topics),
        'completed_videos': 0,
        'failed_videos': 0,
        'results': []
    }
    
    for i, topic in enumerate(topics):
        print(f"Processing {i+1}/{len(topics)}: {topic}")
        
        video_result = self.create_video_from_topic(topic, voice_type=voice_type)
        result['results'].append(video_result)
        
        if video_result['success']:
            result['completed_videos'] += 1
        else:
            result['failed_videos'] += 1
        
        # หยุดพักเพื่อไม่ให้ระบบโหลดหนัก
        if i < len(topics) - 1:
            time.sleep(2)
    
    result['success'] = result['completed_videos'] > 0
    return result
```

## 🛠️ การปรับแต่งและขยายระบบ

### การเพิ่มประเภทเนื้อหาใหม่

#### 1. เพิ่มใน Topic Analyzer
```python
def analyze_topic(self, topic: str) -> str:
    topic_lower = topic.lower()
    
    # เพิ่มประเภทใหม่: Forex
    forex_keywords = ['forex', 'usd', 'eur', 'gbp', 'อัตราแลกเปลี่ยน']
    if any(keyword in topic_lower for keyword in forex_keywords):
        return 'forex_news'
    
    # ประเภทเดิม...
    return 'general_finance'
```

#### 2. สร้าง Template ใหม่
```python
FOREX_NEWS_TEMPLATE = {
    "intro": "💱 ข่าวอัตราแลกเปลี่ยนวันนี้!",
    "hook": "การเทรด Forex ต้องดูปัจจัยหลายอย่าง",
    "content": "{currency_pair} เปลี่ยนแปลง {change_percent}%",
    "conclusion": "ระวังความเสี่ยงในการเทรดนะครับ",
    "hashtags": ["#บวรมันนี่เกมส์", "#Forex", "#การเทรด"]
}
```

#### 3. เพิ่ม Data Fetcher
```python
class ForexDataFetcher:
    def __init__(self):
        self.api_key = os.getenv('FOREX_API_KEY')
    
    def get_currency_rates(self, base_currency: str = 'USD') -> Dict:
        """ดึงอัตราแลกเปลี่ยน"""
        url = f"https://api.exchangerate-api.com/v4/latest/{base_currency}"
        response = requests.get(url)
        return response.json()
```

### การปรับปรุงคุณภาพเสียง

#### การใช้ ElevenLabs Voice Cloning
```python
def clone_voice(self, audio_file_path: str, voice_name: str) -> str:
    """สร้างเสียงโคลนจากไฟล์เสียงตัวอย่าง"""
    
    # อัปโหลดไฟล์เสียงตัวอย่าง
    with open(audio_file_path, 'rb') as f:
        response = requests.post(
            "https://api.elevenlabs.io/v1/voices/add",
            headers={"xi-api-key": self.api_key},
            files={"files": f},
            data={"name": voice_name}
        )
    
    voice_data = response.json()
    return voice_data['voice_id']
```

### การเพิ่มเอฟเฟกต์วิดีโอ

#### การเพิ่ม Transitions
```python
from moviepy.video.fx import fadein, fadeout

def add_transitions(self, clips: List[VideoClip]) -> List[VideoClip]:
    """เพิ่มเอฟเฟกต์ fade in/out"""
    
    processed_clips = []
    for clip in clips:
        # เพิ่ม fade in ที่จุดเริ่มต้น
        clip = clip.fx(fadein, 0.5)
        # เพิ่ม fade out ที่จุดสิ้นสุด
        clip = clip.fx(fadeout, 0.5)
        processed_clips.append(clip)
    
    return processed_clips
```

#### การเพิ่ม Text Animation
```python
def create_animated_text(self, text: str, duration: float) -> VideoClip:
    """สร้างข้อความที่มีแอนิเมชัน"""
    
    # สร้าง text clip
    txt_clip = TextClip(text, fontsize=60, color='white', font='Arial-Bold')
    
    # เพิ่มแอนิเมชัน slide in จากซ้าย
    txt_clip = (txt_clip
                .set_duration(duration)
                .set_position(lambda t: (max(0, -200 + 50*t), 'center')))
    
    return txt_clip
```

## 🔧 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

#### 1. ALSA Audio Errors
```bash
# ข้อผิดพลาด
ALSA lib confmisc.c:855:(parse_card) cannot find card '0'

# วิธีแก้ไข
sudo apt-get install alsa-utils
# หรือเพิกเฉยได้ เพราะไม่กระทบการทำงาน
```

#### 2. MoviePy Memory Issues
```python
# ปิดคลิปหลังใช้งาน
def cleanup_clips(clips: List[VideoClip]):
    """ปิดคลิปเพื่อเคลียร์ memory"""
    for clip in clips:
        if hasattr(clip, 'close'):
            clip.close()

# ใช้ context manager
from contextlib import contextmanager

@contextmanager
def video_clip_manager(clip_path: str):
    clip = VideoFileClip(clip_path)
    try:
        yield clip
    finally:
        clip.close()
```

#### 3. API Rate Limiting
```python
import backoff

@backoff.on_exception(
    backoff.expo,
    requests.exceptions.HTTPError,
    max_tries=3,
    giveup=lambda e: e.response.status_code != 429
)
def api_call_with_retry(url: str, **kwargs):
    """เรียก API พร้อม retry mechanism"""
    response = requests.get(url, **kwargs)
    response.raise_for_status()
    return response.json()
```

#### 4. Font Rendering Issues
```python
def get_system_font(preferred_fonts: List[str]) -> str:
    """หาฟอนต์ที่มีในระบบ"""
    
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/System/Library/Fonts/Arial.ttf",  # macOS
        "C:/Windows/Fonts/arial.ttf",       # Windows
    ]
    
    for font_path in font_paths:
        if os.path.exists(font_path):
            return font_path
    
    return None  # ใช้ฟอนต์เริ่มต้น
```

### การ Debug และ Monitoring

#### Logging Configuration
```python
import logging
from datetime import datetime

# ตั้งค่า logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f'logs/app_{datetime.now().strftime("%Y%m%d")}.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# ใช้งาน
logger.info(f"Starting video creation for topic: {topic}")
logger.error(f"API call failed: {str(e)}")
```

#### Performance Monitoring
```python
import time
from functools import wraps

def monitor_performance(func):
    """Decorator สำหรับติดตาม performance"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = func(*args, **kwargs)
            duration = time.time() - start_time
            logger.info(f"{func.__name__} completed in {duration:.2f}s")
            return result
        except Exception as e:
            duration = time.time() - start_time
            logger.error(f"{func.__name__} failed after {duration:.2f}s: {str(e)}")
            raise
    return wrapper

# ใช้งาน
@monitor_performance
def create_video(topic: str):
    # Implementation...
```

## 🚀 การ Deploy

### การเตรียมระบบสำหรับ Production

#### 1. Docker Configuration
```dockerfile
# Dockerfile
FROM python:3.11-slim

# ติดตั้ง system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsm6 \
    libxext6 \
    libfontconfig1 \
    libxrender1 \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ติดตั้ง Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# คัดลอกโค้ด
COPY . .

# สร้างโฟลเดอร์ที่จำเป็น
RUN mkdir -p output/videos output/audio output/workflows uploads assets

EXPOSE 5000

CMD ["python", "src/main.py"]
```

#### 2. Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  borwan-money-games:
    build: .
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY}
      - COINGECKO_API_KEY=${COINGECKO_API_KEY}
      - NEWS_API_KEY=${NEWS_API_KEY}
    volumes:
      - ./output:/app/output
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - borwan-money-games
    restart: unless-stopped
```

#### 3. Nginx Configuration
```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream app {
        server borwan-money-games:5000;
    }

    server {
        listen 80;
        server_name your-domain.com;
        
        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        client_max_body_size 100M;

        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api/media/download/ {
            proxy_pass http://app;
            proxy_buffering off;
            proxy_request_buffering off;
        }
    }
}
```

### การ Deploy บน Cloud

#### AWS EC2 Deployment
```bash
# 1. สร้าง EC2 instance (Ubuntu 22.04)
# 2. ติดตั้ง Docker
sudo apt update
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker $USER

# 3. Clone repository
git clone https://github.com/your-username/borwan-money-games.git
cd borwan-money-games

# 4. ตั้งค่า environment variables
cp .env.example .env
nano .env  # แก้ไข API keys

# 5. Build และรัน
docker-compose up -d

# 6. ตรวจสอบสถานะ
docker-compose logs -f
```

#### การตั้งค่า SSL Certificate
```bash
# ใช้ Let's Encrypt
sudo apt install certbot
sudo certbot certonly --standalone -d your-domain.com

# คัดลอก certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/key.pem
sudo chown $USER:$USER ./ssl/*
```

### การ Backup และ Recovery

#### Backup Script
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/borwan_money_games_$DATE"

# สร้างโฟลเดอร์ backup
mkdir -p $BACKUP_DIR

# Backup ไฟล์สำคัญ
cp -r output/ $BACKUP_DIR/
cp -r uploads/ $BACKUP_DIR/
cp .env $BACKUP_DIR/
cp -r logs/ $BACKUP_DIR/

# บีบอัดไฟล์
tar -czf "$BACKUP_DIR.tar.gz" -C /backup "borwan_money_games_$DATE"
rm -rf $BACKUP_DIR

# ลบ backup เก่าที่เก็บไว้เกิน 30 วัน
find /backup -name "borwan_money_games_*.tar.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR.tar.gz"
```

#### Cron Job สำหรับ Auto Backup
```bash
# เพิ่มใน crontab
crontab -e

# Backup ทุกวันเวลา 2:00 AM
0 2 * * * /path/to/backup.sh
```

### การ Monitor และ Maintenance

#### Health Check Endpoint
```python
@app.route('/health')
def health_check():
    """ตรวจสอบสถานะระบบ"""
    
    checks = {
        'database': check_database_connection(),
        'apis': check_external_apis(),
        'storage': check_storage_space(),
        'memory': check_memory_usage()
    }
    
    all_healthy = all(checks.values())
    status_code = 200 if all_healthy else 503
    
    return jsonify({
        'status': 'healthy' if all_healthy else 'unhealthy',
        'checks': checks,
        'timestamp': datetime.now().isoformat()
    }), status_code
```

#### Log Rotation
```bash
# /etc/logrotate.d/borwan-money-games
/app/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        docker-compose restart borwan-money-games
    endscript
}
```

---

## 📚 สรุป

ระบบ Borwan Money Games เป็นระบบที่ซับซ้อนแต่มีประสิทธิภาพสูงในการสร้างคลิปวิดีโอการเงินแบบอัตโนมัติ การพัฒนาและดูแลรักษาระบบนี้ต้องใช้ความรู้ในหลายด้าน รวมถึง:

- **API Integration**: การเชื่อมต่อกับบริการภายนอก
- **AI/ML**: การใช้ AI ในการสร้างเนื้อหา
- **Media Processing**: การประมวลผลเสียงและวิดีโอ
- **System Architecture**: การออกแบบระบบที่ scalable
- **DevOps**: การ deploy และดูแลรักษาระบบ

ด้วยการทำตามคู่มือนี้ คุณจะสามารถพัฒนา ปรับปรุง และดูแลรักษาระบบได้อย่างมีประสิทธิภาพ

