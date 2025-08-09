// Automated Testing System for TikTok Video Creator
// ระบบทดสอบอัตโนมัติเพื่อหาจุดบกพร่องและปรับปรุง

import { aiContentGenerator } from './aiContentGenerator'
import { tiktokDownloader } from './tiktokDownloader'
import { AudioEngine } from './audioEngine'
import { createVideoRenderer } from './videoRenderer'

export interface TestResult {
  testName: string
  passed: boolean
  duration: number
  error?: string
  details?: any
}

export interface TestReport {
  totalTests: number
  passed: number
  failed: number
  successRate: number
  averageDuration: number
  failures: TestResult[]
  performanceMetrics: PerformanceMetrics
}

export interface PerformanceMetrics {
  contentGenerationTime: number[]
  downloadTime: number[]
  renderTime: number[]
  memoryUsage: number[]
}

export class AutoTester {
  private results: TestResult[] = []
  private performanceMetrics: PerformanceMetrics = {
    contentGenerationTime: [],
    downloadTime: [],
    renderTime: [],
    memoryUsage: []
  }

  // ทดสอบการสร้างเนื้อหาด้วย AI
  async testContentGeneration(iterations: number = 10): Promise<TestResult[]> {
    const results: TestResult[] = []
    const testPrompts = [
      { topic: 'Bitcoin ทะลุ 100,000 ดอลลาร์', style: 'crypto' as const },
      { topic: 'วิธีลงทุนหุ้นมือใหม่', style: 'finance' as const },
      { topic: 'ข่าวเศรษฐกิจวันนี้', style: 'news' as const },
      { topic: 'เรียนรู้การเทรด Forex', style: 'educational' as const }
    ]

    for (let i = 0; i < iterations; i++) {
      for (const prompt of testPrompts) {
        const startTime = performance.now()
        const startMemory = performance.memory?.usedJSHeapSize || 0
        
        try {
          const content = await aiContentGenerator.generateContent({
            ...prompt,
            targetAudience: 'คนไทยทั่วไป',
            duration: 30,
            keywords: ['test', 'automated']
          })

          const duration = performance.now() - startTime
          const memoryUsed = (performance.memory?.usedJSHeapSize || 0) - startMemory
          
          // ตรวจสอบคุณภาพ content
          const passed = this.validateContent(content)
          
          results.push({
            testName: `Content Generation - ${prompt.topic}`,
            passed,
            duration,
            details: { content, memoryUsed }
          })

          this.performanceMetrics.contentGenerationTime.push(duration)
          this.performanceMetrics.memoryUsage.push(memoryUsed)
        } catch (error) {
          results.push({
            testName: `Content Generation - ${prompt.topic}`,
            passed: false,
            duration: performance.now() - startTime,
            error: (error as Error).message
          })
        }
      }
    }

    return results
  }

  // ทดสอบการดาวน์โหลด TikTok
  async testTikTokDownload(iterations: number = 5): Promise<TestResult[]> {
    const results: TestResult[] = []
    const testUrls = [
      'https://www.tiktok.com/@test/video/1234567890',
      'https://vt.tiktok.com/ZSSggABwS/',
      'invalid-url',
      ''
    ]

    for (let i = 0; i < iterations; i++) {
      for (const url of testUrls) {
        const startTime = performance.now()
        
        try {
          const videoInfo = await tiktokDownloader.getVideoInfo(url)
          const duration = performance.now() - startTime
          
          // ตรวจสอบผลลัพธ์
          const passed = url.includes('invalid') || url === '' 
            ? videoInfo === null 
            : videoInfo !== null && videoInfo.id !== ''
          
          results.push({
            testName: `TikTok Download - ${url.substring(0, 30)}...`,
            passed,
            duration,
            details: { videoInfo }
          })

          this.performanceMetrics.downloadTime.push(duration)
        } catch (error) {
          results.push({
            testName: `TikTok Download - ${url.substring(0, 30)}...`,
            passed: false,
            duration: performance.now() - startTime,
            error: (error as Error).message
          })
        }
      }
    }

    return results
  }

