import type { EnvKind } from "./world";

/*
  The sound of the walk. Every sound here is made in the browser from noise
  and plain tones at the moment it is heard: nothing is downloaded, recorded
  or taken from anybody else. It is quiet, it starts only after the reader
  has touched the page, and it stops while the page is hidden.
*/

type Who = "keeper" | "figure" | "voice";

const BED: Record<EnvKind, { type: BiquadFilterType; freq: number; q: number; gain: number; sway: number }> = {
  garden: { type: "lowpass", freq: 620, q: 0.4, gain: 0.05, sway: 0.5 },
  wood: { type: "bandpass", freq: 1500, q: 0.5, gain: 0.06, sway: 0.8 },
  fire: { type: "lowpass", freq: 320, q: 0.6, gain: 0.07, sway: 0.25 },
  water: { type: "bandpass", freq: 900, q: 0.7, gain: 0.06, sway: 0.9 },
  earth: { type: "lowpass", freq: 240, q: 0.5, gain: 0.035, sway: 0.2 },
  metal: { type: "lowpass", freq: 180, q: 0.8, gain: 0.03, sway: 0.1 },
};

const FOOT: Record<EnvKind, { freq: number; q: number; gain: number; len: number }> = {
  garden: { freq: 1900, q: 0.8, gain: 0.11, len: 0.09 },
  wood: { freq: 1100, q: 0.7, gain: 0.1, len: 0.11 },
  fire: { freq: 700, q: 1.4, gain: 0.1, len: 0.06 },
  water: { freq: 500, q: 1.0, gain: 0.1, len: 0.12 },
  earth: { freq: 300, q: 2.2, gain: 0.14, len: 0.07 },
  metal: { freq: 420, q: 1.2, gain: 0.07, len: 0.06 },
};

export class Sound {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private bed: { src: AudioBufferSourceNode; gain: GainNode; lfo: OscillatorNode; hum?: OscillatorNode } | null = null;
  private life = 0;
  private on = true;
  private env: EnvKind = "garden";
  private hour = 6;
  private foot = 0;
  private dead = false;
  private onVis = () => {
    if (!this.ctx) return;
    if (document.hidden) void this.ctx.suspend();
    else if (this.on) void this.ctx.resume();
  };

  constructor() {
    document.addEventListener("visibilitychange", this.onVis);
  }

  get enabled() { return this.on; }

  /** Called from a press or a key, which is the only time a browser lets sound begin. */
  wake() {
    if (this.dead || !this.on) return;
    if (!this.ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      try { this.ctx = new AC(); } catch { return; }
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.9;
      this.master.connect(this.ctx.destination);
      const n = this.ctx.sampleRate * 2;
      this.noise = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      this.startBed();
    } else if (this.ctx.state === "suspended" && !document.hidden) void this.ctx.resume();
  }

  setOn(on: boolean) {
    this.on = on;
    if (!on) { if (this.ctx) void this.ctx.suspend(); }
    else this.wake();
  }

  /** The air of a place at an hour. */
  place(env: EnvKind, hour: number) {
    this.env = env; this.hour = hour;
    if (this.ctx) this.startBed();
  }

  private startBed() {
    const ctx = this.ctx, out = this.master;
    if (!ctx || !out || !this.noise) return;
    const now = ctx.currentTime;
    if (this.bed) {
      const old = this.bed;
      old.gain.gain.cancelScheduledValues(now);
      old.gain.gain.setTargetAtTime(0, now, 0.4);
      old.src.stop(now + 2.5); old.lfo.stop(now + 2.5); old.hum?.stop(now + 2.5);
    }
    const b = BED[this.env];
    const src = ctx.createBufferSource();
    src.buffer = this.noise; src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = b.type; f.frequency.value = b.freq; f.Q.value = b.q;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.gain.setTargetAtTime(b.gain, now, 0.8);
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.11 + b.sway * 0.1;
    const depth = ctx.createGain();
    depth.gain.value = b.freq * 0.35 * b.sway;
    lfo.connect(depth); depth.connect(f.frequency);
    src.connect(f); f.connect(gain); gain.connect(out);
    src.start(); lfo.start();
    let hum: OscillatorNode | undefined;
    if (this.env === "metal" || this.env === "fire") {
      hum = ctx.createOscillator();
      hum.type = "sine"; hum.frequency.value = this.env === "metal" ? 120 : 62;
      const hg = ctx.createGain(); hg.gain.value = this.env === "metal" ? 0.012 : 0.02;
      hum.connect(hg); hg.connect(gain);
      hum.start();
    }
    this.bed = { src, gain, lfo, hum };
    window.clearTimeout(this.life);
    this.schedule();
  }

