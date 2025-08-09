# คู่มือการ Deploy เว็บไซต์บวรบน GitHub Pages

## 📋 ขั้นตอนการ Deploy

### 1. สร้าง Repository ใหม่บน GitHub
1. ไปที่ [GitHub](https://github.com)
2. คลิก "New repository"
3. ตั้งชื่อ repository เป็น `borwan-website` หรือชื่อที่ต้องการ
4. เลือก "Public" (จำเป็นสำหรับ GitHub Pages ฟรี)
5. คลิก "Create repository"

### 2. อัปโหลดไฟล์
1. ดาวน์โหลดไฟล์ทั้งหมดจากโฟลเดอร์นี้
2. อัปโหลดไฟล์ทั้งหมดไปยัง repository ที่สร้าง

#### วิธีที่ 1: ใช้ GitHub Web Interface
1. คลิก "uploading an existing file"
2. ลากไฟล์ทั้งหมดมาวาง
3. เขียน commit message เช่น "Initial website deployment"
4. คลิก "Commit changes"

#### วิธีที่ 2: ใช้ Git Command Line
```bash
git clone https://github.com/your-username/borwan-website.git
cd borwan-website
# คัดลอกไฟล์ทั้งหมดมาใส่ในโฟลเดอร์นี้
git add .
git commit -m "Initial website deployment"
git push origin main
```

### 3. เปิดใช้งาน GitHub Pages
1. ไปที่ repository ของคุณ
2. คลิกแท็บ "Settings"
3. เลื่อนลงไปหา "Pages" ในเมนูซ้าย
4. ในส่วน "Source" เลือก "Deploy from a branch"
5. เลือก branch เป็น "main"
6. เลือก folder เป็น "/ (root)"
7. คลิก "Save"

### 4. รอการ Deploy
- GitHub จะใช้เวลา 5-10 นาทีในการ deploy
- คุณจะเห็น URL ของเว็บไซต์ในหน้า Settings > Pages
- URL จะเป็น: `https://your-username.github.io/repository-name`

## 🔧 การตั้งค่าเพิ่มเติม

### Custom Domain (ถ้าต้องการ)
1. แก้ไขไฟล์ `CNAME` ใส่ domain ของคุณ
2. ตั้งค่า DNS ของ domain ให้ชี้ไปที่ GitHub Pages
3. ใน Settings > Pages เลือก "Custom domain" และใส่ domain ของคุณ

### การอัปเดตเว็บไซต์
1. แก้ไขไฟล์ที่ต้องการ
2. Commit และ push การเปลี่ยนแปลง
3. GitHub Actions จะ deploy อัตโนมัติ

## 📱 การทดสอบ

### ตรวจสอบการทำงาน
- เปิดเว็บไซต์บนมือถือและเดสก์ท็อป
- ทดสอบการคลิกปุ่มต่างๆ
- ตรวจสอบการแสดงผลของรูปภาพ

### การแก้ไขปัญหา
- ถ้าเว็บไซต์ไม่แสดงผล ตรวจสอบ Actions tab
- ถ้ามีข้อผิดพลาด ดูใน Actions logs
- ตรวจสอบว่าไฟล์ `index.html` อยู่ใน root directory

## 🎨 การปรับแต่ง

### เปลี่ยนสี Theme
- แก้ไขไฟล์ CSS ในส่วน CSS variables
- ใช้ Tailwind CSS classes สำหรับการปรับแต่ง

### เพิ่มเนื้อหา
- แก้ไขไฟล์ `index.html` หรือ React components
- เพิ่มรูปภาพในโฟลเดอร์ `assets`

### เพิ่มหน้าใหม่
- สร้างไฟล์ HTML ใหม่
- เพิ่มลิงก์ในเมนูหลัก

## 📊 การติดตาม Analytics

### Google Analytics
1. สร้าง Google Analytics account
2. เพิ่ม tracking code ในไฟล์ `index.html`
3. ติดตามสถิติการเข้าชม

### GitHub Insights
- ดูสถิติใน repository > Insights
- ติดตามการเข้าชมและ traffic

## 🔒 ความปลอดภัย

### HTTPS
- GitHub Pages รองรับ HTTPS โดยอัตโนมัติ
- ตรวจสอบว่า "Enforce HTTPS" เปิดใช้งาน

### การอัปเดต Dependencies
- ตรวจสอบการอัปเดต security patches
- อัปเดต dependencies เป็นประจำ

## 📞 การสนับสนุน

หากมีปัญหาหรือข้อสงสัย:
1. ตรวจสอบ [GitHub Pages Documentation](https://docs.github.com/en/pages)
2. ดู GitHub Actions logs สำหรับข้อผิดพลาด
3. ตรวจสอบ browser console สำหรับ JavaScript errors

---

**หมายเหตุ**: คู่มือนี้เหมาะสำหรับผู้ใช้ทุกระดับ ตั้งแต่มือใหม่จนถึงผู้ที่มีประสบการณ์