  // ทดสอบการ render วิดีโอ
  async testVideoRendering(iterations: number = 5): Promise<TestResult[]> {
    const results: TestResult[] = []
    const testConfigs = [
      { width: 1080, height: 1920, fps: 30, duration: 15 },
      { width: 720, height: 1280, fps: 24, duration: 30 },
      { width: 1920, height: 1080, fps: 60, duration: 10 }
    ]

    // สร้าง canvas สำหรับทดสอบ
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)

    for (let i = 0; i < iterations; i++) {
      for (const config of testConfigs) {
        const startTime = performance.now()
        
        try {
          const renderer = createVideoRenderer(canvas, config)
          
          // ทดสอบ render shot
          await renderer.renderShot({
            t: 0,
            d: 5,
            text: 'Test Rendering',
            fx: ['glow', 'shadow'],
            animation: 'fadeInUp',
            bg: 'gradient'
          })

          const duration = performance.now() - startTime
          renderer.destroy()
          
          results.push({
            testName: `Video Render - ${config.width}x${config.height}@${config.fps}fps`,
            passed: true,
            duration,
            details: config
          })

          this.performanceMetrics.renderTime.push(duration)
        } catch (error) {
          results.push({
            testName: `Video Render - ${config.width}x${config.height}@${config.fps}fps`,
            passed: false,
            duration: performance.now() - startTime,
            error: (error as Error).message
          })
        }
      }
    }

