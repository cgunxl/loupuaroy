import { useEffect, useRef } from 'react'
import { Application, Container, Text, TextStyle } from 'pixi.js'
import gsap from 'gsap'
import { useAppStore } from '../store'

export default function CanvasStage() {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const appRef = useRef<Application | null>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const { shots } = useAppStore()

  useEffect(() => {
    if (!stageRef.current) return
    const app = new Application()
    appRef.current = app
    app.init({ width: 960, height: 540, backgroundColor: 0x0a1210, antialias: true }).then(() => {
      stageRef.current!.appendChild(app.canvas as any)
      renderShots()
    })

    return () => {
      app.destroy(true, { children: true })
      appRef.current = null
      tlRef.current?.kill()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (appRef.current) {
      renderShots()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shots])

  function renderShots() {
    const app = appRef.current!
    app.stage.removeChildren()
    tlRef.current?.kill()
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
    tlRef.current = tl

    const root = new Container()
    app.stage.addChild(root)

    shots.forEach((shot) => {
      const group = new Container()
      root.addChild(group)
      group.visible = false

      const style = new TextStyle({
        fontFamily: 'Inter, system-ui',
        fill: 0xe8f5e9,
        fontSize: 40,
        align: 'center',
        stroke: 0x08351f,
        wordWrap: true,
        wordWrapWidth: 880,
      })
      const txt = new Text({ text: shot.text, style })
      txt.anchor.set(0.5)
      txt.position.set(480, 270)
      group.addChild(txt)

      tl.addLabel(`shot_${shot.t}`)
      tl.to(group, { alpha: 1, onStart: () => { group.visible = true } }, shot.t)
      tl.fromTo(
        txt.scale,
        { x: 0.9, y: 0.9 },
        { x: 1.0, y: 1.0, duration: Math.min(shot.d, 0.8) },
        shot.t
      )
      tl.to(group, { alpha: 0, onComplete: () => { group.visible = false } }, shot.t + shot.d - 0.2)
    })

    // Auto play
    tl.eventCallback('onComplete', () => { tl.pause(0) })
    tl.play(0)
  }

  return <div className="panel canvas-panel" ref={stageRef} />
}