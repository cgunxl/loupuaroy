import React, { useState, useEffect } from 'react'
import { useStore } from '../store'
import { getFreshNews } from '../core/rss'
import { buildFromNews } from '../core/scriptEngine'
import { ProjectStorage } from '../core/storage'

export function PromptPanel(){
  const { project, set, setShots } = useStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [savedProjects, setSavedProjects] = useState<{ key: string; name: string; date: Date }[]>([])
  const [showProjects, setShowProjects] = useState(false)

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

  return (
    <div>
      <h2>Jackboard Auto</h2>
      <div className="badge">ฟรี • ไม่ต้องสมัคร • ทำในเบราว์เซอร์</div>

      <label>พรอมต์ (หัวข้อ/โทน)</label>
      <textarea 
        rows={4} 
        placeholder="อัปเดต Bitcoin โทนฮา 45 วิ" 
        value={project.prompt} 
        onChange={e=>set({prompt:e.target.value})}
      />

      <div className="row">
        <div>
          <label>ความยาว (วินาที)</label>
          <input 
            type="number" 
            min={30} 
            max={60} 
            value={project.duration} 
            onChange={e=>set({duration:+e.target.value})}
          />
        </div>
        <div>
          <label>โทน</label>
          <select value={project.tone} onChange={e=>set({tone:e.target.value as any})}>
            <option value="mix">ฮาผสมสาระ</option>
            <option value="fun">ฮา</option>
            <option value="serious">จริงจัง</option>
          </select>
        </div>
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
        <button onClick={generate} disabled={loading}>
          {loading? 'กำลังสร้าง...' : 'สร้าง Storyboard'}
        </button>
        <button onClick={saveProject} disabled={project.shots.length === 0} style={{background: 'linear-gradient(180deg, #2bd9a9, #21c17a)'}}>
          บันทึก
        </button>
      </div>

      <button onClick={() => setShowProjects(!showProjects)} style={{marginTop: 8, background: 'rgba(255,255,255,0.1)'}}>
        {showProjects ? 'ซ่อน' : 'แสดง'} โปรเจกต์ที่บันทึก ({savedProjects.length})
      </button>

      {showProjects && (
        <div className="card" style={{marginTop: 8}}>
          <h4>โปรเจกต์ที่บันทึก</h4>
          {savedProjects.length === 0 ? (
            <div className="small">ยังไม่มีโปรเจกต์ที่บันทึก</div>
          ) : (
            savedProjects.map(p => (
              <div key={p.key} className="story-item">
                <div style={{flex: 1}}>
                  <div className="story-text">{p.name}</div>
                  <div className="small">{p.date.toLocaleDateString('th-TH')}</div>
                </div>
                <div className="row" style={{gap: 4}}>
                  <button onClick={() => loadProject(p.key)} style={{padding: '4px 8px', fontSize: '12px'}}>โหลด</button>
                  <button onClick={() => deleteProject(p.key)} style={{padding: '4px 8px', fontSize: '12px', background: 'var(--danger)'}}>ลบ</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <h3>สคริปต์ (ตัวอย่าง)</h3>
      <div className="card small">
        ระบบจะสร้าง Hook → Context → Insight → Joke → Takeaway → CTA อัตโนมัติ
      </div>
    </div>
  )
}