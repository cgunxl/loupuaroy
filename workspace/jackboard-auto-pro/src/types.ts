export interface NewsItem {
  title: string
  source: string
  publishedAt: string
  url: string
  summary: string
}

export interface ScriptSection {
  t: number
  d: number
  text: string
  fx?: string[]
  camera?: string[]
  bg?: string
}

export interface ScriptBundle {
  prompt: string
  duration: number
  tone: 'serious' | 'fun' | 'mix'
  beepWords: string[]
  script: ScriptSection[]
  subtitles: 'auto' | 'off'
}

export interface Shot {
  t: number
  d: number
  text: string
  fx?: string[]
  camera?: string[]
  bg?: string
}