export function randomTopic(i: number): string {
  const topics = [
    'ข่าว Bitcoin เช้านี้',
    'ตลาดคริปโตเดือด',
    'เศรษฐกิจโลกชะลอ',
    'วาฬขยับราคา',
    'ดอกเบี้ยและบิตคอยน์',
    'ETF ไหลเข้า',
    'ตลาดคึกคัก',
    'ข่าวลือแรง',
    'เทคนิคอลแนวรับ',
    'ความผันผวนสูง',
  ]
  return topics[i % topics.length]
}

export function randomTone(i: number): 'serious' | 'fun' | 'mix' {
  return (['serious', 'fun', 'mix'] as const)[i % 3]
}