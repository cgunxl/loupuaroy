import React from 'react'
import { useStore } from '../store'

export function Storyboard(){
  const shots = useStore(s=>s.project.shots)
  return (
    <div>
      <h3>Storyboard</h3>
      <div>
        {shots.map((s,i)=>(
          <div key={i} className="story-item card">
            <div className="story-time">{s.t.toFixed(1)}s</div>
            <div className="story-text"><b>{s.text}</b><br/><span className="small">{s.fx.join(', ')}</span></div>
          </div>
        ))}
      </div>
    </div>
  )
}