export function rms(values: Float32Array): number {
  let sum = 0
  for (let i = 0; i < values.length; i++) sum += values[i] * values[i]
  return Math.sqrt(sum / values.length)
}

export function mouthOpenLevel(rmsValue: number): 0 | 1 | 2 {
  if (rmsValue < 0.03) return 0
  if (rmsValue < 0.1) return 1
  return 2
}