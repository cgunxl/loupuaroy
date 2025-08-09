// Advanced Video Renderer for TikTok-style Videos
// ระบบ render วิดีโอคุณภาพสูงพร้อม effects

import { Application, Container, Text, Graphics, Sprite, Texture, Filter } from 'pixi.js'
import { GlowFilter, DropShadowFilter, OutlineFilter } from 'pixi-filters'
import gsap from 'gsap'

export interface RenderOptions {
  width: number
  height: number
  fps: number
  duration: number
  backgroundColor?: number
}

export interface TextStyle {
  fontSize: number
  fontFamily: string
  fill: any
  stroke?: string
  strokeThickness?: number
  dropShadow?: any
  dropShadowColor?: string
  dropShadowBlur?: number
  dropShadowDistance?: number
  align?: 'left' | 'center' | 'right'
  wordWrap?: boolean
  wordWrapWidth?: number
}

export class VideoRenderer {
  private app: Application
  private container: Container
  private recordedFrames: Blob[] = []
  private isRecording = false
  
  constructor(canvas: HTMLCanvasElement, options: RenderOptions) {
    this.app = new Application({
      view: canvas,
      width: options.width,
      height: options.height,
      backgroundColor: options.backgroundColor || 0x000000,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    })
    
    this.container = new Container()
    this.app.stage.addChild(this.container)
  }

  // สร้าง text element พร้อม style ที่สวยงาม
  createStyledText(content: string, style: Partial<TextStyle> = {}): Text {
    const defaultStyle: TextStyle = {
      fontSize: 48,
      fontFamily: 'Kanit, Arial, sans-serif',
      fill: ['#FFFFFF', '#E0E0E0'],
      stroke: '#000000',
      strokeThickness: 4,
      dropShadow: {
        alpha: 0.8,
        angle: Math.PI / 6,
        blur: 4,
        color: '#000000',
        distance: 2
      },
      align: 'center',
      wordWrap: true,
      wordWrapWidth: this.app.screen.width * 0.8
    }
    
    const finalStyle = { ...defaultStyle, ...style }
    const text = new Text(content, finalStyle)
    
    // Center text by default
    text.anchor.set(0.5)
    text.x = this.app.screen.width / 2
    text.y = this.app.screen.height / 2
    
    return text
  }

  // เพิ่ม effects ให้กับ element
  addEffects(element: Container, effects: string[]) {
    const filters: Filter[] = []
    
    effects.forEach(effect => {
      switch (effect) {
        case 'glow':
          filters.push(new GlowFilter({
            distance: 15,
            outerStrength: 2,
            innerStrength: 1,
            color: 0xFFFFFF,
            quality: 0.5
          }))
          break
        case 'shadow':
          filters.push(new DropShadowFilter({

            distance: 5,
            color: 0x000000,
            alpha: 0.5,
            blur: 2
          }))
          break
        case 'outline':
          filters.push(new OutlineFilter(2, 0x000000))
          break
      }
    })
    
    if (filters.length > 0) {
      element.filters = filters
    }
  }

  // Animations สำหรับ text และ elements
  animateElement(element: Container, animation: string, duration: number = 1) {
    switch (animation) {
      case 'fadeIn':
        element.alpha = 0
        gsap.to(element, { alpha: 1, duration })
        break
        
      case 'fadeInUp':
        element.alpha = 0
        element.y += 50
        gsap.to(element, { 
          alpha: 1, 
          y: element.y - 50, 
          duration,
          ease: 'power2.out'
        })
        break
        
      case 'bounceIn':
        element.scale.set(0)
        gsap.to(element.scale, {
          x: 1,
          y: 1,
          duration,
          ease: 'bounce.out'
        })
        break
        
      case 'slideInLeft':
        element.x = -element.width
        gsap.to(element, {
          x: this.app.screen.width / 2,
          duration,
          ease: 'power2.out'
        })
        break
        
      case 'zoomIn':
        element.scale.set(0.5)
        element.alpha = 0
        gsap.to(element, {
          alpha: 1,
          duration: duration / 2
        })
        gsap.to(element.scale, {
          x: 1,
          y: 1,
          duration,
          ease: 'power2.out'
        })
        break
        
      case 'shake':
        gsap.to(element, {
          x: element.x + 10,
          duration: 0.1,
          repeat: duration * 10,
          yoyo: true,
          ease: 'power2.inOut'
        })
        break
    }
  }

