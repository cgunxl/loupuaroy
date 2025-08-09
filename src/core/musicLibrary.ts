// Professional Music Library System
// ระบบคลังเพลงและ sound effects ระดับมืออาชีพ

export interface MusicTrack {
  id: string
  name: string
  category: 'upbeat' | 'dramatic' | 'chill' | 'energetic' | 'emotional' | 'funny'
  mood: string[]
  bpm: number
  duration: number
  url: string
  preview?: string
  tags: string[]
}

export interface SoundEffect {
  id: string
  name: string
  category: 'transition' | 'impact' | 'whoosh' | 'notification' | 'ui' | 'ambient'
  duration: number
  url: string
  tags: string[]
}

// Get base URL for GitHub Pages
const BASE_URL = (import.meta as any).env?.BASE_URL || '/'

export class MusicLibrary {
  private audioContext: AudioContext
  private musicTracks: Map<string, MusicTrack> = new Map()
  private soundEffects: Map<string, SoundEffect> = new Map()
  private loadedBuffers: Map<string, AudioBuffer> = new Map()
  
  // Built-in music library
  private readonly MUSIC_LIBRARY: MusicTrack[] = [
    // Upbeat Tracks
    {
      id: 'upbeat-1',
      name: 'Happy Vibes',
      category: 'upbeat',
      mood: ['happy', 'positive', 'energetic'],
      bpm: 128,
      duration: 30,
      url: `${BASE_URL}assets/music/happy-vibes.mp3`,
      tags: ['tiktok', 'viral', 'dance']
    },
    {
      id: 'upbeat-2',
      name: 'Summer Party',
      category: 'upbeat',
      mood: ['fun', 'party', 'summer'],
      bpm: 130,
      duration: 30,
      url: `${BASE_URL}assets/music/summer-party.mp3`,
      tags: ['beach', 'vacation', 'youth']
    },
    
    // Dramatic Tracks
    {
      id: 'dramatic-1',
      name: 'Epic Reveal',
      category: 'dramatic',
      mood: ['intense', 'suspense', 'powerful'],
      bpm: 100,
      duration: 30,
      url: `${BASE_URL}assets/music/epic-reveal.mp3`,
      tags: ['cinematic', 'trailer', 'news']
    },
    {
      id: 'dramatic-2',
      name: 'Breaking News',
      category: 'dramatic',
      mood: ['urgent', 'serious', 'important'],
      bpm: 110,
      duration: 30,
      url: `${BASE_URL}assets/music/breaking-news.mp3`,
      tags: ['news', 'announcement', 'alert']
    },
    
    // Chill Tracks
    {
      id: 'chill-1',
      name: 'Lo-Fi Study',
      category: 'chill',
      mood: ['relaxed', 'calm', 'peaceful'],
      bpm: 85,
      duration: 30,
      url: `${BASE_URL}assets/music/lofi-study.mp3`,
      tags: ['study', 'relax', 'background']
    },
    {
      id: 'chill-2',
      name: 'Sunset Vibes',
      category: 'chill',
      mood: ['mellow', 'warm', 'nostalgic'],
      bpm: 90,
      duration: 30,
      url: `${BASE_URL}assets/music/sunset-vibes.mp3`,
      tags: ['evening', 'romantic', 'soft']
    },
    
    // Energetic Tracks
    {
      id: 'energetic-1',
      name: 'Pump It Up',
      category: 'energetic',
      mood: ['powerful', 'motivating', 'intense'],
      bpm: 140,
      duration: 30,
      url: `${BASE_URL}assets/music/pump-it-up.mp3`,
      tags: ['workout', 'sports', 'action']
    },
    {
      id: 'energetic-2',
      name: 'Electric Rush',
      category: 'energetic',
      mood: ['fast', 'exciting', 'dynamic'],
      bpm: 145,
      duration: 30,
      url: `${BASE_URL}assets/music/electric-rush.mp3`,
      tags: ['edm', 'dance', 'club']
    }
  ]
  
