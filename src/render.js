import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@8.2.5/+esm';
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';

function rmsFromAnalyser(analyser) {
  const buf = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteTimeDomainData(buf);
  let sum = 0;
  for (let i = 0; i < buf.length; i++) {
    const v = (buf[i] - 128) / 128;
    sum += v * v;
  }
  return Math.sqrt(sum / buf.length);
}

export class Renderer {
  constructor({ canvas, width, height, analyser }) {
    this.app = new PIXI.Application();
    this.width = width; this.height = height; this.analyser = analyser;
    this.canvas = canvas;
    // Attach to existing canvas
    this.app.init({ view: canvas, width, height, antialias: true, background: '#0a0f16' });
    this.stage = this.app.stage;
    this.layers = { bg: new PIXI.Container(), mascot: new PIXI.Container(), text: new PIXI.Container() };
    this.stage.addChild(this.layers.bg, this.layers.mascot, this.layers.text);

    this._setupMascot();
  }

  _setupMascot() {
    // Simple mascot: head circle + mouth rect animated by RMS
    const head = new PIXI.Graphics();
    head.circle(0, 0, 80).fill(0x143454).stroke({ width: 4, color: 0x2a6db8 });
    head.x = 1100; head.y = 580;

    const mouth = new PIXI.Graphics();
    mouth.roundRect(-24, -4, 48, 8, 4).fill(0xff4466);
    mouth.x = 1100; mouth.y = 615;

    const eyeL = new PIXI.Graphics(); eyeL.circle(-18, -12, 6).fill(0xffffff);
    const eyeR = new PIXI.Graphics(); eyeR.circle(18, -12, 6).fill(0xffffff);
    eyeL.x = 1100; eyeL.y = 560; eyeR.x = 1100; eyeR.y = 560;

    this.layers.mascot.addChild(head, mouth, eyeL, eyeR);
    this.mouth = mouth;

    // Blink animation
    const lids = new PIXI.Graphics(); lids.rect(-30, -20, 60, 10).fill(0x0a0f16);
    lids.x = 1100; lids.y = 560; lids.alpha = 0;
    this.layers.mascot.addChild(lids);

    const blink = () => {
      gsap.to(lids, { alpha: 1, duration: 0.06, yoyo: true, repeat: 1, onComplete: () => setTimeout(blink, 1200 + Math.random()*1500) });
    };
    setTimeout(blink, 800);

    // Lip sync via analyser
    this.app.ticker.add(() => {
      if (!this.analyser) return;
      const v = rmsFromAnalyser(this.analyser);
      const h = PIXI.utils.mapLinear(v, 0.01, 0.2, 8, 42);
      this.mouth.scale.y = Math.max(0.6, Math.min(2.4, h / 10));
    });
  }

  async loadBackgrounds(bgList) {
    this.backgrounds = await Promise.all(bgList.map(async (b, i) => {
      if (!b?.url) return { sprite: null, meta: b };
      const tex = await PIXI.Assets.load(b.url).catch(()=>null);
      if (!tex) return { sprite: null, meta: b };
      const sp = new PIXI.Sprite(tex);
      sp.anchor.set(0.5);
      sp.x = this.width/2; sp.y = this.height/2;
      const scale = Math.max(this.width / sp.width, this.height / sp.height);
      sp.scale.set(scale * 1.05);
      sp.alpha = 0; // will fade in per shot
      this.layers.bg.addChild(sp);
      return { sprite: sp, meta: b };
    }));
  }

  play(shotlist) {
    this.clearTextLayer();
    // Timeline using GSAP
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    shotlist.shots.forEach((shot, idx) => {
      const bg = this.backgrounds[idx];
      if (bg?.sprite) {
        tl.addLabel(`shot${idx}`, shot.t);
        tl.to(bg.sprite, { alpha: 1, duration: 0.5 }, shot.t);
        // Ken Burns
        tl.fromTo(bg.sprite.scale, { x: bg.sprite.scale.x*1.05, y: bg.sprite.scale.y*1.05 }, { x: bg.sprite.scale.x, y: bg.sprite.scale.y, duration: shot.d, ease: 'none' }, shot.t);
      }
      // Text layer for this shot
      const text = this.makeKineticText(shot.text);
      text.alpha = 0; text.x = this.width * 0.08; text.y = this.height * 0.14;
      tl.to(text, { alpha: 1, duration: 0.2 }, shot.t + 0.05);
      // Effects
      if (shot.fx.includes('typewriter')) this.typewriter(text, shot);
      if (shot.fx.includes('slideIn')) tl.from(text, { x: -100, duration: 0.6 }, shot.t);
      if (shot.fx.includes('popIn')) tl.from(text.scale, { x: 0.6, y: 0.6, duration: 0.5 }, shot.t + 0.1);
      if (shot.fx.includes('highlightGlow')) this.glow(text, tl, shot);
      // Clean up at end
      tl.to(text, { alpha: 0, duration: 0.2 }, shot.t + shot.d - 0.2);
      tl.call(() => { this.layers.text.removeChild(text); text.destroy(true); }, null, shot.t + shot.d);
    });
    this.timeline = tl;
  }

  clearTextLayer() {
    this.layers.text.removeChildren();
  }

  makeKineticText(content) {
    const style = new PIXI.TextStyle({
      fontFamily: 'Inter, Noto Sans Thai, system-ui',
      fontSize: 44,
      fill: 0xffffff,
      wordWrap: true,
      wordWrapWidth: this.width * 0.8,
      lineHeight: 56,
      dropShadow: true,
      dropShadowDistance: 2,
      dropShadowColor: '#0b223f',
    });
    const text = new PIXI.Text({ text: content, style });
    this.layers.text.addChild(text);
    return text;
  }

  typewriter(text, shot) {
    const full = text.text;
    text.text = '';
    const chars = Array.from(full);
    let i = 0;
    const perChar = Math.max(0.012, (shot.d - 0.4) / Math.max(10, chars.length));
    const interval = this.app.ticker.add(() => {
      const dt = this.app.ticker.deltaMS / 1000;
      this._acc = (this._acc || 0) + dt;
      if (this._acc >= perChar) {
        this._acc = 0; text.text += chars[i++];
        if (i >= chars.length) this.app.ticker.remove(interval);
      }
    });
  }

  glow(text, tl, shot) {
    const f = { v: 0 };
    tl.to(f, { v: 1, duration: 0.8, yoyo: true, repeat: 1, onUpdate: () => {
      text.style.fill = f.v > 0.5 ? 0xa7d1ff : 0xffffff;
    } }, shot.t + 0.2);
  }

  destroy() {
    this.timeline?.kill();
    this.app.destroy(true, { children: true, texture: true, baseTexture: true });
  }
}