    document.body.removeChild(canvas)
    return results
  }

  // ทดสอบ Audio Engine
  async testAudioEngine(iterations: number = 5): Promise<TestResult[]> {
    const results: TestResult[] = []
    const testTexts = [
      'สวัสดีครับ ทดสอบระบบเสียง',
      'Bitcoin ขึ้น 10% ในวันเดียว',
      'ระบบทดสอบอัตโนมัติ กำลังทำงาน'
    ]

    for (let i = 0; i < iterations; i++) {
      for (const text of testTexts) {
        const startTime = performance.now()
        
        try {
          const ae = new AudioEngine()
          const chunks = [{ text, start: 0, end: 5 }]
          
          // ทดสอบการสร้างเสียง
          await new Promise((resolve, reject) => {
            ae.speakChunks(chunks, ['test'])
              .then(resolve)
              .catch(reject)
            
            // Timeout หลัง 10 วินาที
            setTimeout(() => reject(new Error('Audio timeout')), 10000)
          })

          const duration = performance.now() - startTime
          
          results.push({
            testName: `Audio Engine - "${text.substring(0, 20)}..."`,
            passed: true,
            duration
          })
        } catch (error) {
          results.push({
            testName: `Audio Engine - "${text.substring(0, 20)}..."`,
            passed: false,
            duration: performance.now() - startTime,
            error: (error as Error).message
          })
        }
      }
    }

    return results
  }

  // ทดสอบ Integration ทั้งระบบ
  async testFullIntegration(iterations: number = 10): Promise<TestResult[]> {
    const results: TestResult[] = []

    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now()
      
      try {
        // 1. สร้างเนื้อหา
        const content = await aiContentGenerator.generateContent({
          topic: `ทดสอบระบบครั้งที่ ${i + 1}`,
          style: ['finance', 'crypto', 'news', 'educational'][i % 4] as any,
          targetAudience: 'ทดสอบ',
          duration: 30,
          keywords: ['test']
        })

        // 2. ตรวจสอบเนื้อหา
        if (!content.hook || content.mainContent.length === 0) {
          throw new Error('Content generation failed')
        }

        // 3. ทดสอบการแปลงเป็น shots
        const shots = content.visualElements.map(el => ({
          t: el.timing.start,
          d: el.timing.end - el.timing.start,
          text: el.content,
          fx: [],
          camera: []
        }))

        if (shots.length === 0) {
          throw new Error('No shots generated')
        }

        const duration = performance.now() - startTime
        
        results.push({
          testName: `Full Integration Test #${i + 1}`,
          passed: true,
          duration,
          details: {
            contentLength: content.mainContent.length,
            shotsCount: shots.length,
            totalDuration: content.duration
          }
        })
      } catch (error) {
        results.push({
          testName: `Full Integration Test #${i + 1}`,
          passed: false,
          duration: performance.now() - startTime,
          error: (error as Error).message
        })
      }
    }

    return results
  }

  // ตรวจสอบคุณภาพ content
  private validateContent(content: any): boolean {
    if (!content.hook || content.hook.length < 10) return false
    if (!content.mainContent || content.mainContent.length === 0) return false
    if (!content.callToAction) return false
    if (!content.hashtags || content.hashtags.length === 0) return false
    if (!content.visualElements || content.visualElements.length === 0) return false
    if (content.duration <= 0) return false
    
    // ตรวจสอบ visual elements
    for (const element of content.visualElements) {
      if (!element.type || !element.content) return false
      if (!element.timing || element.timing.start < 0) return false
      if (element.timing.end <= element.timing.start) return false
    }
    
    return true
  }

  // รันการทดสอบทั้งหมด
  async runAllTests(iterations: number = 50): Promise<TestReport> {
    console.log(`🚀 เริ่มการทดสอบอัตโนมัติ ${iterations} รอบ...`)
    
    this.results = []
    this.performanceMetrics = {
      contentGenerationTime: [],
      downloadTime: [],
      renderTime: [],
      memoryUsage: []
    }

    // รันทดสอบแต่ละส่วน
    const contentTests = await this.testContentGeneration(Math.floor(iterations / 5))
    const downloadTests = await this.testTikTokDownload(Math.floor(iterations / 10))
    const renderTests = await this.testVideoRendering(Math.floor(iterations / 10))
    const audioTests = await this.testAudioEngine(Math.floor(iterations / 10))
    const integrationTests = await this.testFullIntegration(Math.floor(iterations / 5))

    // รวมผลทดสอบ
    this.results = [
      ...contentTests,
      ...downloadTests,
      ...renderTests,
      ...audioTests,
      ...integrationTests
    ]

    // สร้างรายงาน
    const report = this.generateReport()
    
    // แสดงผลสรุป
    this.printReport(report)
    
    return report
  }

  // สร้างรายงานผลทดสอบ
  private generateReport(): TestReport {
    const passed = this.results.filter(r => r.passed).length
    const failed = this.results.filter(r => !r.passed).length
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0)
    
    return {
      totalTests: this.results.length,
      passed,
      failed,
      successRate: (passed / this.results.length) * 100,
      averageDuration: totalDuration / this.results.length,
      failures: this.results.filter(r => !r.passed),
      performanceMetrics: this.performanceMetrics
    }
  }

  // แสดงรายงาน
  private printReport(report: TestReport) {
    console.log('\n📊 ========== รายงานผลการทดสอบ ==========')
    console.log(`✅ ผ่าน: ${report.passed} (${report.successRate.toFixed(2)}%)`)
    console.log(`❌ ล้มเหลว: ${report.failed}`)
    console.log(`⏱️  เวลาเฉลี่ย: ${report.averageDuration.toFixed(2)}ms`)
    
    if (report.failures.length > 0) {
      console.log('\n❌ รายการที่ล้มเหลว:')
      report.failures.forEach(failure => {
        console.log(`  - ${failure.testName}: ${failure.error}`)
      })
    }
    
    console.log('\n📈 Performance Metrics:')
    console.log(`  - Content Generation: ${this.average(report.performanceMetrics.contentGenerationTime).toFixed(2)}ms`)
    console.log(`  - Download Time: ${this.average(report.performanceMetrics.downloadTime).toFixed(2)}ms`)
    console.log(`  - Render Time: ${this.average(report.performanceMetrics.renderTime).toFixed(2)}ms`)
    console.log(`  - Memory Usage: ${this.average(report.performanceMetrics.memoryUsage).toFixed(0)} bytes`)
    
    console.log('\n✨ การทดสอบเสร็จสิ้น!')
  }

  private average(arr: number[]): number {
    if (arr.length === 0) return 0
    return arr.reduce((a, b) => a + b, 0) / arr.length
  }
}

// Export singleton instance
export const autoTester = new AutoTester()