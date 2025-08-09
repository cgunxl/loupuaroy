import { useState } from 'react'
import PromptPanel from './PromptPanel'
import Storyboard from './Storyboard'
import CanvasStage from './CanvasStage'
import RenderPanel from './RenderPanel'
import QAPanel from './QAPanel'

export default function App() {
  const [showQA, setShowQA] = useState(false)
  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Jackboard Auto Pro</h1>
        <div className="spacer" />
        <button className="qa-toggle" onClick={() => setShowQA((v) => !v)}>
          {showQA ? 'Hide QA' : 'Show QA'}
        </button>
      </header>
      <main className="app-main">
        <section className="left">
          <PromptPanel />
          <RenderPanel />
          {showQA && <QAPanel />}
        </section>
        <section className="center">
          <CanvasStage />
        </section>
        <section className="right">
          <Storyboard />
        </section>
      </main>
      <footer className="app-footer">
        <small>Client-only demo. Media are CC0/CC-BY only. Credits auto-overlay for CC-BY.</small>
      </footer>
    </div>
  )
}