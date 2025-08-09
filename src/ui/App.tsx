import React, { useEffect } from 'react'
import { PromptPanel } from './PromptPanel'
import { CanvasStage } from './CanvasStage'
import { RenderPanel } from './RenderPanel'
import { setupKeyboardShortcuts, cleanupKeyboardShortcuts } from '../core/shortcuts'
import { useStore } from '../store'

export default function App(){
  const project = useStore(s=>s.project)

  useEffect(() => {
    setupKeyboardShortcuts()
    return () => {
      cleanupKeyboardShortcuts()
    }
  }, [])

  return (
    <div className="app" style={{maxWidth:'1920px', margin:'0 auto'}}>
      <div className="panel"><PromptPanel/></div>
      <div className="panel"><CanvasStage/></div>
      <div className="panel"><RenderPanel/></div>
    </div>
  )
}