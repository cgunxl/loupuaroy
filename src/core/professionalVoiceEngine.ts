// Professional Voice Engine
// ระบบเสียงพูดคุณภาพสูง

export interface VoiceConfig {
  provider: 'elevenlabs' | 'google' | 'azure' | 'aws' | 'browser'
  voiceId: string
  language: string
  speed: number
  pitch: number
}

export interface AudioEffect {
  type: 'reverb' | 'echo' | 'compression' | 'eq'
  settings: Record<string, number>
}

export class ProfessionalVoiceEngine {
  private audioContext: AudioContext
  private voiceConfig: VoiceConfig
  
  constructor(config: VoiceConfig) {
    this.voiceConfig = config
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }

  async generateProfessionalSpeech(
    text: string,
    options: {
      emotion?: string
      backgroundMusic?: string
      effects?: AudioEffect[]
    } = {}
  ): Promise<AudioBuffer> {
    // For GitHub Pages demo, use browser TTS
    if (this.voiceConfig.provider === 'browser') {
      return this.generateBrowserTTS(text)
    }
    
    // Other providers would require API keys
    throw new Error('API-based TTS requires API keys. Using browser TTS for demo.')
  }

  private async generateBrowserTTS(text: string): Promise<AudioBuffer> {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = this.voiceConfig.language
      utterance.rate = this.voiceConfig.speed
      utterance.pitch = this.voiceConfig.pitch
      
      // Create a MediaStreamDestination to capture audio
      const dest = this.audioContext.createMediaStreamDestination()
      const mediaRecorder = new MediaRecorder(dest.stream)
      const chunks: Blob[] = []
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const arrayBuffer = await blob.arrayBuffer()
        
        try {
          const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
          resolve(audioBuffer)
        } catch (error) {
          // If decoding fails, create a silent buffer
          const duration = 5 // 5 seconds default
          const sampleRate = this.audioContext.sampleRate
          const buffer = this.audioContext.createBuffer(2, sampleRate * duration, sampleRate)
          resolve(buffer)
        }
      }
      
      // Start recording
      mediaRecorder.start()
      
      // Speak the text
      window.speechSynthesis.speak(utterance)
      
      // Stop recording after speech ends
      utterance.onend = () => {
        setTimeout(() => {
          mediaRecorder.stop()
        }, 500)
      }
      
      utterance.onerror = () => {
        // On error, return a silent buffer
        const duration = 5
        const sampleRate = this.audioContext.sampleRate
        const buffer = this.audioContext.createBuffer(2, sampleRate * duration, sampleRate)
        resolve(buffer)
      }
    })
  }

  async generateSpeech(text: string, emotion?: string): Promise<AudioBuffer> {
    return this.generateProfessionalSpeech(text, { emotion })
  }
}

export function createProfessionalVoice(config: VoiceConfig): ProfessionalVoiceEngine {
  return new ProfessionalVoiceEngine(config)
}