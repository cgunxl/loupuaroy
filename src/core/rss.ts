export type NewsItem = { title: string; link: string; pubDate?: string; source?: string }

const SOURCES: string[] = [
  'https://news.google.com/rss/search?q=bitcoin&hl=en-US&gl=US&ceid=US:en',
  'https://feeds.feedburner.com/CoinDesk',
  'https://cointelegraph.com/rss',
  'https://www.reddit.com/r/CryptoCurrency/.rss',
  'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml'
]

function withProxy(url: string) {
  try {
    const u = new URL(url)
    if (u.protocol === 'https:') return url
  } catch {}
  // r.jina.ai fetches HTML content as text with permissive CORS
  return `https://r.jina.ai/http://` + url.replace(/^https?:\/\//, '')
}

function parseRSS(text: string, url: string): NewsItem[] {
  const doc = new DOMParser().parseFromString(text, 'application/xml')
  const items = Array.from(doc.querySelectorAll('item'))
  if (items.length) {
    return items.map(it => ({
      title: it.querySelector('title')?.textContent || '',
      link: it.querySelector('link')?.textContent || '',
      pubDate: it.querySelector('pubDate')?.textContent || '',
      source: new URL(url).host
    }))
  }
  // Atom fallback
  const entries = Array.from(doc.querySelectorAll('entry'))
  return entries.map(e => ({
    title: e.querySelector('title')?.textContent || '',
    link: (e.querySelector('link') as any)?.getAttribute?.('href') || '',
    pubDate: e.querySelector('updated')?.textContent || '',
    source: new URL(url).host
  }))
}

export async function fetchRSS(url: string) {
  const res = await fetch(withProxy(url))
  if (!res.ok) throw new Error('RSS fetch failed: ' + res.status)
  const text = await res.text()
  return parseRSS(text, url)
}

export async function getFreshNews(max = 5) {
  for (const url of SOURCES) {
    try {
      const list = await fetchRSS(url)
      if (list.length) return list.slice(0, max)
    } catch {}
  }
  return []
}