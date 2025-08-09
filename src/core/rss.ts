export type NewsItem = { title: string; link: string; pubDate?: string; source?: string }

const CORS_OK: string[] = [
  'https://news.google.com/rss/search?q=bitcoin&hl=en-US&gl=US&ceid=US:en',
  'https://feeds.feedburner.com/CoinDesk',
  'https://cointelegraph.com/rss'
]

export async function fetchRSS(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('RSS fetch failed: ' + res.status)
  const text = await res.text()
  const doc = new DOMParser().parseFromString(text, 'application/xml')
  const items = Array.from(doc.querySelectorAll('item'))
  return items.map(it => ({
    title: it.querySelector('title')?.textContent || '',
    link: it.querySelector('link')?.textContent || '',
    pubDate: it.querySelector('pubDate')?.textContent || '',
    source: new URL(url).host
  }))
}

export async function getFreshNews(max = 5) {
  for (const url of CORS_OK) {
    try {
      const list = await fetchRSS(url)
      if (list.length) return list.slice(0, max)
    } catch {}
  }
  return []
}