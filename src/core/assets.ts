export type CCAsset = { url: string; type: 'image'|'video'; credit?: string }

// CC0 fallbacks (ปรับ/เพิ่มได้)
const FALLBACKS: CCAsset[] = [
  { url: 'https://images.pexels.com/photos/6801871/pexels-photo-6801871.jpeg', type:'image', credit:'Pexels CC0' },
  { url: 'https://images.pexels.com/photos/8370751/pexels-photo-8370751.jpeg', type:'image', credit:'Pexels CC0' },
  { url: 'https://cdn.coverr.co/videos/coverr-waves-3290/1080p.mp4', type:'video', credit:'Coverr CC0' },
  { url: 'https://cdn.coverr.co/videos/coverr-a-busy-trading-floor-0409/1080p.mp4', type:'video', credit:'Coverr CC0' }
]

export async function pickAssets(keywords: string[]) {
  const k = keywords.join(' ').toLowerCase()
  const filtered = FALLBACKS.filter(a => {
    if (k.includes('ocean') || k.includes('deep')) return a.url.includes('waves') || a.type==='image'
    if (k.includes('bitcoin') || k.includes('chart') || k.includes('trade')) return true
    return true
  })
  return filtered.length ? filtered : FALLBACKS
}