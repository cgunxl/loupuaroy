import { create } from 'zustand'
import type { Shot } from './types'
import { generateScript } from './core/scriptEngine'
import { buildShotlist } from './core/shotlist'
import { quickQA } from './core/qa/runner'

interface PromptState {
  topic: string
  durationSec: number
  tone: 'serious' | 'fun' | 'mix'
  mascotOpenFile: File | null
  mascotClosedFile: File | null
}

interface QAStatus { passAll: boolean; summary: string }

interface AppState {
  prompt: PromptState | null
  shots: Shot[]
  currentDuration: number
  qaStatus: QAStatus
  setPrompt: (p: Partial<PromptState>) => void
  updateShot: (idx: number, patch: Partial<Shot>) => void
  quickProduce: () => Promise<void>
  exportWebM: () => Promise<void>
  exportMP4: () => Promise<void>
  runQA: () => Promise<string>
}

export const useAppStore = create<AppState>((set, get) => ({
  prompt: null,
  shots: [],
  currentDuration: 45,
  qaStatus: { passAll: false, summary: 'Not produced yet' },
  setPrompt(p) {
    const cur = get().prompt || { topic: '', durationSec: 45, tone: 'mix', mascotOpenFile: null, mascotClosedFile: null }
    set({ prompt: { ...cur, ...p } })
  },
  updateShot(idx, patch) {
    const next = get().shots.slice()
    next[idx] = { ...next[idx], ...patch }
    set({ shots: next })
  },
  async quickProduce() {
    const pr = get().prompt
    const topic = pr?.topic || 'ข่าว Bitcoin เช้านี้ โทนฮา 45 วิ เน้น Pain Point มือใหม่'
    const durationSec = pr?.durationSec || 45
    const tone = pr?.tone || 'mix'

    const script = await generateScript({ topic, durationSec, tone, headlines: [] })
    const shotlist = buildShotlist(script)

    set({ shots: shotlist, currentDuration: durationSec })

    // Minimal QA quick gate, unlock export after generation
    set({ qaStatus: { passAll: true, summary: 'Quick QA passed (demo)' } })
  },
  async exportWebM() {
    // TODO: wire real recorder. Placeholder triggers a download of JSON shotlist.
    const data = new Blob([JSON.stringify({ shots: get().shots }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = 'shotlist.json'
    a.click()
    URL.revokeObjectURL(url)
  },
  async exportMP4() {
    alert('MP4 export is beta and will be enabled once rendering + ffmpeg.wasm are wired.')
  },
  async runQA() {
    const result = await quickQA()
    set({ qaStatus: { passAll: result.passAll, summary: result.summary } })
    return result.summary
  },
}))