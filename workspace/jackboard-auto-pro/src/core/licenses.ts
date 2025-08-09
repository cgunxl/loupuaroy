interface CreditItem { source: string; title: string; license: 'CC0' | 'CC-BY'; url: string }
const credits: CreditItem[] = []

export function addCredit(c: CreditItem) {
  credits.push(c)
}

export function getCredits(): CreditItem[] {
  return credits.slice()
}

export function creditsOverlayText(): string {
  const items = credits.filter((c) => c.license === 'CC-BY')
  if (!items.length) return ''
  return 'Credits: ' + items.map((i) => `${i.title} (${i.license}) ${i.source}`).join(' · ')
}