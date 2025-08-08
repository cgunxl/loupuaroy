# Cursor AI Development Prompt for Borwan Money Games

## 🎯 Project Overview

You are working on **Borwan Money Games**, an automated video creation system for financial content, specifically designed for the "บวรมันนี่เกมส์" (Borwan Money Games) channel. This system creates TikTok-style vertical videos (1080x1920) with AI-generated voiceovers and real-time financial data.

## 🏗️ System Architecture

### Core Components
1. **Data Fetchers** (`src/data_fetchers.py`) - Fetch real-time data from multiple APIs
2. **Content Generator** (`src/content_generator.py`) - AI-powered script generation
3. **Media Generator** (`src/media_generator.py`) - Voice and video creation
4. **Workflow Manager** (`src/workflow_manager.py`) - End-to-end video creation pipeline
5. **API Routes** (`src/routes/`) - RESTful API endpoints

### Technology Stack
- **Backend**: Flask (Python 3.11+)
- **AI/ML**: OpenAI GPT, ElevenLabs TTS, Google TTS
- **Video Processing**: MoviePy, OpenCV, PIL
- **Data Sources**: CoinGecko, Yahoo Finance, News APIs
- **Database**: SQLite (optional)

## 🔧 Development Guidelines

### Code Style
- Use **type hints** for all functions
- Follow **PEP 8** conventions
- Add comprehensive **docstrings** in Thai and English
- Implement proper **error handling** with try-catch blocks
- Use **logging** for debugging and monitoring

### API Design Patterns
```python
# Standard API response format
{
    "success": bool,
    "data": dict,
    "error": str,
    "timestamp": str
}

# Error handling pattern
try:
    result = some_operation()
    return jsonify({"success": True, "data": result})
except Exception as e:
    return jsonify({"success": False, "error": str(e)}), 500
```

### File Organization
```
src/
├── routes/          # API endpoints (Blueprint pattern)
├── models/          # Data models
├── utils/           # Utility functions
├── config/          # Configuration files
└── tests/           # Unit tests
```

## 🎬 Video Creation Workflow

### 1. Topic Analysis
```python
# Analyze topic and determine content type
content_type = topic_analyzer.analyze_topic(topic)
# Types: 'crypto_news', 'stock_news', 'financial_tips', 'custom'
```

### 2. Data Collection
```python
# Fetch relevant data based on topic
topic_data = data_aggregator.get_topic_data(topic)
# Includes: crypto prices, stock data, news articles
```

### 3. Script Generation
```python
# Generate AI script with fallback
script_result = content_generator.generate_script(topic, topic_data, content_type)
# Includes: script text, hashtags, content structure
```

### 4. Media Creation
```python
# Create complete video with voice and visuals
video_result = media_pipeline.create_complete_video(script_data, voice_type, custom_images)
# Output: MP4 video file (1080x1920)
```

## 🔌 API Integration Patterns

### External APIs
```python
# CoinGecko - Crypto data
headers = {"x-cg-demo-api-key": api_key}
response = requests.get(f"https://api.coingecko.com/api/v3/coins/trending", headers=headers)

# Yahoo Finance - Stock data
url = f"https://query2.finance.yahoo.com/v6/finance/quoteSummary/{symbol}"
params = {"modules": "financialData,quoteType,summaryDetail"}

# News API - Financial news
url = "https://gnews.io/api/v4/search"
params = {"q": "finance", "token": api_key, "lang": "en", "max": 10}
```

### Rate Limiting & Error Handling
```python
import time
from functools import wraps

def rate_limit(calls_per_minute=30):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Implement rate limiting logic
            time.sleep(60 / calls_per_minute)
            return func(*args, **kwargs)
        return wrapper
    return decorator
```

## 🎙️ Voice Generation

### ElevenLabs Integration (Premium)
```python
from elevenlabs import generate, set_api_key

set_api_key(api_key)
audio = generate(
    text=script_text,
    voice="21m00Tcm4TlvDq8ikWAM",  # Default voice
    model="eleven_multilingual_v2"
)
```

### Google TTS Fallback
```python
from gtts import gTTS

tts = gTTS(text=script_text, lang='th', slow=False)
tts.save(output_path)
```

## 🎨 Video Styling

