function pickBackgrounds(backgrounds, needed) {
  if (!backgrounds?.length) return Array.from({ length: needed }).map((_,i)=>({ url: null, title: 'solid', license: 'N/A', artist:'', credit:'', source:'Solid' }));
  const arr = [];
  for (let i=0;i<needed;i++) arr.push(backgrounds[i % backgrounds.length]);
  return arr;
}

export function generateShotlist({ durationSec, script, backgrounds }) {
  const segments = script.segments;
  const bg = pickBackgrounds(backgrounds, segments.length);
  const shots = segments.map((seg, idx) => ({
    t: seg.t,
    d: seg.d,
    text: seg.text,
    fx: idx % 2 === 0 ? ['typewriter','kenBurns','highlightGlow'] : ['slideIn','popIn','kenBurns'],
    bgIndex: idx,
  }));
  return { duration: durationSec, shots, backgrounds: bg };
}