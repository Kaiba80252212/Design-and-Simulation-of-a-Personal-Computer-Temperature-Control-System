/**
 * Web Audio API synthesizer for PC Hardware BIOS / Motherboard Thermal Alert beeps.
 * Synthesized dynamically so it requires no external audio file downloads.
 */

class AudioAlertManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private lastAlertTime: number = 0;
  private minAlertIntervalMs: number = 3000; // Beep every 3 seconds while temperature alert persists

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pc_thermal_sound_enabled');
      if (stored !== null) {
        this.soundEnabled = stored === 'true';
      }
    }
  }

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

  public setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('pc_thermal_sound_enabled', String(enabled));
    }
    // If enabling, resume context
    if (enabled) {
      this.getContext();
    }
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  /**
   * Play warning beep (Two high-pitched BIOS warning chirps)
   */
  public playWarningBeep(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Tone 1: 980 Hz
      this.synthesizeTone(ctx, 980, now, 0.12, 'sawtooth', 0.15);
      // Tone 2: 1320 Hz
      this.synthesizeTone(ctx, 1320, now + 0.16, 0.14, 'square', 0.12);
    } catch (e) {
      console.warn('Audio alert error:', e);
    }
  }

  /**
   * Play critical over-temperature alarm (Motherboard emergency thermal buzzer siren)
   */
  public playCriticalAlarm(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Urgent triple emergency buzzer
      this.synthesizeTone(ctx, 1200, now, 0.1, 'sawtooth', 0.22);
      this.synthesizeTone(ctx, 800, now + 0.12, 0.1, 'sawtooth', 0.22);
      this.synthesizeTone(ctx, 1400, now + 0.24, 0.18, 'square', 0.25);
    } catch (e) {
      console.warn('Audio alert error:', e);
    }
  }

  /**
   * Periodic check: only trigger sound every N seconds while over temperature
   */
  public triggerThermalAlert(level: 'warning' | 'critical', temp: number): void {
    if (!this.soundEnabled) return;
    const now = Date.now();
    if (now - this.lastAlertTime < this.minAlertIntervalMs) {
      return;
    }
    this.lastAlertTime = now;

    if (level === 'critical') {
      this.playCriticalAlarm();
    } else {
      this.playWarningBeep();
    }
  }

  /**
   * Quick confirmation test tone so user can verify audio works
   */
  public playTestSound(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      this.synthesizeTone(ctx, 880, now, 0.08, 'sine', 0.18);
      this.synthesizeTone(ctx, 1174, now + 0.1, 0.15, 'sine', 0.2);
    } catch (e) {
      console.warn('Audio test error:', e);
    }
  }

  private synthesizeTone(
    ctx: AudioContext,
    freq: number,
    startTime: number,
    duration: number,
    type: OscillatorType,
    maxGain: number
  ) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    // Fast attack, quick exponential decay
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(maxGain, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }
}

export const audioAlert = new AudioAlertManager();
