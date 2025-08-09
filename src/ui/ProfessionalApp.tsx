import React, { useState, useEffect, useRef } from 'react'
import { tiktokCreator } from '../core/completeTikTokCreator'
import { tiktokDownloader } from '../core/tiktokDownloader'
import { autoTester } from '../core/autoTester'
import '../styles/professional.css'

interface VideoProject {
  id: string
  name: string
  topic: string
  style: string
  status: 'draft' | 'processing' | 'completed' | 'error'
  videoUrl?: string
  createdAt: Date
}

export function ProfessionalApp() {
  // States
  const [activeTab, setActiveTab] = useState<'create' | 'download' | 'library'>('create')
  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState<'finance' | 'crypto' | 'news' | 'educational'>('finance')
  const [voiceGender, setVoiceGender] = useState<'male' | 'female'>('male')
  const [voiceStyle, setVoiceStyle] = useState<'energetic' | 'professional' | 'friendly'>('energetic')
  const [selectedEffects, setSelectedEffects] = useState<string[]>(['bounceScale', 'glitchReveal'])
  const [selectedTransitions, setSelectedTransitions] = useState<string[]>(['swipe', 'zoom'])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [projects, setProjects] = useState<VideoProject[]>([])
  const [downloadUrl, setDownloadUrl] = useState('')
  const [downloadStatus, setDownloadStatus] = useState('')
  const [testResults, setTestResults] = useState<any>(null)
  const videoPreviewRef = useRef<HTMLVideoElement>(null)

  // Available options
  const effects = [
    { id: 'typewriter', name: '⌨️ Typewriter', description: 'พิมพ์ทีละตัว' },
    { id: 'glitchReveal', name: '🔥 Glitch Reveal', description: 'เอฟเฟคกลิทช์' },
    { id: 'bounceScale', name: '🎯 Bounce Scale', description: 'ขยายแบบเด้ง' },
    { id: 'neonGlow', name: '💡 Neon Glow', description: 'เรืองแสงนีออน' },
    { id: 'splitText', name: '✂️ Split Text', description: 'แยกตัวอักษร' },
    { id: 'waveText', name: '🌊 Wave Text', description: 'ข้อความเป็นคลื่น' },
    { id: 'explosionText', name: '💥 Explosion', description: 'ระเบิดออก' },
    { id: '3dRotate', name: '🔄 3D Rotate', description: 'หมุน 3 มิติ' }
  ]

  const transitions = [
    { id: 'swipe', name: '➡️ Swipe', description: 'เลื่อนไปมา' },
    { id: 'zoom', name: '🔍 Zoom', description: 'ซูมเข้า-ออก' },
    { id: 'glitch', name: '📺 Glitch', description: 'สัญญาณรบกวน' },
    { id: 'fade', name: '🌅 Fade', description: 'ค่อยๆ จาง' },
    { id: 'shake', name: '📳 Shake', description: 'สั่น' },
    { id: 'spin', name: '🌀 Spin', description: 'หมุนวน' },
    { id: 'morph', name: '🎭 Morph', description: 'บิดเบี้ยว' }
  ]

  const musicOptions = [
    { id: 'upbeat', name: '🎵 Upbeat', file: '/assets/music/upbeat.mp3' },
    { id: 'dramatic', name: '🎭 Dramatic', file: '/assets/music/dramatic.mp3' },
    { id: 'chill', name: '😌 Chill', file: '/assets/music/chill.mp3' },
    { id: 'energetic', name: '⚡ Energetic', file: '/assets/music/energetic.mp3' },
    { id: 'none', name: '🔇 No Music', file: '' }
  ]

  // Initialize
  useEffect(() => {
    loadProjects()
    initializeCreator()
  }, [])

  async function initializeCreator() {
    try {
      await tiktokCreator.initialize()
      console.log('✅ Creator initialized')
    } catch (error) {
      console.error('Failed to initialize:', error)
    }
  }

  function loadProjects() {
    const saved = localStorage.getItem('tiktok_projects')
    if (saved) {
      setProjects(JSON.parse(saved))
    }
  }

  function saveProjects(updatedProjects: VideoProject[]) {
    setProjects(updatedProjects)
    localStorage.setItem('tiktok_projects', JSON.stringify(updatedProjects))
  }

  // Create video
  async function createVideo() {
    if (!topic.trim()) {
      alert('กรุณาใส่หัวข้อวิดีโอ')
      return
    }

    setIsProcessing(true)
    setProgress(0)

    const project: VideoProject = {
      id: Date.now().toString(),
      name: topic.substring(0, 50),
      topic,
      style,
      status: 'processing',
      createdAt: new Date()
    }

    saveProjects([project, ...projects])

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 1000)

      const videoBlob = await tiktokCreator.createVideo({
        topic,
        style,
        voiceGender,
        voiceStyle,
        backgroundMusic: musicOptions[0].file,
        effects: selectedEffects,
        transitions: selectedTransitions
      })

      clearInterval(progressInterval)
      setProgress(100)

      // Create download URL
      const url = URL.createObjectURL(videoBlob)
      project.videoUrl = url
      project.status = 'completed'
      
      // Update project
      saveProjects(projects.map(p => p.id === project.id ? project : p))

      // Preview video
      if (videoPreviewRef.current) {
        videoPreviewRef.current.src = url
        videoPreviewRef.current.play()
      }

      // Success notification
      showNotification('✅ วิดีโอสร้างเสร็จแล้ว!', 'success')
    } catch (error) {
      console.error('Video creation failed:', error)
      project.status = 'error'
      saveProjects(projects.map(p => p.id === project.id ? project : p))
      showNotification('❌ เกิดข้อผิดพลาด: ' + (error as Error).message, 'error')
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  // Download TikTok video
  async function downloadTikTok() {
    if (!downloadUrl.trim()) {
      alert('กรุณาใส่ URL ของวิดีโอ TikTok')
      return
    }

    setDownloadStatus('⏳ กำลังดาวน์โหลด...')
    
    try {
      const videoInfo = await tiktokDownloader.getVideoInfo(downloadUrl)
      if (!videoInfo) {
        throw new Error('ไม่สามารถดึงข้อมูลวิดีโอได้')
      }

      setDownloadStatus(`📹 พบวิดีโอ: ${videoInfo.title}`)
      
      const blob = await tiktokDownloader.downloadVideo(videoInfo)
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `tiktok_${videoInfo.id}.mp4`
        a.click()
        URL.revokeObjectURL(url)
        
        setDownloadStatus('✅ ดาวน์โหลดสำเร็จ!')
        showNotification('✅ ดาวน์โหลดวิดีโอสำเร็จ!', 'success')
      }
    } catch (error) {
      setDownloadStatus('❌ ดาวน์โหลดล้มเหลว: ' + (error as Error).message)
      showNotification('❌ ' + (error as Error).message, 'error')
    }
  }

  // Run tests
  async function runTests() {
    setTestResults({ status: 'running' })
    
    try {
      const report = await autoTester.runAllTests(100)
      setTestResults(report)
      
      if (report.successRate === 100) {
        showNotification('✅ ทดสอบผ่าน 100%!', 'success')
      } else {
        showNotification(`⚠️ ทดสอบผ่าน ${report.successRate.toFixed(1)}%`, 'warning')
      }
    } catch (error) {
      setTestResults({ status: 'error', error: (error as Error).message })
      showNotification('❌ การทดสอบล้มเหลว', 'error')
    }
  }

  // Show notification
  function showNotification(message: string, type: 'success' | 'error' | 'warning') {
    const notification = document.createElement('div')
    notification.className = `notification ${type}`
    notification.textContent = message
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.classList.add('show')
    }, 100)
    
    setTimeout(() => {
      notification.classList.remove('show')
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }

  // Toggle effect selection
  function toggleEffect(effectId: string) {
    setSelectedEffects(prev => 
      prev.includes(effectId) 
        ? prev.filter(e => e !== effectId)
        : [...prev, effectId]
    )
  }

  // Toggle transition selection
  function toggleTransition(transitionId: string) {
    setSelectedTransitions(prev => 
      prev.includes(transitionId) 
        ? prev.filter(t => t !== transitionId)
        : [...prev, transitionId]
    )
  }

  return (
    <div className="professional-app">
      {/* Header */}
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">🎬</span>
              <h1>TikTok Creator Pro</h1>
              <span className="version">v2.0</span>
            </div>
            <nav className="main-nav">
              <button 
                className={`nav-btn ${activeTab === 'create' ? 'active' : ''}`}
                onClick={() => setActiveTab('create')}
              >
                <span className="icon">✨</span>
                สร้างวิดีโอ
              </button>
              <button 
                className={`nav-btn ${activeTab === 'download' ? 'active' : ''}`}
                onClick={() => setActiveTab('download')}
              >
                <span className="icon">📥</span>
                ดาวน์โหลด
              </button>
              <button 
                className={`nav-btn ${activeTab === 'library' ? 'active' : ''}`}
                onClick={() => setActiveTab('library')}
              >
                <span className="icon">📚</span>
                คลังวิดีโอ
              </button>
            </nav>
            <button className="test-btn" onClick={runTests}>
              🧪 ทดสอบระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="container">
          {/* Create Tab */}
          {activeTab === 'create' && (
            <div className="create-section">
              <div className="create-grid">
                {/* Left Panel - Settings */}
                <div className="settings-panel">
                  <h2>ตั้งค่าวิดีโอ</h2>
                  
                  {/* Topic Input */}
                  <div className="form-group">
                    <label>
                      <span className="icon">📝</span>
                      หัวข้อวิดีโอ
                    </label>
                    <textarea
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="เช่น 'Bitcoin ทะลุ 100,000 ดอลลาร์ นักลงทุนต้องรู้อะไรบ้าง'"
                      rows={3}
                      className="topic-input"
                    />
                  </div>

                  {/* Style Selection */}
                  <div className="form-group">
                    <label>
                      <span className="icon">🎨</span>
                      สไตล์เนื้อหา
                    </label>
                    <div className="style-grid">
                      {[
                        { value: 'finance', label: '💰 การเงิน', color: '#4CAF50' },
                        { value: 'crypto', label: '🪙 คริปโต', color: '#FF9800' },
                        { value: 'news', label: '📰 ข่าวสาร', color: '#2196F3' },
                        { value: 'educational', label: '📚 ความรู้', color: '#9C27B0' }
                      ].map(s => (
                        <button
                          key={s.value}
                          className={`style-btn ${style === s.value ? 'active' : ''}`}
                          onClick={() => setStyle(s.value as any)}
                          style={{ '--accent-color': s.color } as any}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Voice Settings */}
                  <div className="form-group">
                    <label>
                      <span className="icon">🎙️</span>
                      เสียงพากย์
                    </label>
                    <div className="voice-settings">
                      <div className="voice-row">
                        <select 
                          value={voiceGender}
                          onChange={(e) => setVoiceGender(e.target.value as any)}
                          className="voice-select"
                        >
                          <option value="male">👨 ชาย</option>
                          <option value="female">👩 หญิง</option>
                        </select>
                        <select 
                          value={voiceStyle}
                          onChange={(e) => setVoiceStyle(e.target.value as any)}
                          className="voice-select"
                        >
                          <option value="energetic">⚡ มีพลัง</option>
                          <option value="professional">💼 เป็นทางการ</option>
                          <option value="friendly">😊 เป็นกันเอง</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Effects Selection */}
                  <div className="form-group">
                    <label>
                      <span className="icon">✨</span>
                      Text Effects
                    </label>
                    <div className="effects-grid">
                      {effects.map(effect => (
                        <div
                          key={effect.id}
                          className={`effect-card ${selectedEffects.includes(effect.id) ? 'selected' : ''}`}
                          onClick={() => toggleEffect(effect.id)}
                        >
                          <div className="effect-name">{effect.name}</div>
                          <div className="effect-desc">{effect.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transitions Selection */}
                  <div className="form-group">
                    <label>
                      <span className="icon">🎬</span>
                      Transitions
                    </label>
                    <div className="transitions-grid">
                      {transitions.map(transition => (
                        <div
                          key={transition.id}
                          className={`transition-card ${selectedTransitions.includes(transition.id) ? 'selected' : ''}`}
                          onClick={() => toggleTransition(transition.id)}
                        >
                          <div className="transition-name">{transition.name}</div>
                          <div className="transition-desc">{transition.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Panel - Preview */}
                <div className="preview-panel">
                  <h2>ตัวอย่างวิดีโอ</h2>
                  
                  <div className="video-preview">
                    <video
                      ref={videoPreviewRef}
                      controls
                      className="preview-video"
                      poster="/assets/preview-poster.jpg"
                    />
                  </div>

                  {/* Progress Bar */}
                  {isProcessing && (
                    <div className="progress-section">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="progress-text">
                        {progress < 20 && '🤖 กำลังสร้างเนื้อหา...'}
                        {progress >= 20 && progress < 40 && '🎙️ กำลังสร้างเสียงพากย์...'}
                        {progress >= 40 && progress < 60 && '🎨 กำลังสร้างภาพ...'}
                        {progress >= 60 && progress < 80 && '🎬 กำลังเรนเดอร์วิดีโอ...'}
                        {progress >= 80 && progress < 100 && '✨ กำลังใส่ effects...'}
                        {progress === 100 && '✅ เสร็จสมบูรณ์!'}
                      </div>
                    </div>
                  )}

                  {/* Create Button */}
                  <button
                    className="create-btn"
                    onClick={createVideo}
                    disabled={isProcessing || !topic.trim()}
                  >
                    {isProcessing ? (
                      <>
                        <span className="spinner"></span>
                        กำลังสร้างวิดีโอ...
                      </>
                    ) : (
                      <>
                        <span className="icon">🎬</span>
                        สร้างวิดีโอ TikTok
                      </>
                    )}
                  </button>

                  {/* Quick Stats */}
                  <div className="quick-stats">
                    <div className="stat">
                      <span className="stat-value">{projects.filter(p => p.status === 'completed').length}</span>
                      <span className="stat-label">วิดีโอสำเร็จ</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">30s</span>
                      <span className="stat-label">ความยาว</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">1080p</span>
                      <span className="stat-label">คุณภาพ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Download Tab */}
          {activeTab === 'download' && (
            <div className="download-section">
              <div className="download-container">
                <h2>ดาวน์โหลดวิดีโอ TikTok</h2>
                
                <div className="download-form">
                  <input
                    type="text"
                    value={downloadUrl}
                    onChange={(e) => setDownloadUrl(e.target.value)}
                    placeholder="วาง URL ของวิดีโอ TikTok ที่นี่"
                    className="url-input"
                  />
                  <button
                    className="download-btn"
                    onClick={downloadTikTok}
                  >
                    <span className="icon">📥</span>
                    ดาวน์โหลด
                  </button>
                </div>

                {downloadStatus && (
                  <div className={`download-status ${downloadStatus.includes('✅') ? 'success' : downloadStatus.includes('❌') ? 'error' : ''}`}>
                    {downloadStatus}
                  </div>
                )}

                <div className="download-info">
                  <h3>วิธีใช้:</h3>
                  <ol>
                    <li>เปิดแอป TikTok หรือเว็บไซต์</li>
                    <li>เลือกวิดีโอที่ต้องการดาวน์โหลด</li>
                    <li>กดปุ่มแชร์ และเลือก "คัดลอกลิงก์"</li>
                    <li>วางลิงก์ด้านบนและกดดาวน์โหลด</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Library Tab */}
          {activeTab === 'library' && (
            <div className="library-section">
              <h2>คลังวิดีโอของคุณ</h2>
              
              <div className="projects-grid">
                {projects.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">📹</span>
                    <p>ยังไม่มีวิดีโอ</p>
                    <button onClick={() => setActiveTab('create')}>
                      สร้างวิดีโอแรกของคุณ
                    </button>
                  </div>
                ) : (
                  projects.map(project => (
                    <div key={project.id} className="project-card">
                      <div className="project-status">
                        {project.status === 'completed' && '✅'}
                        {project.status === 'processing' && '⏳'}
                        {project.status === 'error' && '❌'}
                      </div>
                      <h3>{project.name}</h3>
                      <div className="project-meta">
                        <span>{project.style}</span>
                        <span>{new Date(project.createdAt).toLocaleDateString('th-TH')}</span>
                      </div>
                      {project.status === 'completed' && project.videoUrl && (
                        <div className="project-actions">
                          <a href={project.videoUrl} download={`${project.name}.mp4`}>
                            <span className="icon">📥</span>
                            ดาวน์โหลด
                          </a>
                          <button onClick={() => {
                            if (videoPreviewRef.current) {
                              videoPreviewRef.current.src = project.videoUrl!
                              videoPreviewRef.current.play()
                              setActiveTab('create')
                            }
                          }}>
                            <span className="icon">▶️</span>
                            เล่น
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Test Results Modal */}
      {testResults && (
        <div className="modal-overlay" onClick={() => setTestResults(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>ผลการทดสอบระบบ</h2>
            
            {testResults.status === 'running' ? (
              <div className="test-running">
                <div className="spinner large"></div>
                <p>กำลังทดสอบระบบ 100 ครั้ง...</p>
              </div>
            ) : testResults.status === 'error' ? (
              <div className="test-error">
                <p>❌ เกิดข้อผิดพลาด: {testResults.error}</p>
              </div>
            ) : (
              <div className="test-results">
                <div className="test-summary">
                  <div className="test-stat">
                    <span className="stat-value">{testResults.successRate.toFixed(1)}%</span>
                    <span className="stat-label">Success Rate</span>
                  </div>
                  <div className="test-stat">
                    <span className="stat-value">{testResults.passed}</span>
                    <span className="stat-label">Passed</span>
                  </div>
                  <div className="test-stat">
                    <span className="stat-value">{testResults.failed}</span>
                    <span className="stat-label">Failed</span>
                  </div>
                </div>
                
                {testResults.failures.length > 0 && (
                  <div className="test-failures">
                    <h3>❌ Failed Tests:</h3>
                    {testResults.failures.map((failure: any, index: number) => (
                      <div key={index} className="failure-item">
                        <strong>{failure.testName}</strong>
                        <span>{failure.error}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <button className="close-btn" onClick={() => setTestResults(null)}>
                  ปิด
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}