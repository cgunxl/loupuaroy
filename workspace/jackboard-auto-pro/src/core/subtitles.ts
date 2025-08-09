import type { Shot } from '../types'

export function toSrt(shots: Shot[]): string {
  function fmt(t: number): string {
    const h = Math.floor(t / 3600)
    const m = Math.floor((t % 3600) / 60)
    const s = Math.floor(t % 60)
    const ms = Math.floor((t % 1) * 1000)
    const pad = (n: number, w = 2) => n.toString().padStart(w, '0')
    const pad3 = (n: number) => n.toString().padStart(3, '0')
    return `${pad(h)}:${pad(m)}:${pad(s)},${pad3(ms)}`
  }
  return shots
    .map((s, i) => `${i + 1}\n${fmt(s.t)} --> ${fmt(s.t + s.d)}\n${s.text}\n`)
    .join('\n')
}