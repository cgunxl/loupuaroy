import React, { useRef, useState } from 'react'
import { useStore } from '../store'
import { AudioEngine } from '../core/audioEngine'
import { recordCanvasWithAudio } from '../core/recorder'
import { createVideoRenderer } from '../core/videoRenderer'
import { Storyboard } from './Storyboard'

export function RenderPanel(){
  const { project, setAnalyser } = useStore()
  const [status, setStatus] = useState<string>('พร้อมเรนเดอร์')
  const [error, setError] = useState<string>('')
  const [renderProgress, setRenderProgress] = useState(0)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const srtRef = useRef<HTMLAnchorElement>(null)
  const mp4LinkRef = useRef<HTMLAnchorElement>(null)

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

  // ฟังก์ชันใหม่: Render เป็น MP4 ด้วย advanced renderer
  async function renderMP4() {
    if (project.shots.length === 0) {
      setError('กรุณาสร้าง Storyboard ก่อน')
      return
    }

    setStatus('🎬 กำลังเตรียมการเรนเดอร์ MP4...')
    setError('')
    setRenderProgress(0)
    
    try {
      // สร้าง canvas สำหรับ render
      const canvas = document.querySelector('canvas') as HTMLCanvasElement
      if (!canvas) {
        throw new Error('ไม่พบ Canvas element')
      }

      // สร้าง video renderer
      const renderer = createVideoRenderer(canvas, {
        width: project.width || 1920,
        height: project.height || 1080,
        fps: project.fps || 30,
        duration: project.duration
      })

      // เตรียมเสียง
      const ae = new AudioEngine()
      setAnalyser(ae.analyser)
      const chunks = project.subtitles.map(s=>({ text: s.text, start: s.start, end: s.end }))
      ae.speakChunks(chunks, project.beepWords).catch(()=>{})

      setStatus('🎥 กำลังเรนเดอร์วิดีโอ...')
      
      // Render แต่ละ shot
      for (let i = 0; i < project.shots.length; i++) {
        const shot = project.shots[i]
        await renderer.renderShot(shot, ae.analyser)
        setRenderProgress(Math.round((i + 1) / project.shots.length * 100))
      }

      // Record frames
      setStatus('📼 กำลังบันทึกวิดีโอ...')
      const frames = await renderer.startRecording({
        fps: project.fps || 30,
        duration: project.duration
      })

      // Export เป็น video
      setStatus('🔄 กำลังแปลงเป็น MP4...')
      const videoBlob = await renderer.exportVideo(frames, project.fps || 30)
      
      // สร้าง download link
      const url = URL.createObjectURL(videoBlob)
      setStatus('✅ เรนเดอร์ MP4 เสร็จแล้ว!')
      setRenderProgress(100)
      
      if (mp4LinkRef.current) {
        mp4LinkRef.current.href = url
        mp4LinkRef.current.download = 'tiktok_video.mp4'
      }

      // Cleanup
      renderer.destroy()
    } catch (err) {
      setError('❌ เกิดข้อผิดพลาด: ' + (err as Error).message)
      setStatus('เกิดข้อผิดพลาด')
      setRenderProgress(0)
    }
  }

  return (
    <div>
      <h3>🎬 เรนเดอร์วิดีโอ</h3>
      
      {/* Status Card */}
      <div className="card" style={{marginBottom: 12}}>
        <div className="small" style={{marginBottom: 8}}>{status}</div>
        {renderProgress > 0 && renderProgress < 100 && (
          <div style={{width: '100%', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden'}}>
            <div style={{
              width: `${renderProgress}%`, 
              height: '100%', 
              background: 'var(--primary)',
              transition: 'width 0.3s ease'
            }}/>
          </div>
        )}
      </div>
      
      {error && <div className="card small" style={{color: 'var(--danger)', marginBottom: 12}}>{error}</div>}
      
      {/* Render Buttons */}
      <div style={{display: 'flex', gap: 10, marginBottom: 16}}>
        <button 
          onClick={render} 
          disabled={project.shots.length === 0}
          style={{flex: 1}}
        >
          🎥 Render WebM
        </button>
        <button 
          onClick={renderMP4} 
          disabled={project.shots.length === 0}
          style={{flex: 1, background: 'var(--accent)'}}
        >
          📹 Render MP4
        </button>
      </div>
      
      {/* Download Links */}
      <div className="card" style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        <a ref={linkRef} className="small" style={{color:'#9fe9c8'}} href="#">
          📥 ดาวน์โหลด WebM
        </a>
        <a ref={mp4LinkRef} className="small" style={{color:'#9fe9c8'}} href="#">
          📥 ดาวน์โหลด MP4
        </a>
        <a ref={srtRef} className="small" style={{color:'#9fe9c8'}} href="#">
          📄 ดาวน์โหลด Subtitle (SRT)
        </a>
      </div>

      <Storyboard />
    </div>
  )
}