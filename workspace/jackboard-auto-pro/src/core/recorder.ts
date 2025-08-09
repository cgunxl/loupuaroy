export async function startRecording(canvas: HTMLCanvasElement): Promise<{ stop: () => Promise<Blob> }> {
  const stream = canvas.captureStream(30)
  // Add silent audio track to satisfy MediaRecorder
  const ctx = new AudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  gain.gain.value = 0
  osc.connect(gain).connect(ctx.destination)
  osc.start()
  const dest = ctx.createMediaStreamDestination()
  gain.disconnect()
  osc.disconnect()
  // Note: in real pipeline connect mixed audio to dest
  const mix = new MediaStream([...stream.getVideoTracks(), ...dest.stream.getAudioTracks()])
  const rec = new MediaRecorder(mix, { mimeType: 'video/webm;codecs=vp9,opus' })
  const chunks: BlobPart[] = []
  rec.ondataavailable = (e) => e.data && chunks.push(e.data)
  rec.start()
  return {
    stop: () =>
      new Promise<Blob>((resolve) => {
        rec.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }))
        rec.stop()
      }),
  }
}