import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { useAppStore } from '../store'

export default function PromptPanel() {
  const { setPrompt } = useAppStore()
  const [topic, setTopic] = useState('ข่าว Bitcoin เช้านี้ โทนฮา 45 วิ เน้น Pain Point มือใหม่')
  const [durationSec, setDurationSec] = useState(45)
  const [tone, setTone] = useState<'serious' | 'fun' | 'mix'>('mix')
  const [mascotOpenFile, setMascotOpenFile] = useState<File | null>(null)
  const [mascotClosedFile, setMascotClosedFile] = useState<File | null>(null)

  function onMascotOpenChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    setMascotOpenFile(f ?? null)
  }
  function onMascotClosedChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    setMascotClosedFile(f ?? null)
  }

  async function onProduce() {
    setPrompt({ topic, durationSec, tone, mascotOpenFile, mascotClosedFile })
  }

  return (
    <div className="panel prompt-panel">
      <h2>Prompt</h2>
      <label>
        <span>Topic</span>
        <input value={topic} onChange={(e) => setTopic(e.target.value)} />
      </label>
      <label>
        <span>Duration (sec)</span>
        <input
          type="number"
          min={15}
          max={90}
          step={5}
          value={durationSec}
          onChange={(e) => setDurationSec(parseInt(e.target.value) || 45)}
        />
      </label>
      <label>
        <span>Tone</span>
        <select value={tone} onChange={(e) => setTone(e.target.value as any)}>
          <option value="serious">serious</option>
          <option value="fun">fun</option>
          <option value="mix">mix</option>
        </select>
      </label>
      <div className="row">
        <label className="file">
          <span>Mascot (open mouth PNG)</span>
          <input type="file" accept="image/png" onChange={onMascotOpenChange} />
        </label>
        <label className="file">
          <span>Mascot (closed mouth PNG)</span>
          <input type="file" accept="image/png" onChange={onMascotClosedChange} />
        </label>
      </div>
      <div className="row">
        <button onClick={onProduce}>Produce Now</button>
      </div>
    </div>
  )
}