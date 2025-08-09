export async function speakWithWebSpeech(text: string): Promise<Float32Array> {
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'th-TH'
    window.speechSynthesis.speak(utter)
  }
  // Return silent placeholder 24kHz mono 0.5s
  const sr = 24000
  const len = Math.max(1, Math.min(8, Math.ceil(text.length / 20))) * sr * 0.5
  return new Float32Array(len)
}