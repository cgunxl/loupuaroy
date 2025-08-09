import type { Container } from 'pixi.js'

export type FxName =
  | 'typewriter'
  | 'slideIn'
  | 'popIn'
  | 'highlightGlow'
  | 'flicker'
  | 'countUp'
  | 'pan'
  | 'kenBurns'
  | 'parallax'
  | 'shake'
  | 'dollyZoom'
  | 'glitch'
  | 'lightSweep'
  | 'speedLines'
  | 'particleBurst'
  | 'colorGrade'

export function applyFx(target: Container, fx: FxName[], at: number, d: number, tl: any) {
  fx.forEach((name) => {
    switch (name) {
      case 'popIn':
        tl.fromTo(target, { alpha: 0, scale: 0.92 }, { alpha: 1, scale: 1, duration: Math.min(0.6, d) }, at)
        break
      case 'slideIn':
        tl.fromTo(target, { x: '+=40', alpha: 0 }, { x: '-=40', alpha: 1, duration: Math.min(0.7, d) }, at)
        break
      case 'shake':
        tl.to(target, { x: '+=6', repeat: 7, yoyo: true, duration: Math.min(0.35, d / 3) }, at + d * 0.4)
        break
      default:
        break
    }
  })
}