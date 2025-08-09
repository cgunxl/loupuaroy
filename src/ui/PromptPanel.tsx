import React, { useState, useEffect } from 'react'
import { useStore } from '../store'
import { getFreshNews } from '../core/rss'
import { buildFromNews } from '../core/scriptEngine'
import { ProjectStorage } from '../core/storage'
import { aiContentGenerator, ContentPrompt } from '../core/aiContentGenerator'
import { tiktokDownloader } from '../core/tiktokDownloader'
import { autoTester } from '../core/autoTester'

export function PromptPanel(){
  const { project, set, setShots } = useStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [savedProjects, setSavedProjects] = useState<{ key: string; name: string; date: Date }[]>([])
  const [showProjects, setShowProjects] = useState(false)
  const [contentStyle, setContentStyle] = useState<'finance' | 'crypto' | 'news' | 'educational'>('finance')
  const [tiktokUrl, setTiktokUrl] = useState('')
  const [downloadStatus, setDownloadStatus] = useState('')
  const [testStatus, setTestStatus] = useState('')
  const [isTestRunning, setIsTestRunning] = useState(false)

  useEffect(() => {
    loadSavedProjects()
  }, [])

  async function loadSavedProjects() {
    try {
      const projects = await ProjectStorage.getProjectNames()
      setSavedProjects(projects)
    } catch (err) {
      console.error('Failed to load projects:', err)
    }
  }

  // ฟังก์ชันใหม่: สร้างเนื้อหาด้วย AI
  async function generateWithAI() {
    setLoading(true)
    setError('')
    try {
      // สร้าง prompt สำหรับ AI
      const contentPrompt: ContentPrompt = {
        topic: project.prompt || 'การลงทุนในตลาดหุ้นไทย',
        style: contentStyle,
        targetAudience: 'คนไทยที่สนใจการลงทุน',
        duration: project.duration,
        keywords: project.beepWords.filter(w => w !== '__BEEP__')
      }

      // สร้างเนื้อหาด้วย AI
      const content = await aiContentGenerator.generateContent(contentPrompt)
      
      // แปลงเป็น shots และ subtitles
      const shots = content.visualElements.map((element, index) => ({
        t: element.timing.start,
        d: element.timing.end - element.timing.start,
        text: element.content,
        fx: element.type === 'transition' ? ['transition'] : [],
        camera: [],
        bg: element.style.background || undefined
      }))

      const subtitles = [content.hook, ...content.mainContent, content.callToAction].map((text, index) => {
        const timePerSection = project.duration / (content.mainContent.length + 2)
        return {
          start: index * timePerSection,
          end: (index + 1) * timePerSection,
          text
        }
      })

      set({ subtitles })
      setShots(shots)
      setError('✅ สร้างเนื้อหาสำเร็จ!')
    } catch (err) {
      setError('❌ เกิดข้อผิดพลาด: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // ฟังก์ชันเดิมที่ปรับปรุง
  async function generate(){
    setLoading(true)
    setError('')
    try {
      const news = await getFreshNews(5)
      if (news.length === 0) {
        setError('ไม่สามารถดึงข่าวได้ กรุณาลองใหม่อีกครั้ง')
        return
      }
      const built = buildFromNews(project.prompt, news, project.duration, project.beepWords)
      set({ subtitles: built.subtitles })
      setShots(built.shots)
    } catch (err) {
      setError('เกิดข้อผิดพลาด: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // ฟังก์ชันใหม่: ดาวน์โหลดวิดีโอ TikTok
  async function downloadTikTok() {
    if (!tiktokUrl) {
      setDownloadStatus('❌ กรุณาใส่ URL ของวิดีโอ TikTok')
      return
    }

    setDownloadStatus('⏳ กำลังดาวน์โหลด...')
    try {
      const videoInfo = await tiktokDownloader.getVideoInfo(tiktokUrl)
      if (!videoInfo) {
        setDownloadStatus('❌ ไม่สามารถดึงข้อมูลวิดีโอได้')
        return
      }

      setDownloadStatus(`📹 พบวิดีโอ: ${videoInfo.title} โดย ${videoInfo.author}`)
      
      const blob = await tiktokDownloader.downloadVideo(videoInfo)
      if (blob) {
        // สร้าง download link
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `tiktok_${videoInfo.id}.mp4`
        a.click()
        URL.revokeObjectURL(url)
        setDownloadStatus('✅ ดาวน์โหลดสำเร็จ!')
      } else {
        setDownloadStatus('⚠️ กำลังดาวน์โหลดในแท็บใหม่...')
      }
    } catch (err) {
      setDownloadStatus('❌ ดาวน์โหลดล้มเหลว: ' + (err as Error).message)
    }
  }

  async function saveProject() {
    try {
      await ProjectStorage.saveProject(project)
      await loadSavedProjects()
      setError('บันทึกสำเร็จ ✓')
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการบันทึก: ' + (err as Error).message)
    }
  }

  async function loadProject(key: string) {
    try {
      const loadedProject = await ProjectStorage.loadProject(key)
      if (loadedProject) {
        set(loadedProject)
        setShots(loadedProject.shots)
        setError('โหลดสำเร็จ ✓')
        setShowProjects(false)
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลด: ' + (err as Error).message)
    }
  }

  async function deleteProject(key: string) {
    try {
      await ProjectStorage.deleteProject(key)
      await loadSavedProjects()
      setError('ลบสำเร็จ ✓')
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการลบ: ' + (err as Error).message)
    }
  }

  function onChangeBeepWords(value: string){
    const list = value.split(',').map(s=>s.trim()).filter(Boolean)
    set({ beepWords: list })
  }

  function onChangeResolution(preset: string){
    if (preset === '1080p') set({ width: 1920, height: 1080 })
    else if (preset === '4k') set({ width: 3840, height: 2160 })
  }

  return (
    <div>
      <h2>Jackboard Auto</h2>
      <div className="badge">ฟรี • ไม่ต้องสมัคร • ทำในเบราว์เซอร์</div>

      <h3>สร้างเนื้อหา TikTok</h3>
      
      {/* เลือกสไตล์เนื้อหา */}
      <div className="card">
        <label>สไตล์เนื้อหา:</label>
        <select 
          value={contentStyle} 
          onChange={(e) => setContentStyle(e.target.value as any)}
          className="input"
        >
          <option value="finance">💰 การเงิน</option>
          <option value="crypto">🪙 คริปโต</option>
          <option value="news">📰 ข่าวสาร</option>
          <option value="educational">📚 ความรู้</option>
        </select>
      </div>

      {/* Input หัวข้อ */}
      <textarea 
        className="input" 
        placeholder="ใส่หัวข้อหรือ prompt ที่ต้องการ เช่น 'วิธีลงทุนหุ้นสำหรับมือใหม่' หรือ 'Bitcoin จะขึ้นไปถึง 100,000 ดอลลาร์ไหม'"
        value={project.prompt}
        onChange={(e) => set({ prompt: e.target.value })}
        rows={3}
      />

      {/* ปุ่มสร้างเนื้อหา */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button 
          onClick={generateWithAI} 
          disabled={loading}
          style={{ flex: 1, background: 'var(--primary)' }}
        >
          {loading ? 'กำลังสร้าง...' : '🤖 สร้างด้วย AI'}
        </button>
        <button 
          onClick={generate} 
          disabled={loading}
          style={{ flex: 1 }}
        >
          {loading ? 'กำลังสร้าง...' : '📰 สร้างจากข่าว'}
        </button>
      </div>

      {/* แสดง error/success */}
      {error && (
        <div className="card small" style={{ 
          marginTop: '10px',
          color: error.startsWith('✅') ? 'var(--success)' : 'var(--danger)' 
        }}>
          {error}
        </div>
      )}

      {/* ส่วนดาวน์โหลด TikTok */}
      <div className="card" style={{ marginTop: '20px' }}>
        <h4>📥 ดาวน์โหลดวิดีโอ TikTok</h4>
        <input
          type="text"
          className="input"
          placeholder="ใส่ URL ของวิดีโอ TikTok ที่ต้องการดาวน์โหลด"
          value={tiktokUrl}
          onChange={(e) => setTiktokUrl(e.target.value)}
        />
        <button 
          onClick={downloadTikTok}
          style={{ marginTop: '10px', width: '100%' }}
        >
          ดาวน์โหลดวิดีโอ
        </button>
        {downloadStatus && (
          <div className="small" style={{ 
            marginTop: '10px',
            color: downloadStatus.includes('✅') ? 'var(--success)' : 
                   downloadStatus.includes('❌') ? 'var(--danger)' : 'var(--text)'
          }}>
            {downloadStatus}
          </div>
        )}
      </div>

      {/* ตั้งค่าเพิ่มเติม */}
      <div className="card" style={{ marginTop: '20px' }}>
        <h4>⚙️ ตั้งค่า</h4>
        <label>ความยาววิดีโอ (วินาที):</label>
        <input 
          type="number" 
          className="input" 
          value={project.duration} 
          onChange={(e) => set({ duration: parseInt(e.target.value) || 30 })}
          min={15}
          max={60}
        />
        
        <label style={{ marginTop: '10px' }}>คำที่ต้องการ beep:</label>
        <input 
          type="text" 
          className="input" 
          placeholder="คั่นด้วยเครื่องหมายจุลภาค"
          value={project.beepWords.join(', ')}
          onChange={(e) => set({ beepWords: e.target.value.split(',').map(w => w.trim()).filter(Boolean) })}
        />
      </div>

      <label>อัปโหลดมาสคอส (PNG โปร่งใส)</label>
      <input type="file" accept="image/png" onChange={e=>set({ mascotFile: e.target.files?.[0]})}/>
      <div className="row">
        <div>
          <label>ปาก (open PNG)</label>
          <input type="file" accept="image/png" onChange={e=>set({ mouthOpenFile: e.target.files?.[0]})}/>
        </div>
        <div>
          <label>ปาก (close PNG)</label>
          <input type="file" accept="image/png" onChange={e=>set({ mouthCloseFile: e.target.files?.[0]})}/>
        </div>
      </div>

      {error && <div className="card small" style={{color: error.includes('สำเร็จ') ? 'var(--accent)' : 'var(--danger)', marginTop: 8}}>{error}</div>}

      <div className="row" style={{marginTop: 12}}>
        <button onClick={saveProject} disabled={project.shots.length === 0} style={{background: 'linear-gradient(180deg, #2bd9a9, #21c17a)'}}>
          บันทึก
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setShowProjects(!showProjects)} style={{ marginLeft: '10px' }}>
          📂 {showProjects ? 'ซ่อน' : 'แสดง'}โปรเจคที่บันทึก
        </button>
      </div>

      {showProjects && savedProjects.length > 0 && (
        <div className="card" style={{ marginTop: '10px' }}>
          <h4>โปรเจคที่บันทึก:</h4>
          {savedProjects.map((proj) => (
            <div key={proj.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="small">{proj.name}</span>
              <div>
                <button onClick={() => loadProject(proj.key)} className="small">โหลด</button>
                <button onClick={() => deleteProject(proj.key)} className="small" style={{ marginLeft: '5px', color: 'var(--danger)' }}>ลบ</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3>สคริปต์ (ตัวอย่าง)</h3>
      <div className="card small">
        ระบบจะสร้าง Hook → Context → Insight → Joke → Takeaway → CTA อัตโนมัติ
      </div>
    </div>
  )
}