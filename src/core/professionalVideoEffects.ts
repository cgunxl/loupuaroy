// Professional Video Effects System
// ระบบ effects วิดีโอระดับมืออาชีพเหมือน TikTok จริงๆ

import { Application, Container, Graphics, Text, Sprite, Filter } from 'pixi.js'
import { GlowFilter, DropShadowFilter, OutlineFilter, MotionBlurFilter, RGBSplitFilter, ZoomBlurFilter, TwistFilter, BulgePinchFilter } from 'pixi-filters'
import gsap from 'gsap'

export interface EffectOptions {
  duration: number
  intensity: number
  easing?: string
}

export interface TransitionEffect {
  type: 'swipe' | 'zoom' | 'glitch' | 'fade' | 'shake' | 'spin' | 'morph'
  duration: number
  direction?: 'left' | 'right' | 'up' | 'down'
  intensity?: number
}

export class ProfessionalEffects {
  private app: Application
  private currentEffects: Map<string, Filter> = new Map()

  constructor(app: Application) {
    this.app = app
  }

  // Text Effects ที่ TikTok ใช้จริง
  createTikTokTextEffect(text: Text, effect: string): gsap.core.Tween | gsap.core.Timeline {
    const tl = gsap.timeline()
    
    switch (effect) {
      case 'typewriter':
        return this.typewriterEffect(text)
      case 'glitchReveal':
        return this.glitchRevealEffect(text, tl)
      case 'bounceScale':
        return this.bounceScaleEffect(text, tl)
      case 'neonGlow':
        return this.neonGlowEffect(text)
      case 'splitText':
        return this.splitTextEffect(text, tl)
      case 'waveText':
        return this.waveTextEffect(text, tl)
      case 'explosionText':
        return this.explosionTextEffect(text, tl)
      case '3dRotate':
        return this.rotate3DEffect(text, tl)
      default:
        return this.bounceScaleEffect(text, tl)
    }
  }

  private typewriterEffect(text: Text): gsap.core.Tween {
    const originalText = text.text
    text.text = ''
    
    return gsap.to(text, {
      duration: originalText.length * 0.05,
      text: originalText,
      ease: 'none',
      onUpdate: () => {
        // Sound effect would go here
      }
    })
  }

  private glitchRevealEffect(text: Text, tl: gsap.core.Timeline): gsap.core.Timeline {
    const glitchFilter = new RGBSplitFilter([5, 0], [0, 5], [0, 0])
    text.filters = [glitchFilter]
    
    tl.from(text, { alpha: 0, duration: 0.1 })
      .to(glitchFilter, {
        red: [0, 0],
        green: [0, 0],
        duration: 0.5,
        ease: 'power2.out'
      })
    
    return tl
  }

  private bounceScaleEffect(text: Text, tl: gsap.core.Timeline): gsap.core.Timeline {
    text.scale.set(0)
    
    tl.to(text.scale, {
      x: 1.2,
      y: 1.2,
      duration: 0.3,
      ease: 'back.out(1.7)'
    })
    .to(text.scale, {
      x: 1,
      y: 1,
      duration: 0.2,
      ease: 'power2.inOut'
    })
    
    return tl
  }

  private neonGlowEffect(text: Text): gsap.core.Tween {
    const glowFilter = new GlowFilter({
      distance: 15,
      outerStrength: 2,
      innerStrength: 1,
      color: 0xff0080,
      quality: 0.5
    })
    
    text.filters = [glowFilter]
    
    return gsap.to(glowFilter, {
      outerStrength: 4,
      distance: 20,
      duration: 1,
      yoyo: true,
      repeat: -1,
      ease: 'power2.inOut'
    })
  }

  private splitTextEffect(text: Text, tl: gsap.core.Timeline): gsap.core.Timeline {
    // Simplified split text effect
    const chars = text.text.split('')
    const container = new Container()
    
    if (text.parent) {
      text.parent.addChild(container)
    } else {
      this.app.stage.addChild(container)
    }
    
    chars.forEach((char, i) => {
      const charText = new Text(char, text.style)
      charText.x = i * 30
      charText.alpha = 0
      container.addChild(charText)
      
      tl.to(charText, {
        alpha: 1,
        y: 0,
        duration: 0.5,
        delay: i * 0.05,
        ease: 'back.out(1.7)'
      }, 0)
    })
    
    text.visible = false
    return tl
  }

