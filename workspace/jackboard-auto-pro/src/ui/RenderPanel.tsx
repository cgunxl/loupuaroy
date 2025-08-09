import { useState } from 'react'
import { useAppStore } from '../store'

export default function RenderPanel() {
  const { quickProduce, exportWebM, exportMP4, qaStatus } = useAppStore()
  const [busy, setBusy] = useState(false)

  async function onProduce() {
    setBusy(true)
    try {
      await quickProduce()
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="panel render-panel">
      <h2>Render / Export</h2>
      <div className="row">
        <button onClick={onProduce} disabled={busy}>
          {busy ? 'Producing…' : 'Produce Now'}
        </button>
        <button onClick={() => exportWebM()} disabled={!qaStatus.passAll}>Export WebM</button>
        <button onClick={() => exportMP4()} disabled={!qaStatus.passAll}>
          Export MP4 (beta)
        </button>
      </div>
      <div className="qa-status">
        <strong>QA:</strong> {qaStatus.summary}
      </div>
    </div>
  )
}