export function computeRMS(analyser: AnalyserNode) {
  const arr = new Uint8Array(analyser.frequencyBinCount)
  analyser.getByteTimeDomainData(arr)
  let sum = 0
  for (let i=0;i<arr.length;i++){
    const v = (arr[i]-128)/128
    sum += v*v
  }
  return Math.sqrt(sum/arr.length)
}