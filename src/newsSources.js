const SOURCES = [
  // RSS feeds
  { name: 'Google News (RSS)', type: 'rss', url: (q, lang) => `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=${lang}-${lang.toUpperCase()}&gl=${lang.toUpperCase()}&ceid=${lang.toUpperCase()}:${lang}` },
  { name: 'NYTimes Top Stories (RSS)', type: 'rss', url: () => 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml' },
  { name: 'Guardian Business (RSS)', type: 'rss', url: () => 'https://www.theguardian.com/uk/business/rss' },
  { name: 'CoinDesk (RSS)', type: 'rss', url: () => 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
  { name: 'Cointelegraph (RSS)', type: 'rss', url: () => 'https://cointelegraph.com/rss' },
  // JSON sources
  { name: 'Reddit r/CryptoCurrency', type: 'json:reddit', url: () => 'https://www.reddit.com/r/CryptoCurrency/hot.json?limit=12' },
  { name: 'GDELT Docs', type: 'json:gdelt', url: (q) => `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(q)}&format=json` },
];

async function tryFetch(url) {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const ct = r.headers.get('content-type') || '';
    const text = ct.includes('application/json') ? JSON.stringify(await r.json()) : await r.text();
    return { ok: true, text, via: 'direct' };
  } catch (e) {
    try {
      const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const r2 = await fetch(proxy);
      if (!r2.ok) throw new Error(`Proxy HTTP ${r2.status}`);
      const j = await r2.json();
      return { ok: true, text: j.contents, via: 'allorigins' };
    } catch (e2) {
      return { ok: false, error: e2.message };
    }
  }
}

function parseRSS(xmlText) {
  const doc = new DOMParser().parseFromString(xmlText, 'application/xml');
  const items = Array.from(doc.querySelectorAll('item')).slice(0, 15).map(node => ({
    title: node.querySelector('title')?.textContent?.trim() || '',
    link: node.querySelector('link')?.textContent?.trim() || '',
    pubDate: node.querySelector('pubDate')?.textContent?.trim() || '',
    source: node.querySelector('source')?.textContent?.trim() || '',
    description: node.querySelector('description')?.textContent?.replace(/<[^>]+>/g, '').trim() || '',
  }));
  return items;
}

function parseReddit(jsonText) {
  const j = JSON.parse(jsonText);
  const items = (j.data?.children || []).map(ch => ch.data).map(d => ({
    title: d.title,
    link: `https://www.reddit.com${d.permalink}`,
    pubDate: new Date(d.created_utc * 1000).toUTCString(),
    source: 'Reddit',
    description: d.selftext || '',
  }));
  return items;
}

function parseGdelt(jsonText) {
  const j = JSON.parse(jsonText);
  const arts = j.articles || j.documents || [];
  return arts.slice(0, 20).map(a => ({
    title: a.title || a.seendate || 'GDELT Doc',
    link: a.url || a.sourceCommonName || '',
    pubDate: a.seendate ? new Date(a.seendate).toUTCString() : new Date().toUTCString(),
    source: a.domain || 'GDELT',
    description: a.excerpt || a.description || '',
  }));
}

function scoreItemDrama(item) {
  const t = `${item.title} ${item.description}`.toLowerCase();
  let s = 0;
  if (/dump|crash|hack|ban|lawsuit|ล้ม|ร่วง|รั่ว|พุ่ง|เดือด|วิกฤต/.test(t)) s += 3;
  if (/bitcoin|btc|eth|crypto|ตลาด|หุ้น/.test(t)) s += 2;
  if (/%|\$|฿|ล้าน|พันล้าน|บิตคอยน์/.test(t)) s += 1.5;
  return s;
}

export async function fetchNewsBundle({ query, lang = 'th' }) {
  const credits = [];
  const tasks = SOURCES.map(async src => {
    try {
      const url = typeof src.url === 'function' ? src.url(query, lang) : src.url;
      const res = await tryFetch(url);
      if (!res.ok) return { items: [], credit: `${src.name} (fail)` };
      let items = [];
      if (src.type === 'rss') items = parseRSS(res.text);
      else if (src.type === 'json:reddit') items = parseReddit(res.text);
      else if (src.type === 'json:gdelt') items = parseGdelt(res.text);
      items.forEach(it => it._source = src.name);
      return { items, credit: `${src.name}${res.via ? ` via ${res.via}` : ''}` };
    } catch (_) {
      return { items: [], credit: `${src.name} (error)` };
    }
  });

  const results = await Promise.all(tasks);
  const all = results.flatMap(r => r.items);
  results.forEach(r => credits.push(r.credit));

  // dedupe by normalized title
  const map = new Map();
  for (const it of all) {
    const key = it.title.replace(/\s+/g,' ').trim().toLowerCase();
    if (!map.has(key)) map.set(key, it);
  }
  const items = Array.from(map.values())
    .map(it => ({ ...it, _score: scoreItemDrama(it) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, 10);
  return { items, credits };
}