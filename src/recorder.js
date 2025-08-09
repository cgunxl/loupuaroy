import { getAudioStream } from './tts.js';

let currentRecorder = null;
let recordedChunks = [];

export function startRecording({ canvas, durationMs }) {
  const stream = canvas.captureStream(60);
  const audioStream = getAudioStream();
  if (audioStream) {
    audioStream.getAudioTracks().forEach(t => stream.addTrack(t));
  }
  const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9,opus' });
  recordedChunks = [];
  recorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
  const urlPromise = new Promise(resolve => {
    recorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      resolve(URL.createObjectURL(blob));
    };
  });
  recorder.start();
  currentRecorder = recorder;
  if (durationMs && durationMs > 0) setTimeout(() => stopRecording(), durationMs + 100);
  return { recorder, urlPromise };
}

export function stopRecording() {
  if (currentRecorder && currentRecorder.state !== 'inactive') currentRecorder.stop();
}