  private waveTextEffect(text: Text, tl: gsap.core.Timeline): gsap.core.Timeline {
    const amplitude = 20
    const frequency = 0.1
    
    tl.to(text, {
      duration: 2,
      ease: 'none',
      onUpdate: () => {
        const time = tl.progress() * Math.PI * 2
        text.y = Math.sin(time * frequency) * amplitude
      }
    })
    
    return tl
  }

  private explosionTextEffect(text: Text, tl: gsap.core.Timeline): gsap.core.Timeline {
    const particles: Graphics[] = []
    const particleCount = 20
    
    for (let i = 0; i < particleCount; i++) {
      const particle = new Graphics()
      particle.beginFill(0xffffff)
      particle.drawCircle(0, 0, Math.random() * 5 + 2)
      particle.endFill()
      particle.x = text.x
      particle.y = text.y
      particle.alpha = 0
      
      if (text.parent) {
        text.parent.addChild(particle)
      } else {
        this.app.stage.addChild(particle)
      }
      particles.push(particle)
      
      tl.to(particle, {
        x: text.x + (Math.random() - 0.5) * 200,
        y: text.y + (Math.random() - 0.5) * 200,
        alpha: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, 0)
      .to(particle, {
        alpha: 0,
        duration: 0.3
      }, 0.5)
    }
    
    tl.from(text, {
      alpha: 0,
      scale: 0,
      duration: 0.5,
      ease: 'back.out(1.7)'
    }, 0.2)
    
    return tl
  }

  private rotate3DEffect(text: Text, tl: gsap.core.Timeline): gsap.core.Timeline {
    tl.from(text, {
      rotationY: 90,
      alpha: 0,
      duration: 0.8,
      ease: 'power2.out'
    })
    
    return tl
  }

  // Transition Effects
  applyTransition(from: Container, to: Container, transition: TransitionEffect): gsap.core.Timeline {
    const tl = gsap.timeline()
    
    switch (transition.type) {
      case 'swipe':
        return this.swipeTransition(from, to, transition, tl)
      case 'zoom':
        return this.zoomTransition(from, to, transition, tl)
      case 'glitch':
        return this.glitchTransition(from, to, transition, tl)
      case 'shake':
        return this.shakeTransition(from, to, transition, tl)
      case 'spin':
        return this.spinTransition(from, to, transition, tl)
      case 'morph':
        return this.morphTransition(from, to, transition, tl)
      case 'fade':
      default:
        return this.fadeTransition(from, to, transition, tl)
    }
  }

  private swipeTransition(from: Container, to: Container, options: TransitionEffect, tl: gsap.core.Timeline): gsap.core.Timeline {
    const direction = options.direction || 'left'
    const distance = this.app.screen.width
    
    const fromEndX = direction === 'left' ? -distance : distance
    const toStartX = direction === 'left' ? distance : -distance
    
    to.x = toStartX
    to.alpha = 1
    
    tl.to(from, {
      x: fromEndX,
      duration: options.duration,
      ease: 'power2.inOut'
    })
    .to(to, {
      x: 0,
      duration: options.duration,
      ease: 'power2.inOut'
    }, 0)
    
    return tl
  }

  private zoomTransition(from: Container, to: Container, options: TransitionEffect, tl: gsap.core.Timeline): gsap.core.Timeline {
    to.scale.set(0)
    to.alpha = 1
    
    tl.to(from.scale, {
      x: 2,
      y: 2,
      duration: options.duration,
      ease: 'power2.in'
    })
    .to(from, {
      alpha: 0,
      duration: options.duration * 0.5
    }, 0)
    .to(to.scale, {
      x: 1,
      y: 1,
      duration: options.duration,
      ease: 'power2.out'
    }, options.duration * 0.5)
    
    return tl
  }

  private glitchTransition(from: Container, to: Container, options: TransitionEffect, tl: gsap.core.Timeline): gsap.core.Timeline {
    const glitchFilter = new RGBSplitFilter([10, 0], [0, 10], [0, 0])
    from.filters = [glitchFilter]
    
    to.alpha = 0
    
    tl.to(glitchFilter, {
      red: [20, 0],
      green: [0, 20],
      blue: [-20, 0],
      duration: options.duration * 0.3,
      ease: 'power2.in'
    })
    .to(from, {
      alpha: 0,
      duration: 0.1
    })
    .set(to, { alpha: 1 })
    .from(to, {
      alpha: 0,
      duration: 0.1
    })
    
    return tl
  }

  private shakeTransition(from: Container, to: Container, options: TransitionEffect, tl: gsap.core.Timeline): gsap.core.Timeline {
    const intensity = options.intensity || 20
    
    to.alpha = 0
    
    tl.to(from, {
      x: `+=${intensity}`,
      duration: 0.05,
      yoyo: true,
      repeat: 10,
      ease: 'power2.inOut'
    })
    .to(from, {
      alpha: 0,
      duration: 0.2
    }, options.duration - 0.2)
    .set(to, { alpha: 1 }, options.duration)
    
    return tl
  }

  private spinTransition(from: Container, to: Container, options: TransitionEffect, tl: gsap.core.Timeline): gsap.core.Timeline {
    to.alpha = 0
    to.rotation = Math.PI * 2
    
    tl.to(from, {
      rotation: Math.PI * 2,
      alpha: 0,
      duration: options.duration,
      ease: 'power2.in'
    })
    .to(to, {
      rotation: 0,
      alpha: 1,
      duration: options.duration,
      ease: 'power2.out'
    }, options.duration * 0.5)
    
    return tl
  }

  private morphTransition(from: Container, to: Container, options: TransitionEffect, tl: gsap.core.Timeline): gsap.core.Timeline {
    const twistFilter = new TwistFilter({
      radius: 500,
      angle: 0,
      padding: 20
    })
    
    from.filters = [twistFilter]
    to.alpha = 0
    
    tl.to(twistFilter, {
      angle: 10,
      duration: options.duration * 0.5,
      ease: 'power2.in'
    })
    .to(from, {
      alpha: 0,
      duration: 0.1
    })
    .set(to, { alpha: 1 })
    .from(to, {
      scale: 0.5,
      duration: options.duration * 0.5,
      ease: 'back.out(1.7)'
    })
    
    return tl
  }

  private fadeTransition(from: Container, to: Container, options: TransitionEffect, tl: gsap.core.Timeline): gsap.core.Timeline {
    to.alpha = 0
    
    tl.to(from, {
      alpha: 0,
      duration: options.duration * 0.5,
      ease: 'power2.inOut'
    })
    .to(to, {
      alpha: 1,
      duration: options.duration * 0.5,
      ease: 'power2.inOut'
    }, options.duration * 0.5)
    
    return tl
  }

  // Background Effects
  createAnimatedBackground(type: string): Container {
    const container = new Container()
    
    switch (type) {
      case 'particles':
        return this.createParticleBackground(container)
      case 'gradient':
        return this.createGradientBackground(container)
      case 'waves':
        return this.createWaveBackground(container)
      case 'matrix':
        return this.createMatrixBackground(container)
      case 'stars':
        return this.createStarsBackground(container)
      default:
        return this.createGradientBackground(container)
    }
  }

  private createParticleBackground(container: Container): Container {
    const particleCount = 50
    const particles: Graphics[] = []
    
    for (let i = 0; i < particleCount; i++) {
      const particle = new Graphics()
      particle.beginFill(0xffffff, Math.random() * 0.5)
      particle.drawCircle(0, 0, Math.random() * 3 + 1)
      particle.endFill()
      
      particle.x = Math.random() * this.app.screen.width
      particle.y = Math.random() * this.app.screen.height
      
      container.addChild(particle)
      particles.push(particle)
      
      // Animate particle
      gsap.to(particle, {
        y: `-=${this.app.screen.height + 100}`,
        duration: Math.random() * 10 + 5,
        repeat: -1,
        ease: 'none',
        onRepeat: () => {
          particle.x = Math.random() * this.app.screen.width
          particle.y = this.app.screen.height + 50
        }
      })
    }
    
    return container
  }

  private createGradientBackground(container: Container): Container {
    const graphics = new Graphics()
    
    // Create gradient colors
    const colors = [0xFF0050, 0x00F2EA, 0x9D00FF]
    const height = this.app.screen.height
    const segmentHeight = height / (colors.length - 1)
    
    for (let i = 0; i < colors.length - 1; i++) {
      const y = i * segmentHeight
      graphics.beginFill(colors[i])
      graphics.drawRect(0, y, this.app.screen.width, segmentHeight)
      graphics.endFill()
    }
    
    container.addChild(graphics)
    
    // Animate gradient
    gsap.to(graphics, {
      alpha: 0.8,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'power2.inOut'
    })
    
    return container
  }

  private createWaveBackground(container: Container): Container {
    const graphics = new Graphics()
    container.addChild(graphics)
    
    const animate = () => {
      graphics.clear()
      const time = Date.now() * 0.001
      
      graphics.beginFill(0x0080FF, 0.3)
      graphics.moveTo(0, this.app.screen.height)
      
      for (let x = 0; x <= this.app.screen.width; x += 10) {
        const y = Math.sin(x * 0.01 + time) * 50 + this.app.screen.height / 2
        graphics.lineTo(x, y)
      }
      
      graphics.lineTo(this.app.screen.width, this.app.screen.height)
      graphics.endFill()
    }
    
    gsap.ticker.add(animate)
    
    return container
  }

  private createMatrixBackground(container: Container): Container {
    const chars = '01'
    const fontSize = 14
    const columns = Math.floor(this.app.screen.width / fontSize)
    const drops: number[] = []
    
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100
    }
    
    const graphics = new Graphics()
    container.addChild(graphics)
    
    const animate = () => {
      graphics.clear()
      graphics.beginFill(0x000000, 0.05)
      graphics.drawRect(0, 0, this.app.screen.width, this.app.screen.height)
      graphics.endFill()
      
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize
        
        const matrixText = new Text(text, {
          fontFamily: 'monospace',
          fontSize: fontSize,
          fill: 0x00FF00
        })
        matrixText.x = x
        matrixText.y = y
        container.addChild(matrixText)
        
        if (drops[i] * fontSize > this.app.screen.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }
    
    gsap.ticker.add(animate)
    
    return container
  }

  private createStarsBackground(container: Container): Container {
    const starCount = 100
    
    for (let i = 0; i < starCount; i++) {
      const star = new Graphics()
      star.beginFill(0xFFFFFF)
      star.drawStar(0, 0, 5, 2, 1)
      star.endFill()
      
      star.x = Math.random() * this.app.screen.width
      star.y = Math.random() * this.app.screen.height
      star.scale.set(Math.random() * 0.5 + 0.5)
      
      container.addChild(star)
      
      // Twinkle animation
      gsap.to(star, {
        alpha: Math.random() * 0.5 + 0.5,
        duration: Math.random() * 2 + 1,
        yoyo: true,
        repeat: -1,
        ease: 'power2.inOut'
      })
    }
    
    return container
  }

  // Sound effects
  private playSound(soundType: string) {
    // Sound implementation would go here
    console.log(`Playing sound: ${soundType}`)
  }

  // Clean up effects
  clearEffects(container: Container) {
    container.filters = []
    this.currentEffects.clear()
  }
}

// Helper to extend Graphics with star drawing
declare module 'pixi.js' {
  interface Graphics {
    drawStar(x: number, y: number, points: number, radius: number, innerRadius: number): this
  }
}

Graphics.prototype.drawStar = function(x: number, y: number, points: number, radius: number, innerRadius: number) {
  let angle = -Math.PI / 2
  const step = Math.PI / points
  
  this.moveTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius)
  
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? radius : innerRadius
    angle += step
    this.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r)
  }
  
  this.closePath()
  return this
}