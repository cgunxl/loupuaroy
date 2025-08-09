import React, { useEffect, useRef, useState } from 'react'
import { Application, Container, Text as PixiText, TextStyle } from 'pixi.js'
import { gsap } from 'gsap'
import { useStore } from '../store'
import { FX } from '../core/effects'
import { performanceMonitor } from '../core/performance'

export function CanvasStage(){
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string>('')
  const shots = useStore(s=>s.project.shots)

  useEffect(()=>{
    if (!ref.current) return
    
            const app = new Application()
        app.init({ 
          backgroundAlpha: 0, 
          resizeTo: ref.current,
          antialias: !performanceMonitor.shouldReduceEffects()
        }).then(async ()=>{
      try {
        ref.current!.innerHTML = ''
        ref.current!.appendChild(app.canvas)

        const stage = new Container()
        app.stage.addChild(stage)

        const textLayer = new Container()
        stage.addChild(textLayer)

        let t = 0
        const timeline = gsap.timeline({ defaults:{ ease:'power2.out' } })

        shots.forEach((s)=>{
          const txt = new PixiText(s.text, new TextStyle({
            fill:'#e8f5ee', fontFamily:'Bebas Neue', fontSize: performanceMonitor.shouldReduceEffects() ? 32 : 40, align:'center',
            stroke:'#00150c', strokeThickness: performanceMonitor.shouldReduceEffects() ? 2 : 4
          }))
          txt.anchor.set(0.5)
          txt.x = app.screen.width/2
          txt.y = app.screen.height/2
          txt.alpha = 0
          textLayer.addChild(txt)

          timeline.to(txt, { alpha:1, duration:0.2 }, t)
          s.fx.forEach(fx=>{
            const ctx = { stage, target: txt }
            switch (fx) {
              case 'glitch': FX.glitch(ctx, txt as any, 3, 0.6); break
              case 'shake': FX.shake(ctx, txt as any, 6, 0.3); break
              case 'typewriter': FX.typewriter(ctx, txt, 28); break
              case 'slideIn': FX.slideIn(ctx, txt as any, 'left', 140, .6); break
              case 'highlightGlow': FX.highlightGlow(ctx, txt as any, 1.2, .8); break
              case 'kenBurns': FX.kenBurns(ctx, txt as any, 1, 1.06, 0, 0, s.d); break
              case 'countUp': FX.countUp(ctx, txt, 0, 80, 1.2); break
              case 'lightSweep': FX.lightSweep(ctx, txt as any, 25, 1.0); break
              case 'popIn': FX.popIn(ctx, txt as any, 1.1, 0.35); break
              case 'speedLines': FX.speedLines(ctx, txt as any); break
              case 'particleBurst': FX.particleBurst(ctx, txt as any); break
              case 'colorGrade': FX.colorGrade(ctx, txt as any); break
            }
          })
          timeline.to(txt, { alpha:0, duration:0.15 }, t + s.d - 0.15)
          t += s.d
        })
        setError('')
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการแสดงผล: ' + (err as Error).message)
      }
    }).catch(err => {
      setError('ไม่สามารถเริ่มต้น Canvas ได้: ' + (err as Error).message)
    })
    
    return () => { 
      // Cleanup handled by React unmount 
    }
  }, [shots])

  return (
    <div>
      <h3>พรีวิว</h3>
      {error && <div className="card small" style={{color: 'var(--danger)', marginBottom: 8}}>{error}</div>}
      <div ref={ref} style={{width:'100%', height:'70vh', borderRadius:12, overflow:'hidden', background:'#09120f', border:'1px solid rgba(255,255,255,0.06)'}}/>
      {shots.length === 0 && (
        <div className="card small" style={{textAlign: 'center', marginTop: 8, color: 'var(--muted)'}}>
          ยังไม่มี Storyboard กรุณาสร้างจากแผงซ้าย
        </div>
      )}
    </div>
  )
}