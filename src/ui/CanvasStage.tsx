import React, { useEffect, useRef, useState } from 'react'
import { Application, Container, Sprite, Text as PixiText, TextStyle } from 'pixi.js'
import { gsap } from 'gsap'
import { useStore } from '../store'
import { FX } from '../core/effects'
import { performanceMonitor } from '../core/performance'
import { computeRMS } from '../core/lipsync'

export function CanvasStage(){
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string>('')
  const { analyser } = useStore()
  const shots = useStore(s=>s.project.shots)
  const project = useStore(s=>s.project)

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

        // Mascot with mouth frames
        const mascotLayer = new Container()
        stage.addChild(mascotLayer)

        const loadSpriteFromFile = async (f?: File) => {
          if (!f) return undefined as unknown as Sprite | undefined
          const url = URL.createObjectURL(f)
          const sp = await Sprite.from({ source: url })
          sp.anchor.set(0.5)
          sp.x = app.screen.width * 0.5
          sp.y = app.screen.height * 0.6
          sp.scale.set( performanceMonitor.shouldReduceEffects() ? 0.6 : 0.8 )
          return sp
        }

        const mouthOpen = await loadSpriteFromFile(project.mouthOpenFile)
        const mouthClose = await loadSpriteFromFile(project.mouthCloseFile)
        const mascotBase = await loadSpriteFromFile(project.mascotFile)

        if (mascotBase) mascotLayer.addChild(mascotBase)
        if (mouthClose) mascotLayer.addChild(mouthClose)
        if (mouthOpen) { mouthOpen.visible = false; mascotLayer.addChild(mouthOpen) }

        // Simple lip sync driven by analyser RMS
        let rafId = 0
        const loop = () => {
          if (analyser && (mouthOpen || mouthClose)){
            const rms = computeRMS(analyser)
            const talking = rms > 0.06
            if (mouthOpen) mouthOpen.visible = talking
            if (mouthClose) mouthClose.visible = !talking
            if (mascotBase) mascotBase.y = (app.screen.height * 0.6) + (talking ? -2 : 0)
          }
          rafId = requestAnimationFrame(loop)
        }
        loop()

        const textLayer = new Container()
        stage.addChild(textLayer)

        // Subtitles at bottom
        const sub = new PixiText('', new TextStyle({
          fill:'#ffffff', fontFamily:'Inter', fontSize: 28,
          stroke:'#000', strokeThickness: 4
        }))
        sub.anchor.set(0.5)
        sub.x = app.screen.width/2
        sub.y = app.screen.height*0.9
        sub.alpha = 0.9
        stage.addChild(sub)

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

          // Subtitle cue
          timeline.call(()=>{ sub.text = s.text }, undefined, t)
          t += s.d
        })
        setError('')

        return () => { cancelAnimationFrame(rafId) }
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการแสดงผล: ' + (err as Error).message)
      }
    }).catch(err => {
      setError('ไม่สามารถเริ่มต้น Canvas ได้: ' + (err as Error).message)
    })
    
    return () => { 
      // Cleanup handled by React unmount 
    }
  }, [shots, analyser, project.mascotFile, project.mouthOpenFile, project.mouthCloseFile])

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