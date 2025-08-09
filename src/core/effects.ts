import { gsap } from 'gsap'
import type { Container, Sprite, Text as PixiText } from 'pixi.js'
import { GlitchFilter, AdvancedBloomFilter } from 'pixi-filters'

export type FXContext = { stage: Container, target?: Sprite|PixiText|Container }

export const FX = {
  glitch(ctx:FXContext, target: any, amt=2, dur=0.6) {
    const f = new GlitchFilter({ slices: 5, fillMode: 3, offset: amt })
    target.filters = [f]
    gsap.to(f, { offset: 0, duration: dur, ease: 'power1.out', onComplete: ()=>{ target.filters = null } })
  },
  shake(_ctx:FXContext, target:any, intensity=6, dur=0.3) {
    const tl = gsap.timeline()
    tl.to(target, { x: `+=${intensity}`, yoyo: true, repeat: 7, duration: dur/8, ease:'power2.inOut' })
      .to(target, { x: `-=${intensity}`, duration: dur/8 }, 0)
  },
  typewriter(_ctx:FXContext, target: PixiText, speed=24) {
    const full = target.text
    target.text = ''
    let i = 0
    const iv = setInterval(()=>{
      target.text = full.slice(0, i++)
      if (i>full.length) clearInterval(iv)
    }, 1000/ speed)
  },
  slideIn(_ctx:FXContext, target:any, dir:'left'|'right'|'top'|'bottom'='left', dist=120, dur=0.6) {
    const prop = (dir==='left'||dir==='right')?'x':'y'
    const delta = (dir==='left'||dir==='top')? -dist : dist
    const from:any = {}; from[prop] = target[prop] + delta
    gsap.from(target, { ...from, duration: dur, ease: 'power3.out' })
  },
  popIn(_ctx:FXContext, target:any, _overshoot=1.12, dur=0.35) {
    gsap.from(target, { scale: 0.7, duration: dur, ease:'back.out(1.7)' })
  },
  highlightGlow(_ctx:FXContext, target:any, strength=1.4, dur=0.8) {
    const f = new AdvancedBloomFilter({ threshold: 0.6, bloomScale: strength })
    target.filters = [f]
    gsap.to(f, { bloomScale: 0.01, duration: dur, ease: 'power2.out', onComplete: ()=>{ target.filters = null } })
  },
  countUp(_ctx:FXContext, target: PixiText, from=0, to=80, dur=1.2) {
    const obj = { v: from }
    gsap.to(obj, { v: to, duration: dur, ease: 'power2.out', onUpdate: ()=>{ target.text = Math.round(obj.v).toString()+'%'} })
  },
  lightSweep(_ctx:FXContext, target:any, angle=25, dur=1.1) {
    gsap.fromTo(target, { skewX: 0 }, { skewX: angle, duration: dur/2, yoyo:true, repeat:1, ease:'sine.inOut' })
  },
  colorGrade(_ctx:FXContext, target:any) { gsap.to(target, { alpha: 0.95, duration: 0.6 }) },
  speedLines(_ctx:FXContext, target:any) { gsap.from(target, { x: '+=40', duration: 0.25, ease: 'power2.out' }) },
  particleBurst(_ctx:FXContext, target:any) { gsap.fromTo(target, { scale: 0.9 }, { scale: 1.05, duration: .25, yoyo:true, repeat:3 }) },
  kenBurns(_ctx:FXContext, target:any, zf=1.0, zt=1.15, px=0, py=0, dur=6) {
    gsap.fromTo(target, { scale: zf, x: target.x - px, y: target.y - py }, { scale: zt, duration: dur, ease:'sine.inOut' })
  },
  parallax(_ctx:FXContext, target:any, depth=0.2) { gsap.to(target, { x: `+=${20*depth}`, duration: 4, yoyo:true, repeat:-1, ease:'sine.inOut' }) },
  dollyZoom(_ctx:FXContext, target:any, from=1.0, to=1.1, dur=2) { gsap.fromTo(target, { scale: from }, { scale: to, duration: dur, ease:'sine.inOut' }) }
}