import React, { useRef, useState } from 'react'
import { useStore } from '../store'
import { AudioEngine } from '../core/audioEngine'
import { recordCanvasWithAudio } from '../core/recorder'
import { Storyboard } from './Storyboard'

export function RenderPanel(){
  const { project } = useStore()
  const [status, setStatus] = useState<string>('พร้อมเรนเดอร์')
  const [error, setError] = useState<string>('')
  const linkRef = useRef<HTMLAnchorElement>(null)

  async function render(){
    if (project.shots.length === 0) {
      setError('กรุณาสร้าง Storyboard ก่อน')
      return
    }

    setStatus('กำลังเตรียมเสียง...')
    setError('')
    
    try {
      const ae = new AudioEngine()
      const chunks = project.subtitles.map(s=>({ text: s.text, start: s.start, end: s.end }))
      ae.speakChunks(chunks, project.beepWords).catch(()=>{})

      setStatus('กำลังบันทึกวิดีโอ...')
      const canvas = document.querySelector('canvas') as HTMLCanvasElement
      if (!canvas) {
        throw new Error('ไม่พบ Canvas element')
      }
      
      const blob = await recordCanvasWithAudio(canvas, ae.getStream(), project.duration)
      const url = URL.createObjectURL(blob)
      setStatus('เสร็จแล้ว ✓ ดาวน์โหลดได้เลย')
      if (linkRef.current) { 
        linkRef.current.href = url; 
        linkRef.current.download = 'jackboard.webm' 
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด: ' + (err as Error).message)
      setStatus('เกิดข้อผิดพลาด')
    }
  }

  return (
    <div>
      <h3>เรนเดอร์</h3>
      <div className="card small" style={{marginBottom:8}}>{status}</div>
      {error && <div className="card small" style={{color: 'var(--danger)', marginBottom: 8}}>{error}</div>}
      <button onClick={render} disabled={project.shots.length === 0}>
        Render & Download (WebM)
      </button>
      <a ref={linkRef} className="small" style={{display:'block', marginTop:10, color:'#9fe9c8'}} href="#">ดาวน์โหลดวิดีโอ</a>

      <Storyboard />
    </div>
  )
}