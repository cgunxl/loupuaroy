export function estimateSNR(samples: Float32Array): number {
  // Placeholder: compute 20*log10(rms/sigma_noise) with naive noise floor
  let sum = 0
  let max = 0
  for (let i = 0; i < samples.length; i++) {
    const v = samples[i]
    sum += v * v
    if (Math.abs(v) > max) max = Math.abs(v)
  }
  const rms = Math.sqrt(sum / Math.max(1, samples.length))
  const noise = Math.max(1e-4, max * 0.05)
  return 20 * Math.log10(rms / noise)
}

export function summarizeFPS(samples: number[]): { avg: number } {
  const avg = samples.reduce((a, b) => a + b, 0) / Math.max(1, samples.length)
  return { avg }
}