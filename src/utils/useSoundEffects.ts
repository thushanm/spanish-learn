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

export function useSoundEffects(soundEnabled: boolean = true) {
  return {
    playClick: () => {
      triggerHaptic(15);
      if (soundEnabled) audioSynthesizer.playClick();
    },
    playSnap: () => {
      triggerHaptic(18);
      if (soundEnabled) audioSynthesizer.playSnap();
    },
    playCorrect: (streak: number = 1) => {
      triggerHaptic([20, 40, 30]);
      if (soundEnabled) audioSynthesizer.playCorrect(streak);
    },
    playIncorrect: () => {
      triggerHaptic([40, 60]);
      if (soundEnabled) audioSynthesizer.playIncorrect();
    },
    playFanfare: () => {
      triggerHaptic([30, 40, 30, 60, 50]);
      if (soundEnabled) audioSynthesizer.playFanfare();
    }
  };
}