  // สร้าง background effects
  createBackground(type: string): Container {
    const bg = new Container()
    
    switch (type) {
      case 'gradient':
        const graphics = new Graphics()
        const colors = [0x1a1a2e, 0x16213e, 0x0f3460]
        
        // Create gradient manually
        graphics.beginFill(colors[0])
        graphics.drawRect(0, 0, this.app.screen.width, this.app.screen.height)
        graphics.endFill()
        bg.addChild(graphics)
        
        // Add gradient overlay
        for (let i = 1; i < colors.length; i++) {
          const overlay = new Graphics()
          overlay.beginFill(colors[i])
          overlay.drawRect(0, 0, this.app.screen.width, this.app.screen.height)
          overlay.endFill()
          overlay.alpha = 0.5 / i
          bg.addChild(overlay)
        }
        break
        
      case 'particles':
        // สร้าง particle effects
        for (let i = 0; i < 50; i++) {
          const particle = new Graphics()
          particle.beginFill(0xFFFFFF, Math.random() * 0.5)
          particle.drawCircle(0, 0, Math.random() * 3)
          particle.endFill()
          particle.x = Math.random() * this.app.screen.width
          particle.y = Math.random() * this.app.screen.height
          
          // Animate particles
          gsap.to(particle, {
            y: particle.y - 100,
            alpha: 0,
            duration: 3 + Math.random() * 2,
            repeat: -1,
            delay: Math.random() * 3
          })
          
          bg.addChild(particle)
        }
        break
        
      case 'crypto':
        // สร้าง crypto-themed background
        const cryptoBg = new Graphics()
        cryptoBg.beginFill(0x0a0a0a)
        cryptoBg.drawRect(0, 0, this.app.screen.width, this.app.screen.height)
        cryptoBg.endFill()
        
        // เพิ่ม grid lines
        const grid = new Graphics()
        grid.lineStyle(1, 0x1a1a1a, 0.5)
        for (let i = 0; i < this.app.screen.width; i += 50) {
          grid.moveTo(i, 0)
          grid.lineTo(i, this.app.screen.height)
        }
        for (let i = 0; i < this.app.screen.height; i += 50) {
          grid.moveTo(0, i)
          grid.lineTo(this.app.screen.width, i)
        }
        
        bg.addChild(cryptoBg, grid)
        break
    }
    
    return bg
  }

  // สร้าง gradient texture
  private createGradientTexture(colors: string[]): Texture {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 256)
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color)
    })
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 256)
    
    return Texture.from(canvas)
  }

  // เริ่มการ record
  async startRecording(options: { fps: number; duration: number }) {
    this.isRecording = true
    this.recordedFrames = []
    
    const frameInterval = 1000 / options.fps
    const totalFrames = options.fps * options.duration
    
    for (let i = 0; i < totalFrames && this.isRecording; i++) {
      await this.captureFrame()
      await new Promise(resolve => setTimeout(resolve, frameInterval))
    }
    
    return this.recordedFrames
  }

  // Capture frame เดียว
  private async captureFrame(): Promise<void> {
    return new Promise((resolve) => {
      this.app.view.toBlob((blob) => {
        if (blob) {
          this.recordedFrames.push(blob)
        }
        resolve()
      }, 'image/webp', 0.95)
    })
  }

  // หยุดการ record
  stopRecording() {
    this.isRecording = false
  }

  // Clear stage
  clear() {
    this.container.removeChildren()
  }

  // Destroy renderer
  destroy() {
    this.app.destroy(true)
  }

  // Render shot ตาม timeline
  async renderShot(shot: any, audioAnalyser?: AnalyserNode) {
    this.clear()
    
    // เพิ่ม background
    if (shot.bg) {
      const bg = this.createBackground(shot.bg)
      this.container.addChild(bg)
    }
    
    // เพิ่ม text
    if (shot.text) {
      const text = this.createStyledText(shot.text)
      
      // เพิ่ม effects
      if (shot.fx && shot.fx.length > 0) {
        this.addEffects(text, shot.fx)
      }
      
      // เพิ่ม animation
      if (shot.animation) {
        this.animateElement(text, shot.animation)
      }
      
      this.container.addChild(text)
      
      // Audio reactive effects
      if (audioAnalyser) {
        this.addAudioReactiveEffects(text, audioAnalyser)
      }
    }
    
    // รอให้ animations เสร็จ
    await new Promise(resolve => setTimeout(resolve, shot.d * 1000))
  }

  // Audio reactive effects
  private addAudioReactiveEffects(element: Container, analyser: AnalyserNode) {
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    
    const animate = () => {
      if (!this.isRecording) return
      
      analyser.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length
      const scale = 1 + (average / 256) * 0.2
      
      gsap.to(element.scale, {
        x: scale,
        y: scale,
        duration: 0.1,
        ease: 'power2.out'
      })
      
      requestAnimationFrame(animate)
    }
    
    animate()
  }

  // Export frames เป็น video
  async exportVideo(frames: Blob[], fps: number): Promise<Blob> {
    // ใช้ WebCodecs API หรือ ffmpeg.wasm
    // ตัวอย่างนี้ return WebM blob
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    // สร้าง MediaRecorder
    const stream = canvas.captureStream(fps)
    const recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9,opus',
      videoBitsPerSecond: 8000000
    })
    
    const chunks: Blob[] = []
    recorder.ondataavailable = (e) => chunks.push(e.data)
    
    return new Promise((resolve) => {
      recorder.onstop = () => {
        resolve(new Blob(chunks, { type: 'video/webm' }))
      }
      
      recorder.start()
      
      // Play frames
      let frameIndex = 0
      const playFrame = async () => {
        if (frameIndex < frames.length) {
          const img = new Image()
          img.src = URL.createObjectURL(frames[frameIndex])
          await new Promise(r => img.onload = r)
          
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)
          
          frameIndex++
          setTimeout(playFrame, 1000 / fps)
        } else {
          recorder.stop()
        }
      }
      
      playFrame()
    })
  }
}

// Export singleton factory
export const createVideoRenderer = (canvas: HTMLCanvasElement, options: RenderOptions) => {
  return new VideoRenderer(canvas, options)
}