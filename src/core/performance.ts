export class PerformanceMonitor {
  private fps = 0
  private frameCount = 0
  private lastTime = performance.now()
  private lowFPSThreshold = 30

  update() {
    this.frameCount++
    const currentTime = performance.now()
    
    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime))
      this.frameCount = 0
      this.lastTime = currentTime
    }
  }

  getFPS(): number {
    return this.fps
  }

  isLowFPS(): boolean {
    return this.fps < this.lowFPSThreshold
  }

  shouldReduceEffects(): boolean {
    return this.isLowFPS()
  }

  getRecommendedSettings() {
    if (this.isLowFPS()) {
      return {
        reduceParticles: true,
        reduceBloom: true,
        reduceShadows: true,
        lowerResolution: true
      }
    }
    return {
      reduceParticles: false,
      reduceBloom: false,
      reduceShadows: false,
      lowerResolution: false
    }
  }
}

export const performanceMonitor = new PerformanceMonitor()