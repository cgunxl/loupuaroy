import { useAppStore } from '../store'

export default function Storyboard() {
  const { shots, updateShot } = useAppStore()
  return (
    <div className="panel storyboard-panel">
      <h2>Storyboard</h2>
      <div className="shots">
        {shots.map((shot, idx) => (
          <div key={idx} className="shot-card">
            <div className="meta">
              <span>T {shot.t.toFixed(1)}s · D {shot.d.toFixed(1)}s</span>
            </div>
            <textarea
              value={shot.text}
              onChange={(e) => updateShot(idx, { text: e.target.value })}
            />
            <input
              value={(shot.fx || []).join(',')}
              onChange={(e) =>
                updateShot(idx, { fx: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })
              }
              placeholder="fx e.g. typewriter, popIn, highlightGlow"
            />
          </div>
        ))}
      </div>
    </div>
  )
}