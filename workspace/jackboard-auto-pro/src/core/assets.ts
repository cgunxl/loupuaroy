import { set, get } from 'idb-keyval'
import loops from '../../presets/bgLoops.json'

export async function pickBackgrounds(count: number): Promise<string[]> {
  const cacheKey = `bg-picks-${count}`
  const cached = await get<string[]>(cacheKey)
  if (cached && cached.length >= count) return cached.slice(0, count)
  const picks: string[] = []
  for (let i = 0; i < count; i++) picks.push(loops[i % loops.length])
  await set(cacheKey, picks)
  return picks
}