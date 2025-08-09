import type { ScriptBundle } from '../types'
import badwords from '../../presets/badwords.th.json'

interface GenerateInput { topic: string; durationSec: number; tone: 'serious' | 'fun' | 'mix'; headlines: string[] }

export async function generateScript(input: GenerateInput): Promise<ScriptBundle> {
  const duration = input.durationSec
  const beats = [
    { label: 'HOOK', d: 3, text: '*บี๊บ* BTC เดือด! มือใหม่ระวัง!' },
    { label: 'CONTEXT', d: 5, text: 'เช้านี้: วาฬขยับ คนแห่ไล่ราคา' },
    { label: 'DATA', d: 7, text: 'ตัวเลขชัด: ปริมาณเทรดพุ่ง สเปรดกว้าง' },
    { label: 'PAIN', d: 8, text: 'กับดัก: เข้าแพง-ออกถูก เพราะกลัวพลาด' },
    { label: 'INSIGHT', d: 7, text: 'เช็กสัญญาณ: แนวรับ/แนวต้าน + วาฬซื้อ' },
    { label: 'JOKE', d: 6, text: 'กราฟ=รถไฟเหาะ—คาดเข็มขัด! 🤡' },
    { label: 'TAKEAWAY', d: 7, text: 'บทเรียน: วางแผนก่อนเข้า รอจังหวะ' },
    { label: 'CTA', d: 2, text: 'กดติดตาม—ลุย Deep Ocean!' },
  ]

  // Adjust durations proportionally to requested duration
  const baseTotal = beats.reduce((a, b) => a + b.d, 0)
  const scale = duration / baseTotal
  let t = 0
  const script = beats.map((b) => {
    const d = Math.max(1.5, Math.round(b.d * scale * 10) / 10)
    const section = { t, d, text: censorBadwords(b.text) }
    t += d
    return section
  })

  return {
    prompt: input.topic,
    duration,
    tone: input.tone,
    beepWords: ['__BEEP__', 'บี๊บ'],
    script,
    subtitles: 'auto',
  }
}

function censorBadwords(text: string): string {
  let out = text
  for (const word of badwords.words) {
    const re = new RegExp(word, 'gi')
    out = out.replace(re, '__BEEP__')
  }
  return out
}