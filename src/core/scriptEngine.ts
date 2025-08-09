import type { NewsItem } from './rss'
import type { Shot } from '../store'

export type BuiltScript = {
  shots: Shot[]
  subtitles: { start:number; end:number; text:string }[]
}

function sanitize(text:string, censorWords:string[]) {
  let out = text
  for (const w of censorWords) {
    if (!w) continue
    const re = new RegExp(w.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'gi')
    out = out.replace(re, '***')
  }
  return out
}

export function buildFromNews(prompt:string, news:NewsItem[], duration=45, censorWords:string[]=['__BEEP__']): BuiltScript {
  const total = Math.max(30, Math.min(60, duration))
  const layout = [
    { key:'HOOK', d:3 },{ key:'CONTEXT', d:5 },
    { key:'INSIGHT1', d:8 },{ key:'INSIGHT2', d:8 },
    { key:'JOKE', d:7 },{ key:'TAKEAWAY', d:10 },{ key:'CTA', d:4 }
  ]
  const scale = total / layout.reduce((s,a)=>s+a.d,0)
  let t = 0
  const shots: Shot[] = []
  const subs: {start:number; end:number; text:string}[] = []

  const n0 = news[0]?.title || 'อัปเดตตลาดคริปโตวันนี้'
  const n1 = news[1]?.title || ''
  const n2 = news[2]?.title || ''

  function add(text:string, fx:string[], camera:string[] = [], bg?:string, d?:number) {
    const dur = Math.round(((d ?? 0) * scale) * 10)/10 || Math.round((5*scale)*10)/10
    shots.push({ t, d:dur, text: sanitize(text, censorWords), fx, camera, bg })
    subs.push({ start:t, end:t+dur, text: sanitize(text, censorWords)})
    t += dur
  }

  add('*บี๊บ* เปิดโลกคริปโตวันนี้!', ['glitch','shake','typewriter'], [], undefined, layout[0].d)
  add(`เฮ้ย ข่าวเด่น: ${n0}`, ['slideIn','parallax','highlightGlow'], ['pan'], undefined, layout[1].d)
  add(`สรุปประเด็น: ${n1 || 'ราคาเหวี่ยง แรงซื้อขายหนาแน่น'}`, ['kenBurns','countUp'], ['parallax'], undefined, layout[2].d)
  add(`เจาะลึก: ${n2 || 'มือใหม่เข้าแพง-ออกถูก เพราะไร้แผน'}`, ['lightSweep','popIn'], ['kenBurns'], undefined, layout[3].d)
  add('มุกเวลา: กราฟนี่รถไฟเหาะ หรือสไลเดอร์หน้าบ้านเพื่อน? 🤡', ['speedLines','popIn'], [], undefined, layout[4].d)
  add('บทเรียนวันนี้: วางแผนก่อนเข้า อดทนตอนตลาดเหวี่ยง', ['dollyZoom','colorGrade'], [], undefined, layout[5].d)
  add('ติดตามไว้ เดี๋ยวพาลุย Deep Ocean ทุกวัน!', ['particleBurst'], [], undefined, layout[6].d)

  return { shots, subtitles: subs }
}