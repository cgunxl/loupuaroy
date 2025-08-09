// Professional Voice Engine for TikTok Videos
// ระบบเสียงพูดคุณภาพสูงระดับมืออาชีพ

export interface VoiceConfig {
  provider: 'elevenlabs' | 'google' | 'azure' | 'aws'
  voiceId: string
  language: string
  speed: number
  pitch: number
  emotion?: 'neutral' | 'excited' | 'serious' | 'friendly'
}

export interface AudioEffect {
  type: 'reverb' | 'echo' | 'compression' | 'eq' | 'noise-reduction'
  settings: Record<string, number>
}

export class ProfessionalVoiceEngine {
  private audioContext: AudioContext
  private voiceConfig: VoiceConfig
  private apiKeys = {
    elevenlabs: (import.meta as any).env?.VITE_ELEVENLABS_API_KEY || '',
    google: (import.meta as any).env?.VITE_GOOGLE_TTS_API_KEY || '',
    azure: (import.meta as any).env?.VITE_AZURE_SPEECH_KEY || '',
    aws: (import.meta as any).env?.VITE_AWS_POLLY_KEY || ''
  }

  // เสียงพูดคุณภาพสูงสำหรับภาษาไทย
  private readonly THAI_VOICES = {
    elevenlabs: {
      male: {
        energetic: 'pNInz6obpgDQGcFmaJgB', // Adam
        professional: 'ErXwobaYiN019PkySvjV', // Antoni
        friendly: 'VR6AewLTigWG4xSOukaG' // Arnold
      },
      female: {
        energetic: 'EXAVITQu4vr4xnSDxMaL', // Bella
        professional: 'MF3mGyEYCl7XYWbV9V6O', // Elli
        friendly: 'jsCqWAovK2LkecY7zXl4' // Freya
      }
    },
    google: {
      male: {
        energetic: 'th-TH-Standard-A',
        professional: 'th-TH-Wavenet-C',
        friendly: 'th-TH-Neural2-C'
      },
      female: {
        energetic: 'th-TH-Standard-B',
        professional: 'th-TH-Wavenet-D',
        friendly: 'th-TH-Neural2-D'
      }
    }
  }

  constructor(config: VoiceConfig) {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    this.voiceConfig = config
  }

  // สร้างเสียงพูดคุณภาพสูง
  async generateSpeech(text: string, emotion?: string): Promise<AudioBuffer> {
    try {
      let audioData: ArrayBuffer

      switch (this.voiceConfig.provider) {
        case 'elevenlabs':
          audioData = await this.generateElevenLabsSpeech(text, emotion)
          break
        case 'google':
          audioData = await this.generateGoogleTTS(text, emotion)
          break
        case 'azure':
          audioData = await this.generateAzureSpeech(text, emotion)
          break
        case 'aws':
          audioData = await this.generateAWSPolly(text, emotion)
          break
        default:
          throw new Error('Unsupported voice provider')
      }

      // แปลงเป็น AudioBuffer
      const audioBuffer = await this.audioContext.decodeAudioData(audioData)
      
      // ปรับปรุงคุณภาพเสียง
      return this.enhanceAudioQuality(audioBuffer)
    } catch (error) {
      console.error('Speech generation error:', error)
      // Fallback to browser TTS
      return this.generateBrowserTTS(text)
    }
  }

