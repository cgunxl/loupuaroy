import type { ScriptBundle, Shot } from '../types'
import bgLoops from '../../presets/bgLoops.json'

export function buildShotlist(bundle: ScriptBundle): Shot[] {
  const shots: Shot[] = []
  const defaultFx = [
    ['glitch', 'shake', 'typewriter'],
    ['slideIn', 'parallax'],
    ['countUp', 'lightSweep'],
    ['colorGrade', 'shake'],
    ['kenBurns', 'highlightGlow'],
    ['speedLines', 'popIn'],
    ['dollyZoom', 'highlightGlow'],
    ['particleBurst'],
  ]
  bundle.script.forEach((s, i) => {
    shots.push({
      t: s.t,
      d: s.d,
      text: s.text,
      fx: s.fx ?? defaultFx[i % defaultFx.length],
      camera: s.camera ?? [],
      bg: s.bg ?? pickBg(i),
    })
  })
  return shots
}

function pickBg(i: number): string {
  const list = bgLoops
  return list[i % list.length]
}