import * as ort from 'onnxruntime-web'

export type VoiceId = 'th_female_01' | 'th_male_01' | 'en_female_01'

export async function synthKokoro(_text: string, _voice: VoiceId, _speed = 1.0): Promise<Float32Array | null> {
  try {
    const session = await ort.InferenceSession.create('/models/kokoro-th/model.onnx', {
      executionProviders: ['webgpu', 'wasm'],
    })
    // This is a placeholder; real pre/post-processing would go here
    await session.run({})
    // Return 0.5s silence @24kHz as a stub
    return new Float32Array(24000 * 0.5)
  } catch {
    return null
  }
}