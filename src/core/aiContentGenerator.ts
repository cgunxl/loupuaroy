// AI Content Generator for TikTok-style Videos
// ระบบสร้างเนื้อหาอัตโนมัติแบบ TikTok

export interface TikTokContentStyle {
  hook: string
  mainContent: string[]
  callToAction: string
  hashtags: string[]
  tone: 'energetic' | 'informative' | 'funny' | 'dramatic'
  duration: number
  visualElements: VisualElement[]
}

export interface VisualElement {
  type: 'text' | 'image' | 'chart' | 'animation' | 'transition'
  content: string
  timing: { start: number; end: number }
  style: Record<string, any>
}

export interface ContentPrompt {
  topic: string
  style: 'finance' | 'crypto' | 'news' | 'educational'
  targetAudience: string
  duration: number
  keywords: string[]
}

export class AIContentGenerator {
  // Templates จากการวิเคราะห์ช่อง TikTok ตัวอย่าง
  private readonly CONTENT_TEMPLATES: Record<string, any> = {
    finance: {
      hooks: [
        "🚨 ข่าวด่วน! {topic} ที่คุณต้องรู้!",
        "⚡ {topic} เปลี่ยนแปลงครั้งใหญ่!",
        "💰 วิธีรวยจาก {topic} ที่ไม่มีใครบอก!",
        "📈 {topic} พุ่งขึ้น {percent}% ในวันเดียว!",
        "🔥 เตือนภัย! {topic} กำลังจะเกิดอะไรขึ้น?"
      ],
      structures: [
        {
          name: "problem-solution",
          parts: [
            "ปัญหา: {problem}",
            "ผลกระทบ: {impact}",
            "วิธีแก้: {solution}",
            "ผลลัพธ์: {result}"
          ]
        },
        {
          name: "news-analysis",
          parts: [
            "ข่าวล่าสุด: {news}",
            "สาเหตุ: {cause}",
            "ผลกระทบต่อคุณ: {impact}",
            "สิ่งที่ต้องทำ: {action}"
          ]
        }
      ],
      ctas: [
        "💬 คอมเมนต์บอกความคิดเห็น!",
        "❤️ กดไลค์ถ้าเป็นประโยชน์!",
        "➡️ ติดตามเพื่อไม่พลาดข้อมูลสำคัญ!",
        "🔔 กดกระดิ่งเพื่อรับการแจ้งเตือน!"
      ]
    },
    crypto: {
      hooks: [
        "🚀 {coin} จะขึ้นไปถึง {price}!?",
        "⚠️ {coin} กำลังจะ crash!?",
        "💎 Hidden Gem! {coin} ที่ใครๆ มองข้าม",
        "🐋 วาฬใหญ่ซื้อ {coin} {amount} ล้าน!",
        "📊 Technical Analysis {coin} ต้องดู!"
      ],
      structures: [
        {
          name: "price-prediction",
          parts: [
            "ราคาปัจจุบัน: {current_price}",
            "Support: {support} | Resistance: {resistance}",
            "เป้าหมายระยะสั้น: {short_target}",
            "เป้าหมายระยะยาว: {long_target}"
          ]
        }
      ],
      ctas: [
        "📌 Save ไว้ดูทีหลัง!",
        "🚨 DYOR - ศึกษาก่อนลงทุนนะครับ!",
        "💬 คิดว่า {coin} จะไปถึงเท่าไหร่?"
      ]
    }
  }

  // สร้างเนื้อหาจาก prompt
  async generateContent(prompt: ContentPrompt): Promise<TikTokContentStyle> {
    const template = this.CONTENT_TEMPLATES[prompt.style] || this.CONTENT_TEMPLATES.finance
    
    // เลือก hook ที่เหมาะสม
    const hook = this.selectAndFillTemplate(
      template.hooks[Math.floor(Math.random() * template.hooks.length)],
      prompt
    )
    
    // เลือกโครงสร้างเนื้อหา
    const structure = template.structures[Math.floor(Math.random() * template.structures.length)]
    const mainContent = await this.generateMainContent(structure, prompt)
    
    // เลือก CTA
    const cta = template.ctas[Math.floor(Math.random() * template.ctas.length)]
    
    // สร้าง visual elements
    const visualElements = this.generateVisualElements(mainContent, prompt.duration)
    
    // สร้าง hashtags
    const hashtags = this.generateHashtags(prompt)
    
    return {
      hook,
      mainContent,
      callToAction: cta,
      hashtags,
      tone: this.detectTone(prompt),
      duration: prompt.duration,
      visualElements
    }
  }

  // สร้างเนื้อหาหลัก
  private async generateMainContent(structure: any, prompt: ContentPrompt): Promise<string[]> {
    const content: string[] = []
    
    // ใช้ AI หรือ template สำหรับสร้างแต่ละส่วน
    for (const part of structure.parts) {
      const filledPart = await this.fillContentPart(part, prompt)
      content.push(filledPart)
    }
    
    return content
  }

