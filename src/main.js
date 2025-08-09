import { fetchNewsBundle } from './newsSources.js';
import { searchBackgrounds } from './images.js';
import { buildScriptThai, segmentsToSRT } from './scriptGenerator.js';
import { generateShotlist } from './shotlist.js';
import { initAudioSystem, speakThaiScriptWithBeep, getAnalyser } from './tts.js';
import { Renderer } from './render.js';
import { startRecording, stopRecording } from './recorder.js';
import { saveSession, loadLatest } from './storage.js';

const els = {
  topic: document.getElementById('topic'),
  duration: document.getElementById('duration'),
  lang: document.getElementById('lang'),
  btnFetch: document.getElementById('btnFetch'),
  btnScript: document.getElementById('btnScript'),
  btnRender: document.getElementById('btnRender'),
  btnStartAudio: document.getElementById('btnStartAudio'),
  btnSpeak: document.getElementById('btnSpeak'),
  scriptBox: document.getElementById('scriptBox'),
  stage: document.getElementById('stage'),
  log: document.getElementById('log'),
  credits: document.getElementById('credits'),
  btnRecord: document.getElementById('btnRecord'),
  btnStop: document.getElementById('btnStop'),
  dlWebm: document.getElementById('dlWebm'),
  dlSrt: document.getElementById('dlSrt'),
};

function log(msg) {
  const time = new Date().toLocaleTimeString();
  els.log.textContent += `[${time}] ${msg}\n`;
  els.log.scrollTop = els.log.scrollHeight;
}

let state = {
  news: [],
  backgrounds: [],
  script: null,
  shotlist: null,
  credits: [],
  renderer: null,
  srtText: '',
};

async function runFetch() {
  const topic = els.topic.value.trim();
  log(`กำลังดึงข่าวสำหรับ: ${topic}`);
  const bundle = await fetchNewsBundle({ query: topic, lang: els.lang.value });
  state.news = bundle.items;
  state.credits = bundle.credits;
  log(`ได้ข่าว ${state.news.length} หัวข้อ`);

  log('ค้นหาภาพ/วิดีโอพื้นหลัง (Wikimedia Commons)...');
  state.backgrounds = await searchBackgrounds(topic);
  log(`พบสื่อพื้นหลัง ${state.backgrounds.length} รายการ`);

  const mediaCredits = state.backgrounds.map(b => `${b.source}: ${b.title} (${b.license})`).slice(0, 10);
  els.credits.innerHTML = [...bundle.credits, ...mediaCredits].map(c => `• ${c}`).join('<br/>');
  await saveSession({ step: 'news', topic, news: state.news, credits: [...bundle.credits, ...mediaCredits] });
}

async function runScript() {
  const topic = els.topic.value.trim();
  const duration = parseInt(els.duration.value, 10) || 45;
  if (!state.news.length) {
    log('ยังไม่ดึงข่าว จะดึงให้ก่อน...');
    await runFetch();
  }
  const res = buildScriptThai({ topic, durationSec: duration, news: state.news });
  state.script = res;
  els.scriptBox.value = res.fullText;
  state.srtText = segmentsToSRT(res.segments);
  els.dlSrt.href = URL.createObjectURL(new Blob([state.srtText], { type: 'text/plain' }));
  els.dlSrt.textContent = 'ดาวน์โหลด SRT';
  log('สร้างสคริปต์และ SRT แล้ว');
  await saveSession({ step: 'script', topic, script: state.script, srt: state.srtText });
}

async function runRender() {
  const duration = parseInt(els.duration.value, 10) || 45;
  if (!state.script) {
    log('ยังไม่มีสคริปต์ จะสร้างให้ก่อน...');
    await runScript();
  }
  state.shotlist = generateShotlist({ durationSec: duration, script: state.script, backgrounds: state.backgrounds });
  log('สร้าง Shotlist แล้ว');

  if (state.renderer) {
    state.renderer.destroy();
  }
  state.renderer = new Renderer({ canvas: els.stage, width: 1280, height: 720, analyser: getAnalyser() });
  await state.renderer.loadBackgrounds(state.shotlist.backgrounds);
  state.renderer.play(state.shotlist);
  await saveSession({ step: 'render', shotlist: state.shotlist });
}

async function runSpeak() {
  if (!state.script) {
    await runScript();
  }
  log('พากย์ด้วย Web Speech (ไทย) และบี๊บคำหยาบ');
  await speakThaiScriptWithBeep(state.script);
}

els.btnFetch.addEventListener('click', () => runFetch().catch(e => log(e.message)));
els.btnScript.addEventListener('click', () => runScript().catch(e => log(e.message)));
els.btnRender.addEventListener('click', () => runRender().catch(e => log(e.message)));
els.btnStartAudio.addEventListener('click', async () => {
  await initAudioSystem();
  log('AudioContext พร้อมใช้งาน');
});
els.btnSpeak.addEventListener('click', () => runSpeak().catch(e => log(e.message)));

document.getElementById('btnBG').addEventListener('click', async () => {
  const topic = els.topic.value.trim();
  log('สุ่ม/ค้นหาพื้นหลังใหม่...');
  state.backgrounds = await searchBackgrounds(topic);
  const mediaCredits = state.backgrounds.map(b => `${b.source}: ${b.title} (${b.license})`).slice(0, 10);
  els.credits.innerHTML = [...state.credits, ...mediaCredits].map(c => `• ${c}`).join('<br/>');
  if (state.renderer && state.shotlist) {
    await state.renderer.loadBackgrounds(state.shotlist.backgrounds);
    state.renderer.play(state.shotlist);
  }
});

els.btnRecord.addEventListener('click', async () => {
  const duration = parseInt(els.duration.value, 10) || 45;
  const { recorder, urlPromise } = startRecording({ canvas: els.stage, durationMs: duration * 1000 });
  els.btnRecord.disabled = true; els.btnStop.disabled = false;
  log('เริ่มอัดวิดีโอ...');
  const url = await urlPromise;
  els.dlWebm.href = url; els.dlWebm.textContent = 'ดาวน์โหลด WebM';
  log('อัดเสร็จแล้ว');
  await saveSession({ step: 'recorded', webmUrl: url, srt: state.srtText });
  // Build metadata JSON
  const meta = {
    topic: els.topic.value.trim(),
    durationSec: duration,
    news: state.news,
    backgrounds: state.backgrounds,
    script: state.script,
    shotlist: state.shotlist,
    credits: state.credits,
    generatedAt: new Date().toISOString(),
  };
  const metaUrl = URL.createObjectURL(new Blob([JSON.stringify(meta, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = metaUrl; a.download = 'metadata.json'; a.textContent = 'ดาวน์โหลด Metadata';
  a.style.display = 'inline-block'; a.style.marginLeft = '8px';
  els.dlWebm.insertAdjacentElement('afterend', a);
});

els.btnStop.addEventListener('click', () => {
  stopRecording();
  els.btnRecord.disabled = false; els.btnStop.disabled = true;
});

// Auto-load last session
loadLatest().then(last => { if (last?.topic) els.topic.value = last.topic; }).catch(()=>{});