  // Built-in sound effects
  private readonly SOUND_EFFECTS: SoundEffect[] = [
    // Transitions
    {
      id: 'whoosh-1',
      name: 'Fast Whoosh',
      category: 'whoosh',
      duration: 0.5,
      url: `${BASE_URL}assets/sfx/whoosh-fast.mp3`,
      tags: ['transition', 'movement', 'quick']
    },
    {
      id: 'whoosh-2',
      name: 'Slow Whoosh',
      category: 'whoosh',
      duration: 1,
      url: `${BASE_URL}assets/sfx/whoosh-slow.mp3`,
      tags: ['transition', 'smooth', 'elegant']
    },
    
    // Impacts
    {
      id: 'impact-1',
      name: 'Deep Impact',
      category: 'impact',
      duration: 0.8,
      url: `${BASE_URL}assets/sfx/impact-deep.mp3`,
      tags: ['hit', 'powerful', 'bass']
    },
    {
      id: 'impact-2',
      name: 'Punch Hit',
      category: 'impact',
      duration: 0.3,
      url: `${BASE_URL}assets/sfx/punch-hit.mp3`,
      tags: ['hit', 'sharp', 'quick']
    },
    
    // Notifications
    {
      id: 'notif-1',
      name: 'Success Ding',
      category: 'notification',
      duration: 0.5,
      url: `${BASE_URL}assets/sfx/success-ding.mp3`,
      tags: ['success', 'positive', 'achievement']
    },
    {
      id: 'notif-2',
      name: 'Error Buzz',
      category: 'notification',
      duration: 0.4,
      url: `${BASE_URL}assets/sfx/error-buzz.mp3`,
      tags: ['error', 'warning', 'alert']
    },
    
    // UI Sounds
    {
      id: 'ui-1',
      name: 'Button Click',
      category: 'ui',
      duration: 0.1,
      url: `${BASE_URL}assets/sfx/button-click.mp3`,
      tags: ['click', 'interface', 'button']
    },
    {
      id: 'ui-2',
      name: 'Type Sound',
      category: 'ui',
      duration: 0.05,
      url: `${BASE_URL}assets/sfx/type-sound.mp3`,
      tags: ['type', 'keyboard', 'text']
    }
  ]

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    this.initializeLibrary()
  }

  // Initialize music and sound libraries
  private initializeLibrary() {
    // Load music tracks
    this.MUSIC_LIBRARY.forEach(track => {
      this.musicTracks.set(track.id, track)
    })
    
    // Load sound effects
    this.SOUND_EFFECTS.forEach(sfx => {
      this.soundEffects.set(sfx.id, sfx)
    })
  }

  // Get music by category and mood
  getMusicByMood(category?: string, mood?: string): MusicTrack[] {
    let tracks = Array.from(this.musicTracks.values())
    
    if (category) {
      tracks = tracks.filter(track => track.category === category)
    }
    
    if (mood) {
      tracks = tracks.filter(track => track.mood.includes(mood))
    }
    
    return tracks
  }

  // Get sound effects by category
  getSoundEffectsByCategory(category: string): SoundEffect[] {
    return Array.from(this.soundEffects.values())
      .filter(sfx => sfx.category === category)
  }

  // Search music by tags
  searchMusic(query: string): MusicTrack[] {
    const lowerQuery = query.toLowerCase()
    return Array.from(this.musicTracks.values())
      .filter(track => 
        track.name.toLowerCase().includes(lowerQuery) ||
        track.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        track.mood.some(m => m.toLowerCase().includes(lowerQuery))
      )
  }

  // Load audio file
  async loadAudio(url: string): Promise<AudioBuffer> {
    // Check cache
    if (this.loadedBuffers.has(url)) {
      return this.loadedBuffers.get(url)!
    }
    
    try {
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      
      // Cache the buffer
      this.loadedBuffers.set(url, audioBuffer)
      
      return audioBuffer
    } catch (error) {
      console.error('Failed to load audio:', url, error)
      // Return silent buffer as fallback for demo
      const sampleRate = this.audioContext.sampleRate
      const buffer = this.audioContext.createBuffer(2, sampleRate * 2, sampleRate)
      return buffer
    }
  }

  // Play music track
  async playMusic(
    trackId: string, 
    options: {
      volume?: number
      loop?: boolean
      fadeIn?: number
      fadeOut?: number
    } = {}
  ): Promise<AudioBufferSourceNode> {
    const track = this.musicTracks.get(trackId)
    if (!track) {
      throw new Error(`Music track not found: ${trackId}`)
    }
    
    const buffer = await this.loadAudio(track.url)
    const source = this.audioContext.createBufferSource()
    source.buffer = buffer
    source.loop = options.loop || false
    
    // Create gain node for volume control
    const gainNode = this.audioContext.createGain()
    gainNode.gain.value = options.volume || 0.7
    
    // Apply fade in
    if (options.fadeIn) {
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(
        options.volume || 0.7, 
        this.audioContext.currentTime + options.fadeIn
      )
    }
    
    // Connect nodes
    source.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    // Start playback
    source.start(0)
    
    // Apply fade out
    if (options.fadeOut && !options.loop) {
      const fadeOutTime = track.duration - options.fadeOut
      gainNode.gain.setValueAtTime(
        options.volume || 0.7, 
        this.audioContext.currentTime + fadeOutTime
      )
      gainNode.gain.linearRampToValueAtTime(
        0, 
        this.audioContext.currentTime + track.duration
      )
    }
    
    return source
  }

  // Play sound effect
  async playSoundEffect(
    effectId: string,
    options: {
      volume?: number
      pitch?: number
      delay?: number
    } = {}
  ): Promise<void> {
    const effect = this.soundEffects.get(effectId)
    if (!effect) {
      throw new Error(`Sound effect not found: ${effectId}`)
    }
    
    const buffer = await this.loadAudio(effect.url)
    const source = this.audioContext.createBufferSource()
    source.buffer = buffer
    
    // Apply pitch shift if needed
    if (options.pitch) {
      source.playbackRate.value = options.pitch
    }
    
    // Create gain node
    const gainNode = this.audioContext.createGain()
    gainNode.gain.value = options.volume || 1
    
    // Connect nodes
    source.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    // Start playback with delay
    const startTime = this.audioContext.currentTime + (options.delay || 0)
    source.start(startTime)
  }

  // Create custom mix
  async createMix(
    tracks: Array<{
      trackId: string
      startTime: number
      volume: number
      duration?: number
    }>
  ): Promise<AudioBuffer> {
    // Calculate total duration
    const totalDuration = Math.max(
      ...tracks.map(t => t.startTime + (t.duration || 30))
    )
    
    // Create offline context for rendering
    const offlineContext = new OfflineAudioContext(
      2, // stereo
      totalDuration * this.audioContext.sampleRate,
      this.audioContext.sampleRate
    )
    
    // Add each track
    for (const trackInfo of tracks) {
      const track = this.musicTracks.get(trackInfo.trackId)
      if (!track) continue
      
      const buffer = await this.loadAudio(track.url)
      const source = offlineContext.createBufferSource()
      source.buffer = buffer
      
      const gainNode = offlineContext.createGain()
      gainNode.gain.value = trackInfo.volume
      
      source.connect(gainNode)
      gainNode.connect(offlineContext.destination)
      
      source.start(trackInfo.startTime)
      
      if (trackInfo.duration && trackInfo.duration < track.duration) {
        source.stop(trackInfo.startTime + trackInfo.duration)
      }
    }
    
    // Render the mix
    return offlineContext.startRendering()
  }

  // Get recommended music for content
  getRecommendedMusic(contentStyle: string, mood?: string): MusicTrack[] {
    const recommendations: MusicTrack[] = []
    
    switch (contentStyle) {
      case 'finance':
        recommendations.push(
          ...this.getMusicByMood('dramatic', 'serious'),
          ...this.getMusicByMood('energetic', 'motivating')
        )
        break
        
      case 'crypto':
        recommendations.push(
          ...this.getMusicByMood('energetic', 'exciting'),
          ...this.getMusicByMood('dramatic', 'intense')
        )
        break
        
      case 'news':
        recommendations.push(
          ...this.getMusicByMood('dramatic', 'urgent'),
          ...this.getMusicByMood('dramatic', 'serious')
        )
        break
        
      case 'educational':
        recommendations.push(
          ...this.getMusicByMood('chill', 'calm'),
          ...this.getMusicByMood('upbeat', 'positive')
        )
        break
        
      default:
        recommendations.push(...this.getMusicByMood('upbeat'))
    }
    
    // Remove duplicates
    const uniqueTracks = Array.from(
      new Map(recommendations.map(track => [track.id, track])).values()
    )
    
    return uniqueTracks.slice(0, 5) // Return top 5 recommendations
  }

  // Analyze audio for beat detection
  async analyzeAudio(buffer: AudioBuffer): Promise<{
    bpm: number
    beats: number[]
    energy: number[]
  }> {
    // Simple beat detection algorithm
    const channelData = buffer.getChannelData(0)
    const sampleRate = buffer.sampleRate
    const windowSize = 2048
    const hopSize = 512
    
    const energy: number[] = []
    const beats: number[] = []
    
    // Calculate energy for each window
    for (let i = 0; i < channelData.length - windowSize; i += hopSize) {
      let sum = 0
      for (let j = 0; j < windowSize; j++) {
        sum += Math.abs(channelData[i + j])
      }
      energy.push(sum / windowSize)
    }
    
    // Simple peak detection for beats
    const threshold = 1.5
    const avgEnergy = energy.reduce((a, b) => a + b, 0) / energy.length
    
    for (let i = 1; i < energy.length - 1; i++) {
      if (energy[i] > avgEnergy * threshold &&
          energy[i] > energy[i - 1] &&
          energy[i] > energy[i + 1]) {
        beats.push((i * hopSize) / sampleRate)
      }
    }
    
    // Estimate BPM
    const beatIntervals: number[] = []
    for (let i = 1; i < beats.length; i++) {
      beatIntervals.push(beats[i] - beats[i - 1])
    }
    
    const avgInterval = beatIntervals.reduce((a, b) => a + b, 0) / beatIntervals.length
    const bpm = Math.round(60 / avgInterval)
    
    return { bpm, beats, energy }
  }

  // Sync video cuts to music beats
  async syncToBeats(
    musicTrackId: string,
    cuts: number[]
  ): Promise<number[]> {
    const track = this.musicTracks.get(musicTrackId)
    if (!track) return cuts
    
    const buffer = await this.loadAudio(track.url)
    const analysis = await this.analyzeAudio(buffer)
    
    // Snap cuts to nearest beats
    return cuts.map(cut => {
      const nearestBeat = analysis.beats.reduce((prev, curr) =>
        Math.abs(curr - cut) < Math.abs(prev - cut) ? curr : prev
      )
      return nearestBeat
    })
  }
}

// Export singleton instance
export const musicLibrary = new MusicLibrary()