import sources from '../../presets/corsSources.json'
import type { NewsItem } from '../types'

export async function fetchNews(keyword: string): Promise<NewsItem[]> {
  const results: NewsItem[] = []
  for (const src of sources) {
    try {
      const u = src.replace('{q}', encodeURIComponent(keyword))
      const res = await fetch(u, { mode: 'cors' })
      if (!res.ok) continue
      const text = await res.text()
      const parsed = parseSource(u, text)
      results.push(...parsed)
      if (results.length >= 5) break
    } catch {
      continue
    }
  }
  return results.slice(0, 8)
}

function parseSource(url: string, body: string): NewsItem[] {
  if (url.includes('reddit.com')) {
    try {
      const json = JSON.parse(body)
      const children = json.data?.children || []
      return children.map((c: any) => ({
        title: c.data.title,
        source: 'Reddit',
        publishedAt: new Date(c.data.created_utc * 1000).toISOString(),
        url: 'https://reddit.com' + c.data.permalink,
        summary: c.data.selftext?.slice(0, 200) || '',
      }))
    } catch {
      return []
    }
  }
  // naive RSS title extraction as fallback
  const items: NewsItem[] = []
  const re = /<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>[\s\S]*?<pubDate>([\s\S]*?)<\/pubDate>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(body))) {
    items.push({
      title: decodeHtml(m[1]),
      source: new URL(url).hostname,
      publishedAt: new Date(m[3]).toISOString(),
      url: m[2],
      summary: '',
    })
  }
  return items
}

function decodeHtml(s: string): string {
  const txt = document.createElement('textarea')
  txt.innerHTML = s
  return txt.value
}