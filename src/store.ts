import { create } from 'zustand'

export type Shot = {
  t: number
  d: number
  text: string
  fx: string[]
  camera?: string[]
  bg?: string
}
export type Project = {
  prompt: string
  duration: number
  tone: 'fun'|'serious'|'mix'
  beepWords: string[]
  mascotFile?: File
  mouthOpenFile?: File
  mouthCloseFile?: File
  shots: Shot[]
  subtitles: { start: number; end: number; text: string }[]
  fps?: number
  width?: number
  height?: number
}
type State = {
  project: Project
  analyser?: AnalyserNode
  set: (patch: Partial<State['project']>) => void
  setShots: (shots: Shot[]) => void
  setAnalyser: (a?: AnalyserNode) => void
}
export const useStore = create<State>((set) => ({
  project: {
    prompt: '',
    duration: 45,
    tone: 'mix',
    beepWords: ['__BEEP__'],
    shots: [],
    subtitles: [],
    fps: 30,
    width: 1920,
    height: 1080
  },
  set: (patch) => set(({ project }) => ({ project: { ...project, ...patch } })),
  setShots: (shots) => set(({ project }) => ({ project: { ...project, shots } })),
  setAnalyser: (a) => set(() => ({ analyser: a }))
}))