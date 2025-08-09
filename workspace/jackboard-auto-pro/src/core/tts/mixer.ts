export function generateBeep(durationSec = 0.18, freq = 1000, sampleRate = 48000): Float32Array {
  const n = Math.floor(durationSec * sampleRate)
  const out = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    out[i] = Math.sin((2 * Math.PI * freq * i) / sampleRate) * 0.3
  }
  return out
}

export function normalizeLoudness(input: Float32Array, targetRms = 0.1): Float32Array {
  let sum = 0
  for (let i = 0; i < input.length; i++) sum += input[i] * input[i]
  const rms = Math.sqrt(sum / input.length) || 1e-6
  const gain = targetRms / rms
  const out = new Float32Array(input.length)
  for (let i = 0; i < input.length; i++) out[i] = input[i] * gain
  return out
}