export type SpeakChunk = { text: string, start: number, end: number }

export class AudioEngine {
  ctx: AudioContext
  master: GainNode
  beepGain: GainNode
  musicGain: GainNode
  analyser: AnalyserNode
  merger: MediaStreamDestination

  constructor() {
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    this.master = this.ctx.createGain()
    this.beepGain = this.ctx.createGain()
    this.musicGain = this.ctx.createGain()
    this.analyser = this.ctx.createAnalyser()
    this.merger = this.ctx.createMediaStreamDestination()

    this.master.gain.value = 1.0
    this.beepGain.gain.value = 0.9
    this.musicGain.gain.value = 0.25
    this.analyser.fftSize = 256

    this.musicGain.connect(this.master)
    this.beepGain.connect(this.master)
    this.master.connect(this.analyser)
    this.analyser.connect(this.merger)
  }

  getStream() { return this.merger.stream }

  playBeep(t:number, dur=0.18, freq=1000) {
    const osc = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    osc.frequency.value = freq
    osc.connect(g); g.connect(this.beepGain)
    const when = this.ctx.currentTime + Math.max(0, t - this.currentTime())
    g.gain.setValueAtTime(0, when)
    g.gain.linearRampToValueAtTime(0.9, when+0.01)
    g.gain.exponentialRampToValueAtTime(0.001, when+dur)
    osc.start(when); osc.stop(when+dur+0.02)
  }

  currentTime(){ return this.ctx.currentTime }

  async speakChunks(chunks: SpeakChunk[], censorWords:string[]){
    const synth = window.speechSynthesis
    if (!synth) throw new Error('SpeechSynthesis not supported')
    let time = this.currentTime()
    for (const ch of chunks){
      let txt = ch.text
      for (const w of censorWords) {
        if (w && txt.toLowerCase().includes(w.toLowerCase())) {
          this.playBeep(time)
          txt = txt.replace(new RegExp(w, 'gi'), '***')
        }
      }
      const u = new SpeechSynthesisUtterance(txt)
      u.lang = 'th-TH'
      u.rate = 1.0
      u.pitch = 1.0
      const p = new Promise<void>(res=>{ u.onend = ()=> res() })
      synth.speak(u)
      const approx = Math.max(0.8, txt.length / 12) // ประมาณเวลา
      time += approx
      await p
    }
  }
}