  // ElevenLabs API (เสียงคุณภาพสูงที่สุด)
  private async generateElevenLabsSpeech(text: string, emotion?: string): Promise<ArrayBuffer> {
    const voiceId = this.selectVoiceByEmotion('elevenlabs', emotion)
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': this.apiKeys.elevenlabs,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.85,
          style: emotion === 'excited' ? 0.8 : 0.5,
          use_speaker_boost: true
        }
      })
    })

    if (!response.ok) {
      throw new Error('ElevenLabs API error')
    }

    return response.arrayBuffer()
  }

  // Google Cloud TTS
  private async generateGoogleTTS(text: string, emotion?: string): Promise<ArrayBuffer> {
    const voiceId = this.selectVoiceByEmotion('google', emotion)
    
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.apiKeys.google}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: 'th-TH',
            name: voiceId,
            ssmlGender: voiceId.includes('Standard-A') || voiceId.includes('Wavenet-C') ? 'MALE' : 'FEMALE'
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: this.voiceConfig.speed,
            pitch: this.voiceConfig.pitch,
            volumeGainDb: 0,
            effectsProfileId: ['headphone-class-device']
          }
        })
      }
    )

    const data = await response.json()
    return this.base64ToArrayBuffer(data.audioContent)
  }

  // Azure Speech Services
  private async generateAzureSpeech(text: string, emotion?: string): Promise<ArrayBuffer> {
    const ssml = this.createSSML(text, emotion)
    
    const response = await fetch(
      'https://southeastasia.tts.speech.microsoft.com/cognitiveservices/v1',
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.apiKeys.azure,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-48khz-192kbitrate-mono-mp3'
        },
        body: ssml
      }
    )

    return response.arrayBuffer()
  }

  // AWS Polly
  private async generateAWSPolly(text: string, emotion?: string): Promise<ArrayBuffer> {
    // Implementation for AWS Polly
    // ใช้ AWS SDK หรือ API endpoint
    throw new Error('AWS Polly implementation pending')
  }

  // สร้าง SSML สำหรับการควบคุมเสียงขั้นสูง
  private createSSML(text: string, emotion?: string): string {
    const emotionTag = emotion ? `<mstts:express-as style="${emotion}">` : ''
    const emotionCloseTag = emotion ? '</mstts:express-as>' : ''
    
    return `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" 
             xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="th-TH">
        <voice name="th-TH-PremwadeeNeural">
          ${emotionTag}
            <prosody rate="${this.voiceConfig.speed}" pitch="${this.voiceConfig.pitch}">
              ${this.processTextForSSML(text)}
            </prosody>
          ${emotionCloseTag}
        </voice>
      </speak>
    `
  }

  // ประมวลผลข้อความสำหรับ SSML
  private processTextForSSML(text: string): string {
    return text
      // เพิ่ม emphasis สำหรับคำสำคัญ
      .replace(/(\d+%)/g, '<emphasis level="strong">$1</emphasis>')
      .replace(/(Bitcoin|Ethereum|หุ้น|ทอง)/g, '<emphasis level="moderate">$1</emphasis>')
      // เพิ่ม pause
      .replace(/!/g, '!<break time="500ms"/>')
      .replace(/\?/g, '?<break time="500ms"/>')
      .replace(/\.\.\./g, '<break time="1s"/>')
      // เพิ่ม prosody สำหรับตัวเลข
      .replace(/(\d+,?\d*)/g, '<say-as interpret-as="number">$1</say-as>')
  }

  // ปรับปรุงคุณภาพเสียง
  private async enhanceAudioQuality(audioBuffer: AudioBuffer): Promise<AudioBuffer> {
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    )

    const source = offlineContext.createBufferSource()
    source.buffer = audioBuffer

    // Compressor - ทำให้เสียงสม่ำเสมอ
    const compressor = offlineContext.createDynamicsCompressor()
    compressor.threshold.value = -24
    compressor.knee.value = 30
    compressor.ratio.value = 12
    compressor.attack.value = 0.003
    compressor.release.value = 0.25

    // EQ - ปรับความชัดของเสียง
    const eq = this.createEQ(offlineContext)

    // Limiter - ป้องกันเสียงแตก
    const limiter = offlineContext.createDynamicsCompressor()
    limiter.threshold.value = -0.5
    limiter.knee.value = 0
    limiter.ratio.value = 20
    limiter.attack.value = 0.001
    limiter.release.value = 0.01

    // Connect nodes
    source.connect(compressor)
    compressor.connect(eq.input)
    eq.output.connect(limiter)
    limiter.connect(offlineContext.destination)

    source.start(0)
    return offlineContext.startRendering()
  }

  // สร้าง EQ สำหรับปรับแต่งเสียง
  private createEQ(context: BaseAudioContext) {
    const frequencies = [80, 240, 750, 2200, 6000]
    const gains = [0, 2, 3, 2, 1] // เพิ่มความชัดในย่านกลาง

    const filters = frequencies.map((freq, i) => {
      const filter = context.createBiquadFilter()
      filter.type = i === 0 ? 'highshelf' : i === frequencies.length - 1 ? 'lowshelf' : 'peaking'
      filter.frequency.value = freq
      filter.gain.value = gains[i]
      filter.Q.value = 0.7
      return filter
    })

    // Connect filters in series
    for (let i = 0; i < filters.length - 1; i++) {
      filters[i].connect(filters[i + 1])
    }

    return {
      input: filters[0],
      output: filters[filters.length - 1]
    }
  }

  // เลือกเสียงตามอารมณ์
  private selectVoiceByEmotion(provider: string, emotion?: string): string {
    const voices = (this.THAI_VOICES as any)[provider]
    const gender = this.voiceConfig.voiceId.includes('female') ? 'female' : 'male'
    const style = emotion === 'excited' ? 'energetic' : 
                  emotion === 'serious' ? 'professional' : 'friendly'
    
    return voices[gender][style]
  }

  // Fallback: Browser TTS
  private async generateBrowserTTS(text: string): Promise<AudioBuffer> {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'th-TH'
      utterance.rate = this.voiceConfig.speed
      utterance.pitch = this.voiceConfig.pitch
      
      // Record the speech
      const dest = this.audioContext.createMediaStreamDestination()
      const recorder = new MediaRecorder(dest.stream)
      const chunks: Blob[] = []
      
      recorder.ondataavailable = e => chunks.push(e.data)
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const arrayBuffer = await blob.arrayBuffer()
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
        resolve(audioBuffer)
      }
      
      recorder.start()
      speechSynthesis.speak(utterance)
      
      utterance.onend = () => recorder.stop()
      utterance.onerror = () => reject(new Error('Browser TTS failed'))
    })
  }

  // Helper: Base64 to ArrayBuffer
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
  }

  // สร้างเสียงพูดพร้อม effects
  async generateProfessionalSpeech(
    text: string,
    options: {
      emotion?: string
      effects?: AudioEffect[]
      backgroundMusic?: string
      soundEffects?: { type: string; timing: number }[]
    } = {}
  ): Promise<AudioBuffer> {
    // สร้างเสียงพูดหลัก
    const speechBuffer = await this.generateSpeech(text, options.emotion)
    
    // ถ้าไม่มี effects เพิ่มเติม return เลย
    if (!options.effects && !options.backgroundMusic && !options.soundEffects) {
      return speechBuffer
    }
    
    // สร้าง offline context สำหรับ mixing
    const offlineContext = new OfflineAudioContext(
      2, // stereo
      speechBuffer.length,
      speechBuffer.sampleRate
    )
    
    // เพิ่มเสียงพูด
    const speechSource = offlineContext.createBufferSource()
    speechSource.buffer = speechBuffer
    
    // เพิ่ม effects
    let lastNode: AudioNode = speechSource
    if (options.effects) {
      for (const effect of options.effects) {
        lastNode = this.applyEffect(offlineContext, lastNode, effect)
      }
    }
    
    // Mix กับ background music
    if (options.backgroundMusic) {
      await this.mixWithBackgroundMusic(offlineContext, lastNode, options.backgroundMusic)
    } else {
      lastNode.connect(offlineContext.destination)
    }
    
    speechSource.start(0)
    return offlineContext.startRendering()
  }

  // Apply audio effect
  private applyEffect(context: BaseAudioContext, source: AudioNode, effect: AudioEffect): AudioNode {
    switch (effect.type) {
      case 'reverb':
        return this.createReverb(context, source, effect.settings)
      case 'echo':
        return this.createEcho(context, source, effect.settings)
      case 'compression':
        return this.createCompression(context, source, effect.settings)
      default:
        return source
    }
  }

  // สร้าง Reverb effect
  private createReverb(context: BaseAudioContext, source: AudioNode, settings: Record<string, number>): AudioNode {
    const convolver = context.createConvolver()
    const length = context.sampleRate * (settings.duration || 2)
    const impulse = context.createBuffer(2, length, context.sampleRate)
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, settings.decay || 2)
      }
    }
    
    convolver.buffer = impulse
    
    const wetGain = context.createGain()
    const dryGain = context.createGain()
    wetGain.gain.value = settings.wet || 0.3
    dryGain.gain.value = 1 - wetGain.gain.value
    
    const merger = context.createChannelMerger(2)
    
    source.connect(convolver).connect(wetGain).connect(merger)
    source.connect(dryGain).connect(merger)
    
    return merger
  }

  // สร้าง Echo effect
  private createEcho(context: BaseAudioContext, source: AudioNode, settings: Record<string, number>): AudioNode {
    const delay = context.createDelay(5)
    delay.delayTime.value = settings.delay || 0.5
    
    const feedback = context.createGain()
    feedback.gain.value = settings.feedback || 0.5
    
    const wetGain = context.createGain()
    wetGain.gain.value = settings.wet || 0.3
    
    const merger = context.createChannelMerger(2)
    
    source.connect(delay)
    delay.connect(feedback)
    feedback.connect(delay)
    delay.connect(wetGain).connect(merger)
    source.connect(merger)
    
    return merger
  }

  // สร้าง Compression
  private createCompression(context: BaseAudioContext, source: AudioNode, settings: Record<string, number>): AudioNode {
    const compressor = context.createDynamicsCompressor()
    compressor.threshold.value = settings.threshold || -24
    compressor.knee.value = settings.knee || 30
    compressor.ratio.value = settings.ratio || 12
    compressor.attack.value = settings.attack || 0.003
    compressor.release.value = settings.release || 0.25
    
    source.connect(compressor)
    return compressor
  }

  // Mix กับเพลงประกอบ
  private async mixWithBackgroundMusic(
    context: OfflineAudioContext, 
    voiceNode: AudioNode, 
    musicUrl: string
  ): Promise<void> {
    try {
      const response = await fetch(musicUrl)
      const arrayBuffer = await response.arrayBuffer()
      const musicBuffer = await context.decodeAudioData(arrayBuffer)
      
      const musicSource = context.createBufferSource()
      musicSource.buffer = musicBuffer
      musicSource.loop = true
      
      // ลดเสียงเพลงให้เหมาะสม
      const musicGain = context.createGain()
      musicGain.gain.value = 0.15
      
      // Sidechain compression (ducking)
      const compressor = context.createDynamicsCompressor()
      compressor.threshold.value = -50
      compressor.knee.value = 40
      compressor.ratio.value = 12
      compressor.attack.value = 0
      compressor.release.value = 0.25
      
      // Connect everything
      voiceNode.connect(context.destination)
      voiceNode.connect(compressor) // Voice controls compression
      
      musicSource.connect(musicGain)
      musicGain.connect(compressor)
      compressor.connect(context.destination)
      
      musicSource.start(0)
    } catch (error) {
      console.error('Failed to load background music:', error)
      voiceNode.connect(context.destination)
    }
  }
}

// Export factory function
export const createProfessionalVoice = (config: VoiceConfig) => {
  return new ProfessionalVoiceEngine(config)
}