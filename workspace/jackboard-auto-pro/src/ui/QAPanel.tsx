import { useState } from 'react'
import { useAppStore } from '../store'

export default function QAPanel() {
  const { runQA } = useAppStore()
  const [busy, setBusy] = useState(false)
  const [summary, setSummary] = useState('Idle')

  async function onRun() {
    setBusy(true)
    setSummary('Running 100 cases…')
    try {
      const s = await runQA()
      setSummary(s)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="panel qa-panel">
      <h2>QA Runner</h2>
      <button onClick={onRun} disabled={busy}>
        {busy ? 'Running…' : 'Run 100x QA'}
      </button>
      <div className="qa-report">{summary}</div>
    </div>
  )
}