### Brand Guidelines
- **Colors**: Dark blue background (#141928), white text (#FFFFFF)
- **Fonts**: Bold, readable fonts (DejaVu Sans Bold)
- **Layout**: Title at top, content in center, hashtags at bottom
- **Duration**: 45-60 seconds optimal
- **Aspect Ratio**: 9:16 (1080x1920)

### Visual Elements
```python
# Background with gradient
def create_background_image(width=1080, height=1920, color=(20, 25, 40)):
    img = Image.new('RGB', (width, height), color)
    # Add gradient effect
    for i in range(height):
        alpha = i / height
        new_color = tuple(int(c * (1 - alpha * 0.3)) for c in color)
        draw.line([(0, i), (width, i)], fill=new_color)
```

## 📊 Content Types & Templates

### Crypto News Template
```python
template = {
    "intro": "🚨 ข่าวด่วน! {coin_name} เพิ่งเกิดอะไรขึ้น?",
    "body": "หลายคนมักจะกลัวพลาดโอกาสลงทุน ซึ่งเป็นปัญหาที่พบบ่อย...",
    "data_integration": "วันนี้เรามาดูข้อมูลเกี่ยวกับ {coin_name} กำลังเทรนด์!",
    "conclusion": "คอมเมนต์บอกความคิดเห็น!",
    "hashtags": ["#บวรมันนี่เกมส์", "#คริปโต", "#การลงทุน"]
}
```

### Stock News Template
```python
template = {
    "intro": "📈 ตลาดหุ้นวันนี้เป็นอย่างไร?",
    "body": "การลงทุนในหุ้นต้องดูหลายปัจจัย...",
    "data_integration": "{stock_symbol} เปลี่ยนแปลง {change_percent}%",
    "conclusion": "ติดตามข่าวสารต่อไปนะครับ",
    "hashtags": ["#บวรมันนี่เกมส์", "#หุ้น", "#การลงทุน"]
}
```

## 🔄 Workflow Management

### Batch Processing
```python
def batch_create_videos(topics: List[str], voice_type: str = "standard"):
    results = []
    for topic in topics:
        result = create_video_from_topic(topic, voice_type=voice_type)
        results.append(result)
        time.sleep(2)  # Prevent API overload
    return results
```

### Progress Tracking
```python
workflow_result = {
    'workflow_id': f"workflow_{int(time.time())}",
    'success': False,
    'steps': [],  # Track each step
    'final_outputs': {},
    'errors': []
}
```

## 🧪 Testing Patterns

### Unit Tests
```python
import unittest
from src.content_generator import ContentGenerator

class TestContentGenerator(unittest.TestCase):
    def setUp(self):
        self.generator = ContentGenerator()
    
    def test_topic_analysis(self):
        result = self.generator.analyze_topic("Bitcoin ราคาขึ้น")
        self.assertEqual(result, "crypto_news")
```

### API Testing
```python
def test_api_endpoint():
    response = client.post('/api/workflow/create-from-topic', 
                          json={'topic': 'Test topic'})
    assert response.status_code == 200
    assert response.json['success'] == True
```

## 🚀 Deployment Considerations

### Environment Variables
```env
# Required APIs
ELEVENLABS_API_KEY=sk_...
COINGECKO_API_KEY=CG-...
NEWS_API_KEY=...
OPENAI_API_KEY=sk-...

# Optional APIs
CRYPTO_PANIC_API_KEY=...
YAHOO_FINANCE_API_KEY=...

# System Configuration
FLASK_ENV=production
SECRET_KEY=your-secret-key
MAX_CONTENT_LENGTH=16777216  # 16MB
```

### Performance Optimization
```python
# Async processing for long-running tasks
import asyncio
from concurrent.futures import ThreadPoolExecutor

async def process_video_async(topic):
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as executor:
        result = await loop.run_in_executor(executor, create_video, topic)
    return result
```

## 🎯 Common Development Tasks

### Adding New Content Type
1. Update `TopicAnalyzer.analyze_topic()`
2. Create new template in `ContentGenerator`
3. Add corresponding API endpoint
4. Update documentation

### Adding New API Integration
1. Create new fetcher class in `data_fetchers.py`
2. Add API credentials to `.env`
3. Implement rate limiting
4. Add error handling and fallbacks

### Improving Video Quality
1. Enhance background generation
2. Add more visual elements
3. Improve text positioning
4. Add animations or transitions

## 🔍 Debugging Tips

### Common Issues
- **ALSA errors**: Audio system warnings (can be ignored)
- **API rate limits**: Implement proper delays
- **Memory issues**: Clear video clips after use
- **Font rendering**: Ensure proper font paths

### Logging
```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info(f"Processing topic: {topic}")
logger.error(f"API call failed: {str(e)}")
```

## 📈 Performance Metrics

### Key Metrics to Track
- Video generation success rate
- Average processing time
- API response times
- Error rates by component
- User engagement metrics

### Monitoring
```python
def track_performance(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = func(*args, **kwargs)
            duration = time.time() - start_time
            logger.info(f"{func.__name__} completed in {duration:.2f}s")
            return result
        except Exception as e:
            logger.error(f"{func.__name__} failed: {str(e)}")
            raise
    return wrapper
```

## 🎨 UI/UX Considerations (Future Frontend)

### React Component Structure
```jsx
// Video creation workflow
<VideoCreationWizard>
  <TopicInput />
  <ContentTypeSelector />
  <CustomImageUpload />
  <VoiceTypeSelector />
  <PreviewPanel />
  <GenerateButton />
</VideoCreationWizard>
```

### State Management
```javascript
const [workflow, setWorkflow] = useState({
  topic: '',
  contentType: 'auto',
  voiceType: 'standard',
  customImages: [],
  isGenerating: false,
  result: null
});
```

## 🔐 Security Best Practices

### API Key Management
- Store in environment variables
- Use different keys for development/production
- Implement key rotation
- Monitor usage quotas

### Input Validation
```python
from flask import request
from werkzeug.utils import secure_filename

def validate_topic(topic):
    if not topic or len(topic) > 200:
        raise ValueError("Invalid topic length")
    return topic.strip()
```

## 📚 Learning Resources

### Documentation Links
- [Flask Documentation](https://flask.palletsprojects.com/)
- [MoviePy Documentation](https://zulko.github.io/moviepy/)
- [ElevenLabs API](https://docs.elevenlabs.io/)
- [CoinGecko API](https://www.coingecko.com/en/api/documentation)

### Best Practices
- Follow RESTful API design principles
- Implement proper error handling
- Use type hints and docstrings
- Write comprehensive tests
- Monitor performance and errors

---

**Remember**: This system is designed to create engaging financial content for Thai audiences. Focus on clear, informative scripts that provide value while maintaining the entertaining "บวรมันนี่เกมส์" brand personality. Always prioritize user experience and content quality over speed.

