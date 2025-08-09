import React, { useEffect } from 'react'
import { PromptPanel } from './PromptPanel'
import { CanvasStage } from './CanvasStage'
import { RenderPanel } from './RenderPanel'
import { setupKeyboardShortcuts, cleanupKeyboardShortcuts } from '../core/shortcuts'

export default function App(){
  useEffect(() => {
    setupKeyboardShortcuts()
    return () => {
      cleanupKeyboardShortcuts()
    }
  }, [])

  return (
    <div className="app">
      <div className="panel"><PromptPanel/></div>
      <div className="panel"><CanvasStage/></div>
      <div className="panel"><RenderPanel/></div>
    </div>
  )
}