  /** Small living sounds on their own time: a bird by day, a cricket by night, a drip by the pond. */
  private schedule() {
    this.life = window.setTimeout(() => {
      if (this.dead) return;
      if (this.ctx && this.on && this.ctx.state === "running") {
        const day = this.hour >= 5 && this.hour < 19;
        if (this.env === "water" && Math.random() < 0.5) this.drip();
        else if (this.env === "metal" || this.env === "earth") { if (this.env === "earth" && Math.random() < 0.4) this.knock(); }
        else if (this.env === "fire") { if (!day || Math.random() < 0.3) this.tone(180 + Math.random() * 60, 0.5, 0.012, "sine"); }
        else if (day) this.bird();
        else this.cricket();
      }
      this.schedule();
    }, 2200 + Math.random() * 4200);
  }

  private tone(freq: number, len: number, vol: number, type: OscillatorType = "sine", at = 0, to?: number) {
    const ctx = this.ctx, out = this.master;
    if (!ctx || !out || !this.on) return;
    const t = ctx.currentTime + at;
    const o = ctx.createOscillator();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + len);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + Math.min(0.012, len / 4));
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g); g.connect(out);
    o.start(t); o.stop(t + len + 0.02);
  }

  private burst(freq: number, q: number, vol: number, len: number, type: BiquadFilterType = "bandpass", sweepTo?: number) {
    const ctx = this.ctx, out = this.master;
    if (!ctx || !out || !this.noise || !this.on) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + len);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + Math.min(0.01, len / 3));
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    src.connect(f); f.connect(g); g.connect(out);
    src.start(t, Math.random() * 1.5, len + 0.05);
  }

  private bird() {
    const base = 2300 + Math.random() * 1400;
    const n = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) this.tone(base * (1 + Math.random() * 0.12), 0.09, 0.022, "sine", i * 0.13, base * 1.25);
  }
  private cricket() {
    for (let i = 0; i < 4; i++) this.tone(4300, 0.035, 0.012, "triangle", i * 0.07);
  }
  private drip() { this.tone(900 + Math.random() * 500, 0.16, 0.03, "sine", 0, 420); }
  private knock() { this.burst(260, 3, 0.05, 0.08); }

  /** One footfall on the ground of this place. */
  step() {
    const f = FOOT[this.env];
    this.foot ^= 1;
    this.burst(f.freq * (this.foot ? 1 : 0.88), f.q, f.gain, f.len);
  }

  /** A letter of speech. The Keeper hums higher than the ones on the road. */
  blip(who: Who) {
    if (who === "voice") return;
    const f = who === "keeper" ? 620 : 340;
    this.tone(f * (0.94 + Math.random() * 0.12), 0.045, 0.018, who === "keeper" ? "sine" : "triangle");
  }

  /** The place has arrived. */
  chime() {
    [523.25, 659.25, 783.99].forEach((f, i) => this.tone(f, 1.1, 0.03, "sine", i * 0.14));
  }

  /** Through the moon gate. */
  gate() {
    this.burst(300, 0.7, 0.12, 1.1, "bandpass", 2600);
    this.tone(392, 1.2, 0.025, "sine", 0.1, 784);
  }

  /** An answer chosen. */
  choose() { this.tone(880, 0.12, 0.03, "sine"); this.tone(1318.5, 0.18, 0.02, "sine", 0.06); }

  dispose() {
    this.dead = true;
    window.clearTimeout(this.life);
    document.removeEventListener("visibilitychange", this.onVis);
    if (this.ctx) void this.ctx.close();
    this.ctx = null; this.master = null; this.bed = null;
  }
}