  // สร้าง visual elements
  private generateVisualElements(content: string[], duration: number): VisualElement[] {
    const elements: VisualElement[] = []
    const timePerSection = duration / content.length
    
    content.forEach((text, index) => {
      const startTime = index * timePerSection
      const endTime = (index + 1) * timePerSection
      
      // Text overlay
      elements.push({
        type: 'text',
        content: text,
        timing: { start: startTime, end: endTime },
        style: {
          fontSize: this.calculateFontSize(text),
          position: 'center',
          animation: 'fadeInUp',
          color: '#FFFFFF',
          background: 'rgba(0,0,0,0.7)',
          padding: '20px',
          borderRadius: '10px'
        }
      })
      
      // เพิ่ม visual effects
      if (text.includes('📈') || text.includes('chart')) {
        elements.push({
          type: 'chart',
          content: 'price-chart',
          timing: { start: startTime, end: endTime },
          style: { position: 'background', opacity: 0.8 }
        })
      }
      
      // Transitions
      if (index < content.length - 1) {
        elements.push({
          type: 'transition',
          content: 'swipe',
          timing: { start: endTime - 0.5, end: endTime },
          style: { direction: 'left' }
        })
      }
    })
    
    return elements
  }

  // สร้าง hashtags
  private generateHashtags(prompt: ContentPrompt): string[] {
    const baseHashtags = ['#บวรมันนี่เกมส์', '#การเงิน', '#ลงทุน']
    const topicHashtags = prompt.keywords.map(k => `#${k}`)
    const trendingHashtags = this.getTrendingHashtags(prompt.style)
    
    return [...baseHashtags, ...topicHashtags, ...trendingHashtags].slice(0, 10)
  }

  // Helper functions
  private selectAndFillTemplate(template: string, prompt: ContentPrompt): string {
    return template.replace(/{(\w+)}/g, (match, key) => {
      switch (key) {
        case 'topic': return prompt.topic
        case 'percent': return Math.floor(Math.random() * 50 + 10).toString()
        case 'coin': return prompt.keywords[0] || 'Bitcoin'
        case 'price': return '$' + (Math.random() * 100000).toFixed(0)
        case 'amount': return Math.floor(Math.random() * 100 + 10).toString()
        default: return match
      }
    })
  }

  private async fillContentPart(template: string, prompt: ContentPrompt): Promise<string> {
    // ในอนาคตจะใช้ AI API จริง
    // ตอนนี้ใช้ template-based generation
    return this.selectAndFillTemplate(template, prompt)
  }

  private detectTone(prompt: ContentPrompt): 'energetic' | 'informative' | 'funny' | 'dramatic' {
    if (prompt.style === 'crypto') return 'energetic'
    if (prompt.style === 'educational') return 'informative'
    if (prompt.keywords.includes('urgent') || prompt.keywords.includes('breaking')) return 'dramatic'
    return 'informative'
  }

  private calculateFontSize(text: string): string {
    const length = text.length
    if (length < 20) return '48px'
    if (length < 50) return '36px'
    if (length < 100) return '28px'
    return '24px'
  }

  private getTrendingHashtags(style: string): string[] {
    const trending: Record<string, string[]> = {
      finance: ['#หุ้น', '#SET', '#ตลาดหุ้น'],
      crypto: ['#Bitcoin', '#Ethereum', '#DeFi'],
      news: ['#ข่าวด่วน', '#เศรษฐกิจ', '#การเมือง'],
      educational: ['#เรียนรู้', '#พัฒนาตัวเอง', '#ความรู้']
    }
    return trending[style] || []
  }

  // วิเคราะห์วิดีโอ TikTok เพื่อเรียนรู้สไตล์
  async analyzeVideoStyle(videoUrl: string): Promise<Partial<TikTokContentStyle>> {
    // ในอนาคตจะใช้ AI Vision API
    // ตอนนี้ return mock analysis
    return {
      tone: 'energetic',
      duration: 30,
      hashtags: ['#viral', '#fyp', '#trending']
    }
  }

  // สร้าง script สำหรับพูด
  generateVoiceScript(content: TikTokContentStyle): string {
    const parts = [
      content.hook,
      ...content.mainContent,
      content.callToAction
    ]
    
    // เพิ่ม pause และ emphasis
    return parts.map(part => {
      return part
        .replace(/!/g, '! <break time="0.5s"/>')
        .replace(/\?/g, '? <break time="0.5s"/>')
        .replace(/💰|📈|🚨|⚡|🔥/g, '<emphasis level="strong">$&</emphasis>')
    }).join(' <break time="1s"/> ')
  }
}

// Export singleton instance
export const aiContentGenerator = new AIContentGenerator()