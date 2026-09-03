/**
 * Ponjikkara Cuisine - Web Audio API Sound Synthesizer & Speech Engine
 */

class SadhyaAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.speechEnabled = true;
    this.synth = window.speechSynthesis || null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  toggleSpeech() {
    this.speechEnabled = !this.speechEnabled;
    return this.speechEnabled;
  }

  // Sloshing / Liquid Pouring Sound
  playPourSound(duration = 0.5) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(1200, this.ctx.currentTime + duration * 0.5);
    filter.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  // Pappadam Crunch / Crackle Sound
  playCrunchSound() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 5; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200 + Math.random() * 1500, now + i * 0.03);

      gain.gain.setValueAtTime(0.4, now + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.03);
      osc.stop(now + i * 0.03 + 0.05);
    }
  }

  // Funny Gaslighting Redirect Slide Whistle / Boing
  playRedirectSlideSound() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.35);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Disaster Fail Trombone
  playFailSound() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [220, 207, 196, 174];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + i * 0.15);

      gain.gain.setValueAtTime(0.3, now + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.18);
    });
  }

  // Grand Finale Chenda Melam Roll
  playChendaVictoryRoll() {
    if (this.muted) return;
    let count = 0;
    const interval = setInterval(() => {
      this.playChendaStroke(160 + Math.random() * 80, 0.12);
      count++;
      if (count > 12) clearInterval(interval);
    }, 80);
  }

  playChendaStroke(pitch = 180, decay = 0.2) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + decay);

    gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + decay);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + decay);
  }

  // Web Speech API Voice Readout
  speakText(text) {
    if (this.muted || !this.speechEnabled || !this.synth) return;
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.1;

    const voices = this.synth.getVoices();
    const mlVoice = voices.find(v => v.lang.includes('ml') || v.lang.includes('hi') || v.lang.includes('in') || v.lang.includes('IN'));
    if (mlVoice) utterance.voice = mlVoice;

    this.synth.speak(utterance);
  }
}

const sadhyaAudio = new SadhyaAudioEngine();
