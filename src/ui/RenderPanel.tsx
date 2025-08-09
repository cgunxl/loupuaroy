import React, { useRef, useState } from 'react'
import { useStore } from '../store'
import { AudioEngine } from '../core/audioEngine'
import { recordCanvasWithAudio } from '../core/recorder'
import { Storyboard } from './Storyboard'

export function RenderPanel(){
  const { project, setAnalyser } = useStore()
  const [status, setStatus] = useState<string>('พร้อมเรนเดอร์')
  const [error, setError] = useState<string>('')
  const linkRef = useRef<HTMLAnchorElement>(null)
  const srtRef = useRef<HTMLAnchorElement>(null)

  function makeSRT(){
    const lines = project.subtitles.map((s, i)=>{
      const toTime = (t:number)=>{
        const h=Math.floor(t/3600), m=Math.floor((t%3600)/60), sec=(t%60)
        const ms = Math.floor((t - Math.floor(t)) * 1000)
        const pad=(n:number,len=2)=>n.toString().padStart(len,'0')
        return `${pad(h)}:${pad(m)}:${pad(Math.floor(sec))},${pad(ms,3)}`
      }
      return `${i+1}\n${toTime(s.start)} --> ${toTime(s.end)}\n${s.text}\n`
    }).join('\n')
    return new Blob([lines], { type: 'text/plain' })
  }

  async function render(){
    if (project.shots.length === 0) {
      setError('กรุณาสร้าง Storyboard ก่อน')
      return
    }

    setStatus('กำลังเตรียมเสียง...')
    setError('')
    
    try {
      const ae = new AudioEngine()
      setAnalyser(ae.analyser)
      const chunks = project.subtitles.map(s=>({ text: s.text, start: s.start, end: s.end }))
      ae.speakChunks(chunks, project.beepWords).catch(()=>{})

      setStatus('กำลังบันทึกวิดีโอ...')
      const canvas = document.querySelector('canvas') as HTMLCanvasElement
      if (!canvas) {
        throw new Error('ไม่พบ Canvas element')
      }
      // Resize canvas container to target resolution (best effort)
      canvas.width = project.width || canvas.width
      canvas.height = project.height || canvas.height
      
      const blob = await recordCanvasWithAudio(canvas, ae.getStream(), project.duration, project.fps || 30)
      const url = URL.createObjectURL(blob)
      setStatus('เสร็จแล้ว ✓ ดาวน์โหลดได้เลย')
      if (linkRef.current) { 
        linkRef.current.href = url; 
        linkRef.current.download = 'jackboard.webm' 
      }

      // Prepare SRT
      const srtBlob = makeSRT()
      const srtUrl = URL.createObjectURL(srtBlob)
      if (srtRef.current){
        srtRef.current.href = srtUrl
        srtRef.current.download = 'subtitles.srt'
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
      <a ref={srtRef} className="small" style={{display:'block', marginTop:6, color:'#9fe9c8'}} href="#">ดาวน์โหลด SRT</a>

      <Storyboard />
    </div>
  )
}