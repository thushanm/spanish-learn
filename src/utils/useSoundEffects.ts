// Zero-Latency Pure Web Audio API Sound Synthesizer Hook
// No external MP3 delays, 100% offline, procedural audio with streak pitch scaling

class WebAudioSynthesizer {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Tactile button click / pop sound
  public playClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.045);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  // Haptic trigger helper on the synthesizer
  public triggerHaptic(pattern: number | number[] = 25) {
    triggerHaptic(pattern);
  }

  // Word tile snap sound (wooden/plastic tactile snap)
  public playSnap() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(840, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.035);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  // Correct answer: rising harmonic chime whose pitch dynamically ascends with combo streak!
  public playCorrect(streak: number = 1) {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      // Dynamic musical root note scaling (Pentatonic scale based on streak)
      const pentatonicMultipliers = [1, 1.122, 1.259, 1.498, 1.681, 2, 2.244, 2.519];
      const multIndex = Math.min(streak - 1, pentatonicMultipliers.length - 1);
      const baseFreq = 523.25 * (pentatonicMultipliers[Math.max(0, multIndex)] || 1); // C5 base

      const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5]; // Major triad

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const now = ctx.currentTime + i * 0.065;
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
      });
    } catch (e) {}
  }

  // Gentle low-frequency thud for incorrect attempt (non-jarring)
  public playIncorrect() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(145, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.22);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.24);
    } catch (e) {}
  }

  // Royal Fanfare chord celebrating lesson or level completion
  public playFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const chord = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      chord.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        const now = ctx.currentTime + index * 0.08;
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.75);
      });
    } catch (e) {}
  }

  // Classic cartoon spring "boing" (sweep 200Hz to 620Hz)
  public playBoing() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.14);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.28);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch (e) {}
  }

  // Bubbly water drop / bubble pop sound (quick sweep 420Hz -> 940Hz)
  public playBubblePop() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(940, now + 0.035);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.042);
    } catch (e) {}
  }

  // Playful sliding cartoon whistle down (frequency sweep 480Hz down to 180Hz)
  public playCartoonWhistleDown() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.3);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.34);
    } catch (e) {}
  }

  // Comedic "wah-wah-wah-waaah" sad trombone synth (4 descending notes with vibrato)
  public playSadTrombone() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [
        { freq: 155.56, duration: 0.22, delay: 0 },
        { freq: 146.83, duration: 0.22, delay: 0.23 },
        { freq: 138.59, duration: 0.24, delay: 0.46 },
        { freq: 130.81, duration: 0.65, delay: 0.71, wobble: true }
      ];

      notes.forEach(({ freq, duration, delay, wobble }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime + delay;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        if (wobble) {
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(6, now);
          lfoGain.gain.setValueAtTime(4.5, now);
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          lfo.start(now);
          lfo.stop(now + duration);
        }

        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, now);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + duration + 0.05);
      });
    } catch (e) {}
  }
}

export const audioSynthesizer = new WebAudioSynthesizer();
export const soundEffects = audioSynthesizer;

export function triggerHaptic(pattern: number | number[] = 25) {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {}
  }
}

export function shoutCartoonCheer(soundEnabled: boolean = true) {
  if (!soundEnabled || typeof window === 'undefined') return;
  const CHEER_PHRASES = ['¡Yuju!', '¡Hurra!', '¡Increíble!', '¡Súper!', '¡Genial!', '¡Eso es!', '¡Fantástico!'];
  const phrase = CHEER_PHRASES[Math.floor(Math.random() * CHEER_PHRASES.length)];

  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.pitch = 1.5; // High pitch cartoon voice
      utterance.rate = 1.15; // Fast energetic tempo
      utterance.lang = 'es-ES';
      const voices = window.speechSynthesis.getVoices();
      const esVoice = voices.find(v => v.lang.startsWith('es'));
      if (esVoice) utterance.voice = esVoice;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  }
}

export function useCartoonAudio(soundEnabled: boolean = true) {
  return {
    playClick: () => {
      triggerHaptic(15);
      if (soundEnabled) audioSynthesizer.playClick();
    },
    playSnap: () => {
      triggerHaptic(18);
      if (soundEnabled) audioSynthesizer.playSnap();
    },
    playBubblePop: () => {
      triggerHaptic(16);
      if (soundEnabled) audioSynthesizer.playBubblePop();
    },
    playBoing: () => {
      triggerHaptic([20, 30]);
      if (soundEnabled) audioSynthesizer.playBoing();
    },
    playCartoonWhistleDown: () => {
      triggerHaptic([35, 45]);
      if (soundEnabled) audioSynthesizer.playCartoonWhistleDown();
    },
    playSadTrombone: () => {
      triggerHaptic([40, 50, 40, 70]);
      if (soundEnabled) audioSynthesizer.playSadTrombone();
    },
    shoutCartoonCheer: () => {
      triggerHaptic([20, 40, 30]);
      shoutCartoonCheer(soundEnabled);
    },
    playCorrect: (streak: number = 1) => {
      triggerHaptic([20, 40, 30]);
      if (soundEnabled) {
        audioSynthesizer.playCorrect(streak);
        shoutCartoonCheer(soundEnabled);
      }
    },
    playIncorrect: (isConsecutive: boolean = false) => {
      if (isConsecutive) {
        triggerHaptic([50, 60, 50, 80]);
        if (soundEnabled) audioSynthesizer.playSadTrombone();
      } else {
        triggerHaptic([35, 45]);
        if (soundEnabled) audioSynthesizer.playCartoonWhistleDown();
      }
    },
    playFanfare: () => {
      triggerHaptic([30, 40, 30, 60, 50]);
      if (soundEnabled) audioSynthesizer.playFanfare();
    }
  };
}

export function useSoundEffects(soundEnabled: boolean = true) {
  const cartoon = useCartoonAudio(soundEnabled);
  return {
    ...cartoon,
    playCorrect: (streak: number = 1) => {
      triggerHaptic([20, 40, 30]);
      if (soundEnabled) audioSynthesizer.playCorrect(streak);
    },
    playIncorrect: () => {
      triggerHaptic([40, 60]);
      if (soundEnabled) audioSynthesizer.playCartoonWhistleDown();
    }
  };
}
