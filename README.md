# Jackboard Auto (Client-only, No Sign-up, No Key)
ระบบเว็บสร้างวิดีโอสั้น 30–60 วิ สไตล์ Jackboard Story โดยไม่ต้องสมัคร/ไม่ต้อง API
เทคโนโลยี: React + Vite + TypeScript + PixiJS + GSAP + WebAudio + MediaRecorder

## วิธีรัน
npm i
npm run dev
เปิด http://localhost:5173

## ขั้นตอนใช้งาน
1) ใส่พรอมต์ + ความยาว + โทน
2) อัปโหลดมาสคอส PNG โปร่งใส + ปาก open/close
3) กด "สร้าง Storyboard จากข่าวสด"
4) กด "Render & Download (WebM)"

## หมายเหตุ
- เสียงพากย์ใช้ Web Speech Synthesis API (ไม่มี API key)
- RSS เปิด CORS ตัวอย่าง: Google News RSS (bitcoin), CoinDesk, Cointelegraph (แก้ไขใน src/core/rss.ts)
- เอฟเฟกต์ดูที่ src/core/effects.ts
- ต้องการ MP4 ให้เพิ่มปุ่มใช้ @ffmpeg/ffmpeg แบบ lazy-load

## โครงเวลา Jackboard
Hook (0–3s) → Context (3–8s) → Insight (8–25s) → Joke (25–32s) → Takeaway (32–41s) → CTA (41–45s)