# Jackboard Auto API Documentation

## Core Modules

### RSS Module (`src/core/rss.ts`)
- `fetchRSS(url: string)`: ดึงข้อมูลจาก RSS feed
- `getFreshNews(max: number)`: ดึงข่าวล่าสุดจาก RSS ที่เปิด CORS

### Script Engine (`src/core/scriptEngine.ts`)
- `buildFromNews(prompt, news, duration, censorWords)`: สร้างสคริปต์จากข่าว

### Effects (`src/core/effects.ts`)
- `FX.glitch()`: เอฟเฟกต์ glitch
- `FX.shake()`: เอฟเฟกต์สั่น
- `FX.typewriter()`: เอฟเฟกต์พิมพ์
- `FX.slideIn()`: เอฟเฟกต์เลื่อนเข้า
- `FX.popIn()`: เอฟเฟกต์ปรากฏ
- `FX.highlightGlow()`: เอฟเฟกต์เรืองแสง
- `FX.countUp()`: เอฟเฟกต์นับเลข
- `FX.lightSweep()`: เอฟเฟกต์แสงกวาด
- `FX.colorGrade()`: เอฟเฟกต์ปรับสี
- `FX.speedLines()`: เอฟเฟกต์เส้นความเร็ว
- `FX.particleBurst()`: เอฟเฟกต์ระเบิดอนุภาค
- `FX.kenBurns()`: เอฟเฟกต์ Ken Burns
- `FX.parallax()`: เอฟเฟกต์ Parallax
- `FX.dollyZoom()`: เอฟเฟกต์ Dolly Zoom

### Audio Engine (`src/core/audioEngine.ts`)
- `AudioEngine`: จัดการเสียงและ Web Speech Synthesis
- `playBeep()`: เล่นเสียงบี๊บ
- `speakChunks()`: พากย์ข้อความ

### Storage (`src/core/storage.ts`)
- `ProjectStorage.saveProject()`: บันทึกโปรเจกต์
- `ProjectStorage.loadProject()`: โหลดโปรเจกต์
- `ProjectStorage.deleteProject()`: ลบโปรเจกต์
- `ProjectStorage.listProjects()`: รายการโปรเจกต์

### Performance (`src/core/performance.ts`)
- `PerformanceMonitor`: จัดการ performance และ FPS
- `shouldReduceEffects()`: ตรวจสอบว่าควรลดเอฟเฟกต์หรือไม่

## State Management

### Store (`src/store.ts`)
- `useStore`: Zustand store สำหรับจัดการ state
- `Project`: Type สำหรับโปรเจกต์
- `Shot`: Type สำหรับช็อต

## UI Components

### PromptPanel
- จัดการการป้อนข้อมูลและสร้าง storyboard

### CanvasStage
- แสดงพรีวิววิดีโอด้วย PixiJS

### RenderPanel
- จัดการการเรนเดอร์และดาวน์โหลดวิดีโอ

### Storyboard
- แสดง storyboard

### ErrorBoundary
- จัดการ React errors

## Keyboard Shortcuts

- `Ctrl/Cmd + S`: บันทึกโปรเจกต์
- `Ctrl/Cmd + Enter`: สร้าง storyboard
- `Ctrl/Cmd + R`: เรนเดอร์วิดีโอ
- `Escape`: ล้างข้อความ error

## RSS Sources

แหล่งข่าวที่เปิด CORS:
- Google News RSS (Bitcoin)
- CoinDesk
- Cointelegraph

## File Structure

```
src/
├── core/           # Core modules
├── ui/            # React components
├── styles/        # CSS styles
├── store.ts       # State management
└── main.tsx       # Entry point
```