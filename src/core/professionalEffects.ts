// Professional Video Effects System
// ระบบ effects วิดีโอระดับมืออาชีพเหมือน TikTok จริงๆ

import { Application, Container, Graphics, Text, Sprite, filters, Filter } from 'pixi.js'
import { GlowFilter, DropShadowFilter, OutlineFilter, MotionBlurFilter, RGBSplitFilter, ZoomBlurFilter, TwistFilter, BulgePinchFilter } from 'pixi-filters'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { TextPlugin } from 'gsap/TextPlugin'

gsap.registerPlugin(CustomEase, TextPlugin)

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
        return gsap.to(text, { alpha: 1, duration: 0.5 })
    }
  }

  // Typewriter effect พร้อมเสียง
  private typewriterEffect(text: Text): gsap.core.Tween {
    const originalText = text.text
    text.text = ''
    
    return gsap.to(text, {
      duration: originalText.length * 0.05,
      text: originalText,
      ease: 'none',
      onUpdate: function() {
        // เล่นเสียงพิมพ์
        if (Math.random() > 0.7) {
          this.playSound('typewriter')
        }
      }.bind(this)
    })
  }

  // Glitch reveal effect
  private glitchRevealEffect(text: Text, tl: gsap.core.Timeline): gsap.core.Timeline {
    const rgbSplit = new RGBSplitFilter()
    text.filters = [rgbSplit]
    
    tl.set(text, { alpha: 0 })
      .to(text, { 
        alpha: 1, 
        duration: 0.1,
        ease: 'steps(5)'
      })
      .to(rgbSplit, {
        red: [10, 0],
        green: [-10, 0],
        blue: [5, 0],
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      }, '<')
      .to(text.scale, {
        x: 1.1,
        y: 1.1,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      }, '<')
    
    return tl
  }

  // Bounce scale effect
  private bounceScaleEffect(text: Text, tl: gsap.core.Timeline): gsap.core.Timeline {
    text.scale.set(0)
    
    tl.to(text.scale, {
      x: 1.2,
      y: 1.2,
      duration: 0.5,
      ease: 'back.out(3)'
    })
    .to(text.scale, {
      x: 1,
      y: 1,
      duration: 0.3,
      ease: 'elastic.out(1, 0.3)'
    })
    
    return tl
  }

  // Neon glow effect
  private neonGlowEffect(text: Text): gsap.core.Tween {
    const glowFilter = new GlowFilter({
      distance: 20,
      outerStrength: 3,
      innerStrength: 1,
      color: 0x00ff00,
      quality: 0.5
    })
    
    text.filters = [glowFilter]
    
    return gsap.to(glowFilter, {
      outerStrength: 5,
      distance: 30,
      duration: 1,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    })
  }

  // Split text animation
  private splitTextEffect(text: Text, tl: gsap.core.Timeline): gsap.core.Timeline {
    const chars = text.text.split('')
    const container = new Container()
    container.position = text.position.clone()
    text.parent.addChild(container)
    text.visible = false
    
    const charSprites: Text[] = []
    let xOffset = 0
    
    chars.forEach((char, i) => {
      const charText = new Text(char, text.style)
      charText.x = xOffset
      charText.y = 0
      charText.alpha = 0
      charText.scale.set(0)
      container.addChild(charText)
      charSprites.push(charText)
      xOffset += charText.width
    })
    
    // Center container
    container.pivot.x = container.width / 2
    container.pivot.y = container.height / 2
    
    charSprites.forEach((char, i) => {
      tl.to(char, {
        alpha: 1,
        scale: 1,
        duration: 0.3,
        ease: 'back.out(2)',
        delay: i * 0.05
      }, i * 0.02)
    })
    
    return tl
  }

  // Wave text effect
  private waveTextEffect(text: Text, tl: gsap.core.Timeline): gsap.core.Timeline {
    const originalY = text.y
    
    tl.to(text, {
      y: originalY - 20,
      duration: 0.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    })
    
    return tl
  }

  // Explosion text effect
  private explosionTextEffect(text: Text, tl: gsap.core.Timeline): gsap.core.Timeline {
    const particles: Graphics[] = []
    const particleCount = 20
    
    for (let i = 0; i < particleCount; i++) {
      const particle = new Graphics()
      particle.beginFill(0xFFFFFF, 0.8)
      particle.drawCircle(0, 0, Math.random() * 5 + 2)
      particle.endFill()
      particle.x = text.x
      particle.y = text.y
      particle.alpha = 0
      text.parent.addChild(particle)
      particles.push(particle)
    }
    
    text.scale.set(0)
    text.alpha = 0
    
    tl.to(text, {
      alpha: 1,
      scale: 1.5,
      duration: 0.3,
      ease: 'power4.out'
    })
    .to(text.scale, {
      x: 1,
      y: 1,
      duration: 0.2,
      ease: 'power2.in'
    })
    
    particles.forEach((particle, i) => {
      const angle = (i / particleCount) * Math.PI * 2
      const distance = Math.random() * 200 + 100
      
      tl.to(particle, {
        x: text.x + Math.cos(angle) * distance,
        y: text.y + Math.sin(angle) * distance,
        alpha: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, 0)
      .to(particle, {
        alpha: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => particle.destroy()
      }, 0.3)
    })
    
    return tl
  }

  // 3D rotate effect
  private rotate3DEffect(text: Text, tl: gsap.core.Timeline): gsap.core.Timeline {
    tl.set(text, { alpha: 0 })
      .to(text, {
        alpha: 1,
        duration: 0.5
      })
      .to(text.scale, {
        x: 0.1,
        duration: 0.5,
        ease: 'power2.in'
      })
      .to(text.scale, {
        x: 1,
        duration: 0.5,
        ease: 'power2.out'
      })
      .to(text.skew, {
        x: 0.2,
        y: -0.1,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: 'sine.inOut'
      }, '<')
    
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
        
      default:
        return this.fadeTransition(from, to, transition, tl)
    }
  }

  // Swipe transition
  private swipeTransition(from: Container, to: Container, options: TransitionEffect, tl: gsap.core.Timeline): gsap.core.Timeline {
    const direction = options.direction || 'left'
    const distance = this.app.screen.width
    
    const positions = {
      left: { from: -distance, to: distance },
      right: { from: distance, to: -distance },
      up: { from: -distance, to: distance },
      down: { from: distance, to: -distance }
    }
    
    const axis = direction === 'left' || direction === 'right' ? 'x' : 'y'
    const pos = positions[direction]
    
    to[axis] = pos.from
    to.alpha = 1
    
    tl.to(from, {
      [axis]: pos.to,
      duration: options.duration,
      ease: 'power2.inOut'
    })
    .to(to, {
      [axis]: 0,
      duration: options.duration,
      ease: 'power2.inOut'
    }, '<')
    
    return tl
  }

  // Zoom transition
  private zoomTransition(from: Container, to: Container, options: TransitionEffect, tl: gsap.core.Timeline): gsap.core.Timeline {
    const zoomBlur = new ZoomBlurFilter()
    from.filters = [zoomBlur]
    
    to.scale.set(0.5)
    to.alpha = 0
    
    tl.to(zoomBlur, {
      strength: 0.3,
      duration: options.duration * 0.5,
      ease: 'power2.in'
    })
    .to(from.scale, {
      x: 2,
      y: 2,
      duration: options.duration * 0.5,
      ease: 'power2.in'
    }, '<')
    .to(from, {
      alpha: 0,
      duration: options.duration * 0.3
    }, '<')
    .to(to, {
      alpha: 1,
      duration: options.duration * 0.3
    }, '<')
    .to(to.scale, {
      x: 1,
      y: 1,
      duration: options.duration * 0.5,
      ease: 'back.out(1.5)'
    }, '-=0.2')
    
    return tl
  }

  // Glitch transition
  private glitchTransition(from: Container, to: Container, options: TransitionEffect, tl: gsap.core.Timeline): gsap.core.Timeline {
    const rgbSplit = new RGBSplitFilter()
    const twist = new TwistFilter()
    
    from.filters = [rgbSplit, twist]
    to.alpha = 0
    
    // Glitch sequence
    for (let i = 0; i < 5; i++) {
      tl.to(rgbSplit, {
        red: [Math.random() * 20 - 10, Math.random() * 20 - 10],
        green: [Math.random() * 20 - 10, Math.random() * 20 - 10],
        blue: [Math.random() * 20 - 10, Math.random() * 20 - 10],
        duration: 0.05,
        ease: 'none'
      })
      .to(twist, {
        angle: Math.random() * 2 - 1,
        radius: Math.random() * 0.5,
        duration: 0.05,
        ease: 'none'
      }, '<')
    }
    
    tl.to(from, {
      alpha: 0,
      duration: 0.1
    })
    .set(to, { alpha: 1 })
    .set(from, { filters: [] })
    
    return tl
  }

  // Shake transition
  private shakeTransition(from: Container, to: Container, options: TransitionEffect, tl: gsap.core.Timeline): gsap.core.Timeline {
    const intensity = options.intensity || 20
    const shakeCount = 10
    
    to.alpha = 0
    
    for (let i = 0; i < shakeCount; i++) {
      tl.to(from, {
        x: from.x + (Math.random() - 0.5) * intensity,
        y: from.y + (Math.random() - 0.5) * intensity,
        duration: options.duration / shakeCount,
        ease: 'none'
      })
    }
    
    tl.to(from, {
      alpha: 0,
      duration: 0.2
    }, '-=0.2')
    .to(to, {
      alpha: 1,
      duration: 0.2
    }, '<')
    
    return tl
  }

  // Spin transition
  private spinTransition(from: Container, to: Container, options: TransitionEffect, tl: gsap.core.Timeline): gsap.core.Timeline {
    const motionBlur = new MotionBlurFilter()
    from.filters = [motionBlur]
    
    to.rotation = Math.PI * 2
    to.scale.set(0)
    to.alpha = 0
    
    tl.to(from, {
      rotation: -Math.PI * 2,
      duration: options.duration,
      ease: 'power2.inOut'
    })
    .to(from.scale, {
      x: 0,
      y: 0,
      duration: options.duration,
      ease: 'power2.inOut'
    }, '<')
    .to(motionBlur, {
      velocity: { x: 50, y: 50 },
      duration: options.duration * 0.5
    }, '<')
    .to(to, {
      alpha: 1,
      duration: 0.1
    }, options.duration * 0.5)
    .to(to, {
      rotation: 0,
      duration: options.duration * 0.5,
      ease: 'power2.out'
    }, '<')
    .to(to.scale, {
      x: 1,
      y: 1,
      duration: options.duration * 0.5,
      ease: 'back.out(1.5)'
    }, '<')
    
    return tl
  }

  // Morph transition
  private morphTransition(from: Container, to: Container, options: TransitionEffect, tl: gsap.core.Timeline): gsap.core.Timeline {
    const bulge = new BulgePinchFilter()
    from.filters = [bulge]
    
    to.alpha = 0
    to.filters = [bulge]
    
    tl.to(bulge, {
      strength: 1,
      duration: options.duration * 0.5,
      ease: 'power2.in'
    })
    .to(from, {
      alpha: 0,
      duration: 0.1
    })
    .set(to, { alpha: 1 })
    .to(bulge, {
      strength: 0,
      duration: options.duration * 0.5,
      ease: 'power2.out'
    })
    
    return tl
  }

  // Fade transition
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
    }, '-=0.2')
    
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
        return container
    }
  }

  // Particle background
  private createParticleBackground(container: Container): Container {
    const particleCount = 100
    const particles: Graphics[] = []
    
    for (let i = 0; i < particleCount; i++) {
      const particle = new Graphics()
      const size = Math.random() * 4 + 1
      particle.beginFill(0xFFFFFF, Math.random() * 0.5 + 0.2)
      particle.drawCircle(0, 0, size)
      particle.endFill()
      
      particle.x = Math.random() * this.app.screen.width
      particle.y = Math.random() * this.app.screen.height
      
      container.addChild(particle)
      particles.push(particle)
      
      // Animate particle
      gsap.to(particle, {
        y: particle.y - this.app.screen.height - 50,
        duration: Math.random() * 10 + 10,
        repeat: -1,
        ease: 'none',
        delay: Math.random() * 10
      })
      
      gsap.to(particle, {
        x: particle.x + (Math.random() - 0.5) * 100,
        duration: Math.random() * 5 + 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }
    
    return container
  }

  // Gradient background
  private createGradientBackground(container: Container): Container {
    const graphics = new Graphics()
    const colors = [0x1a1a2e, 0x16213e, 0x0f3460, 0x533483]
    
    // Create gradient mesh
    const segments = 10
    const height = this.app.screen.height / segments
    
    for (let i = 0; i < segments; i++) {
      const color1 = colors[i % colors.length]
      const color2 = colors[(i + 1) % colors.length]
      const alpha = 1 - (i / segments) * 0.3
      
      graphics.beginFill(color1, alpha)
      graphics.drawRect(0, i * height, this.app.screen.width, height)
      graphics.endFill()
    }
    
    container.addChild(graphics)
    
    // Animate gradient
    gsap.to(graphics, {
      y: -height,
      duration: 20,
      repeat: -1,
      ease: 'none'
    })
    
    return container
  }

  // Wave background
  private createWaveBackground(container: Container): Container {
    const waveCount = 5
    
    for (let i = 0; i < waveCount; i++) {
      const wave = new Graphics()
      const color = 0x0066CC
      const alpha = 0.1 + (i / waveCount) * 0.2
      
      wave.beginFill(color, alpha)
      
      // Draw wave shape
      const points: number[] = []
      const segments = 50
      const waveHeight = 50 + i * 20
      
      for (let j = 0; j <= segments; j++) {
        const x = (j / segments) * this.app.screen.width
        const y = this.app.screen.height * 0.7 + 
                  Math.sin((j / segments) * Math.PI * 2) * waveHeight
        points.push(x, y)
      }
      
      wave.drawPolygon(points)
      wave.lineTo(this.app.screen.width, this.app.screen.height)
      wave.lineTo(0, this.app.screen.height)
      wave.endFill()
      
      container.addChild(wave)
      
      // Animate wave
      gsap.to(wave, {
        y: Math.sin(i) * 20,
        duration: 3 + i * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }
    
    return container
  }

  // Matrix background
  private createMatrixBackground(container: Container): Container {
    const chars = '01'
    const fontSize = 14
    const columns = Math.floor(this.app.screen.width / fontSize)
    
    for (let i = 0; i < columns; i++) {
      const x = i * fontSize
      const charCount = Math.floor(Math.random() * 20 + 10)
      
      for (let j = 0; j < charCount; j++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const text = new Text(char, {
          fontFamily: 'monospace',
          fontSize: fontSize,
          fill: 0x00FF00,
          align: 'center'
        })
        
        text.x = x
        text.y = -fontSize * j
        text.alpha = 1 - (j / charCount) * 0.8
        
        container.addChild(text)
        
        // Animate falling
        gsap.to(text, {
          y: this.app.screen.height + fontSize * charCount,
          duration: Math.random() * 5 + 5,
          repeat: -1,
          ease: 'none',
          delay: Math.random() * 5
        })
      }
    }
    
    return container
  }

  // Stars background
  private createStarsBackground(container: Container): Container {
    const starCount = 200
    
    for (let i = 0; i < starCount; i++) {
      const star = new Graphics()
      const size = Math.random() * 2 + 0.5
      
      star.beginFill(0xFFFFFF)
      star.drawStar(0, 0, 4, size, size * 0.5)
      star.endFill()
      
      star.x = Math.random() * this.app.screen.width
      star.y = Math.random() * this.app.screen.height
      star.alpha = Math.random() * 0.8 + 0.2
      
      container.addChild(star)
      
      // Twinkle animation
      gsap.to(star, {
        alpha: star.alpha * 0.3,
        duration: Math.random() * 2 + 1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2
      })
      
      // Slight movement
      gsap.to(star, {
        x: star.x + (Math.random() - 0.5) * 10,
        y: star.y + (Math.random() - 0.5) * 10,
        duration: Math.random() * 10 + 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }
    
    return container
  }

  // Sound effects
  private playSound(soundType: string) {
    // Implementation for sound effects
    // This would connect to your audio system
    console.log(`Playing sound: ${soundType}`)
  }

  // Clean up effects
  clearEffects(container: Container) {
    if (container.filters) {
      container.filters = []
    }
    gsap.killTweensOf(container)
    container.children.forEach(child => {
      if (child.filters) {
        child.filters = []
      }
      gsap.killTweensOf(child)
    })
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