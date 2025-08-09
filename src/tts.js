let audioCtx = null;
let masterGain = null;
let analyser = null;
let destNode = null; // MediaStreamDestination for recorder

export async function initAudioSystem() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 1.0;
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024;
    destNode = audioCtx.createMediaStreamDestination();
    masterGain.connect(analyser);
    masterGain.connect(audioCtx.destination);
    // Also send to destination for recorder track
    masterGain.connect(destNode);
  }
  if (audioCtx.state === 'suspended') await audioCtx.resume();
}

export function getAudioStream() {
  return destNode?.stream || null;
}

export function getAnalyser() { return analyser; }

function playBeep(durationMs = 300) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  gain.gain.value = 0.2;
  osc.frequency.value = 1000;
  osc.connect(gain).connect(masterGain);
  osc.start();
  osc.stop(audioCtx.currentTime + durationMs / 1000);
}

function scheduleEnvelopeForLipSync(totalMs) {
  // Create a dummy oscillator with amplitude envelope to drive analyser for lip-sync
  const osc = audioCtx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = 180; // rough voice-ish
  const gain = audioCtx.createGain();
  gain.gain.value = 0.0;
  osc.connect(gain).connect(masterGain);
  const now = audioCtx.currentTime;
  // simple attack/decay per 300ms chunk
  const chunk = 0.3;
  const chunks = Math.max(1, Math.floor(totalMs / (chunk * 1000)));
  for (let i = 0; i < chunks; i++) {
    const t0 = now + i * chunk;
    gain.gain.linearRampToValueAtTime(0.0, t0);
    gain.gain.linearRampToValueAtTime(0.28, t0 + 0.12);
    gain.gain.linearRampToValueAtTime(0.05, t0 + chunk - 0.02);
  }
  osc.start(now);
  osc.stop(now + totalMs / 1000 + 0.05);
}

export async function speakThaiScriptWithBeep(script) {
  await initAudioSystem();
  const synth = window.speechSynthesis;
  if (!synth) { console.warn('SpeechSynthesis not supported'); return; }
  const allText = script.segments.map(s=>s.text).join(' ');
  const totalMs = script.segments.reduce((a,b)=>a + b.d*1000, 0);
  scheduleEnvelopeForLipSync(totalMs);

  let cursorMs = 0;
  for (const seg of script.segments) {
    const utter = new SpeechSynthesisUtterance(seg.text.replace(/__BEEP__/g, ''));
    utter.lang = 'th-TH';
    utter.rate = 1.05;
    utter.pitch = 1.0;
    utter.volume = 1.0;
    // Handle boundary for beeps (we separately play beeps where placeholders are)
    if (seg.text.includes('__BEEP__')) {
      setTimeout(() => playBeep(200), cursorMs);
    }
    await speakUtterance(utter);
    cursorMs += seg.d * 1000;
  }
}

function speakUtterance(utter) {
  return new Promise(resolve => {
    utter.onend = resolve;
    utter.onerror = resolve;
    window.speechSynthesis.speak(utter);
  });
}