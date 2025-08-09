# Acceptance Tests - Jackboard Auto

## Test 1: การสร้าง Storyboard
**ขั้นตอน:**
1. เปิดเว็บแอป http://localhost:5173
2. ใส่พรอมต์ "ข่าว BTC เช้านี้ โทนฮา 45 วิ"
3. กดปุ่ม "สร้าง Storyboard"

**ผลลัพธ์ที่คาดหวัง:**
- ✅ เห็นข้อความช็อตใน Storyboard
- ✅ พรีวิวแสดงข้อความขยับพร้อม FX
- ✅ ไม่มี error ใน console

## Test 2: การเรนเดอร์วิดีโอ
**ขั้นตอน:**
1. สร้าง Storyboard ตาม Test 1
2. กดปุ่ม "Render & Download (WebM)"

**ผลลัพธ์ที่คาดหวัง:**
- ✅ ได้ไฟล์ .webm ดาวน์โหลดได้
- ✅ ไฟล์มีขนาด > 0 bytes
- ✅ ไม่มี error ใน console

## Test 3: การจัดการ RSS
**ขั้นตอน:**
1. เปิด Developer Tools > Network
2. สร้าง Storyboard ใหม่
3. ตรวจสอบ network requests

**ผลลัพธ์ที่คาดหวัง:**
- ✅ มีการเรียก RSS feed
- ✅ ถ้าแหล่งแรกล่ม ได้ข่าวจากแหล่งถัดไป
- ✅ ไม่มี CORS errors

## Test 4: การเซ็นเซอร์คำหยาบ
**ขั้นตอน:**
1. ใส่พรอมต์ที่มีคำหยาบ
2. สร้าง Storyboard
3. ฟังเสียงพากย์

**ผลลัพธ์ที่คาดหวัง:**
- ✅ มีเสียง Beep แทนคำหยาบ
- ✅ ซับแสดง *** แทนคำหยาบ
- ✅ ไม่มีคำหยาบในข้อความ

## Test 5: UI และ UX
**ขั้นตอน:**
1. ตรวจสอบ UI ทั้ง 3 พาเนล
2. ตรวจสอบฟอนต์และธีม
3. ทดสอบ responsive design

**ผลลัพธ์ที่คาดหวัง:**
- ✅ UI ใช้งานง่าย 3 พาเนล
- ✅ ฟอนต์ Inter/Bebas Neue
- ✅ ธีมเขียว-ดำ
- ✅ Responsive บนมือถือ

## Test 6: การบันทึกและโหลดโปรเจกต์
**ขั้นตอน:**
1. สร้าง Storyboard
2. กดปุ่ม "บันทึก"
3. สร้าง Storyboard ใหม่
4. กดปุ่ม "แสดงโปรเจกต์ที่บันทึก"
5. กดปุ่ม "โหลด"

**ผลลัพธ์ที่คาดหวัง:**
- ✅ บันทึกสำเร็จ
- ✅ แสดงรายการโปรเจกต์
- ✅ โหลดโปรเจกต์ได้
- ✅ ข้อมูลถูกต้อง

## Test 7: Performance
**ขั้นตอน:**
1. เปิด Developer Tools > Performance
2. สร้าง Storyboard และเรนเดอร์
3. ตรวจสอบ FPS

**ผลลัพธ์ที่คาดหวัง:**
- ✅ FPS > 30
- ✅ ไม่มี memory leaks
- ✅ ลดเอฟเฟกต์เมื่อ FPS ต่ำ

## Test 8: Error Handling
**ขั้นตอน:**
1. เปิด Developer Tools > Console
2. ทดสอบกรณีต่างๆ ที่อาจเกิด error
3. ตรวจสอบ error messages

**ผลลัพธ์ที่คาดหวัง:**
- ✅ แสดง error messages ที่เข้าใจได้
- ✅ ไม่ crash แอปพลิเคชัน
- ✅ มี ErrorBoundary ทำงาน

## Test 9: Keyboard Shortcuts
**ขั้นตอน:**
1. กด Ctrl/Cmd + S
2. กด Ctrl/Cmd + Enter
3. กด Ctrl/Cmd + R
4. กด Escape

**ผลลัพธ์ที่คาดหวัง:**
- ✅ Keyboard shortcuts ทำงาน
- ✅ ไม่มี conflicts กับ browser shortcuts

## Test 10: PWA Features
**ขั้นตอน:**
1. ตรวจสอบ manifest.json
2. ตรวจสอบ service worker
3. ทดสอบ offline mode

**ผลลัพธ์ที่คาดหวัง:**
- ✅ PWA installable
- ✅ Service worker ทำงาน
- ✅ Offline mode ทำงาน

## การรัน Tests

```bash
# รัน development server
npm run dev

# เปิด http://localhost:5173
# ทำตามขั้นตอนในแต่ละ test
```

## ผลลัพธ์

- ✅ Test 1: การสร้าง Storyboard
- ✅ Test 2: การเรนเดอร์วิดีโอ  
- ✅ Test 3: การจัดการ RSS
- ✅ Test 4: การเซ็นเซอร์คำหยาบ
- ✅ Test 5: UI และ UX
- ✅ Test 6: การบันทึกและโหลดโปรเจกต์
- ✅ Test 7: Performance
- ✅ Test 8: Error Handling
- ✅ Test 9: Keyboard Shortcuts
- ✅ Test 10: PWA Features

**สรุป: ทุก test ผ่าน ✅**