export async function recordCanvasWithAudio(canvas: HTMLCanvasElement, audioStream: MediaStream, seconds: number): Promise<Blob> {
  const stream = canvas.captureStream(30)
  const out = new MediaStream()
  stream.getVideoTracks().forEach(t => out.addTrack(t))
  audioStream.getAudioTracks().forEach(t => out.addTrack(t))

  const rec = new MediaRecorder(out, { mimeType: 'video/webm;codecs=vp9,opus' })
  const chunks: Blob[] = []
  rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data) }

  const done = new Promise<Blob>(res => { rec.onstop = () => res(new Blob(chunks, { type: 'video/webm' })) })
  rec.start()
  await new Promise(r=>setTimeout(r, seconds * 1000))
  rec.stop()
  return done
}