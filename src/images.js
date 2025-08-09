const WMC_API = 'https://commons.wikimedia.org/w/api.php';
const OPENVERSE = 'https://api.openverse.org/v1/images';

function buildWmcQuery(topic) {
  const q = topic || 'market';
  return `${WMC_API}?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrlimit=12&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1920&format=json&origin=*`;
}

async function searchWikimedia(topic) {
  const resp = await fetch(buildWmcQuery(topic));
  const json = await resp.json();
  const pages = Object.values(json.query?.pages || {});
  const items = pages
    .filter(p => p.imageinfo && p.imageinfo[0])
    .map(p => {
      const info = p.imageinfo[0];
      const meta = info.extmetadata || {};
      return {
        title: p.title,
        thumb: info.thumburl || info.url,
        url: info.url,
        license: meta.LicenseShortName?.value || 'Unknown',
        artist: meta.Artist?.value || '',
        credit: meta.Credit?.value || '',
        source: 'Wikimedia Commons',
      };
    });
  return items;
}

async function searchOpenverse(topic) {
  const q = new URLSearchParams({ q: topic || 'finance', license: 'cc0,pdm', page_size: '12' });
  const url = `${OPENVERSE}?${q.toString()}`;
  const r = await fetch(url);
  if (!r.ok) return [];
  const j = await r.json();
  return (j.results || []).map(m => ({
    title: m.title || m.id,
    thumb: m.thumbnail || m.url,
    url: m.url,
    license: (m.license || '').toUpperCase(),
    artist: m.creator || '',
    credit: m.foreign_landing_url || '',
    source: 'Openverse',
  }));
}

export async function searchBackgrounds(topic) {
  try {
    const [wm, ov] = await Promise.allSettled([
      searchWikimedia(topic),
      searchOpenverse(topic),
    ]);
    const wA = wm.status === 'fulfilled' ? wm.value : [];
    const oA = ov.status === 'fulfilled' ? ov.value : [];
    return [...wA, ...oA].slice(0, 18);
  } catch (e) {
    return [];
  }
}