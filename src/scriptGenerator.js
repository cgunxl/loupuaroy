function secondsToSrtTime(s) {
  const ms = Math.round((s - Math.floor(s)) * 1000);
  const z = n => String(n).padStart(2, '0');
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return `${z(h)}:${z(m)}:${z(sec)},${String(ms).padStart(3, '0')}`;
}

export function segmentsToSRT(segments) {
  return segments.map((seg, i) => {
    const start = secondsToSrtTime(seg.t);
    const end = secondsToSrtTime(seg.t + seg.d);
    return `${i + 1}\n${start} --> ${end}\n${seg.text}\n`;
  }).join('\n');
}

function censorProfanity(text) {
  const list = [
    'โง่', 'บ้า', 'เหี้ย', 'เชี่ย', 'ควาย', 'สัส', 'แม่ง', 'ไอ้', 'fuck', 'shit', 'damn'
  ];
  let out = text;
  for (const w of list) {
    const re = new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    out = out.replace(re, '__BEEP__');
  }
  return out;
}

export function buildScriptThai({ topic, durationSec, news }) {
  const headlines = news.slice(0, 5).map((n, i) => `(${i + 1}) ${n.title}`).join(' | ');
  const dataPoint = news[0]?.description?.slice(0, 120) || news[0]?.title || 'ข้อมูลล่าสุดกำลังอัปเดต';

  const segs = [
    { key: 'HOOK', d: 3, text: `__BEEP__ ${topic} เดือด! คนดูราคาคริปโตแล้วมึนหัว` },
    { key: 'CONTEXT', d: 5, text: `สรุปข่าว: ${headlines}` },
    { key: 'DATA', d: 7, text: `ตัวเลขน่าสนใจ: ${dataPoint} [1]` },
    { key: 'PAIN', d: 8, text: 'หลายคนขาดทุนเพราะรีบไล่ซื้อ ไม่วางแผนเสี่ยง และไม่ตั้งจุดตัดขาดทุน' },
    { key: 'INSIGHT', d: 7, text: 'ทางออกคือกำหนดกติกาตัวเอง: จัดพอร์ต DCA, วาง Stop-Loss, และอย่าตามกระแส' },
    { key: 'JOKE', d: 6, text: 'กราฟวันนี้เหมือนรถไฟเหาะ ซื้อตั๋วแล้วอย่าลืมรัดเข็มขัดนะ' },
    { key: 'TAKEAWAY', d: 7, text: 'บทเรียน: โฟกัสวินัยมากกว่าดวง ใช้ข้อมูลประกอบการตัดสินใจ' },
    { key: 'CTA', d: 2, text: 'กดติดตามไว้ เดี๋ยวมีคลิปต่อไป!' },
  ];

  // Scale durations to match durationSec
  const sum = segs.reduce((a, b) => a + b.d, 0);
  const scale = durationSec / sum;
  const scaled = segs.map(s => ({ ...s, d: Math.max(1.2, Math.round(s.d * scale)) }));

  let t = 0;
  const segments = scaled.map(s => { const out = { ...s, t, text: censorProfanity(s.text) }; t += s.d; return out; });

  const fullText = segments.map(s => `${s.key}: ${s.text}`).join('\n');
  return { segments, fullText };
}