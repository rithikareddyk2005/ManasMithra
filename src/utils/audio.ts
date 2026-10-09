// Pure Web Audio API generator for relaxing ambient sounds and gentle feedback tones
class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientSource: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying = false;
  private currentAmbientType: 'rain' | 'ocean' | 'zen' | 'whitenoise' | 'off' = 'off';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft meditative chime when completing an activity or check-in
  playChime(pitch: 'high' | 'medium' | 'low' = 'medium') {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freqs = {
        high: 528, // 528 Hz 'transformation / love' frequency
        medium: 432, // 432 Hz natural calming frequency
        low: 396,
      };

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqs[pitch], this.ctx.currentTime);

      // Gentle harmonic overtone
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freqs[pitch] * 1.5, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      gain2.gain.setValueAtTime(0, now);
      gain2.gain.linearRampToValueAtTime(0.04, now + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

      osc.connect(gain);
      osc2.connect(gain2);
      gain.connect(this.ctx.destination);
      gain2.connect(this.ctx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 1.9);
      osc2.stop(now + 1.6);
    } catch (e) {
      console.warn('Audio playback not allowed or failed:', e);
    }
  }

  // Realistic Tibetan Singing Bowl synthesis with fundamental and overtone harmonics
  playTibetanBowl(baseFreq = 432) {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const harmonics = [
        { ratio: 1.0, gain: 0.22, decay: 4.5 },
        { ratio: 2.76, gain: 0.12, decay: 3.8 },
        { ratio: 5.4, gain: 0.06, decay: 2.9 },
        { ratio: 8.1, gain: 0.03, decay: 2.0 },
      ];

      harmonics.forEach(({ ratio, gain, decay }) => {
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * ratio, now);

        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(gain, now + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(g);
        g.connect(this.ctx!.destination);

        osc.start(now);
        osc.stop(now + decay + 0.1);
      });
    } catch (e) {
      console.warn('Singing bowl failed:', e);
    }
  }

  // Gentle water droplet sound for Worry Pond
  playWaterDrop() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {
      console.warn('Water drop sound failed:', e);
    }
  }

  // Toggle ambient background white noise / rainfall / ocean / zen tone
  toggleAmbient(type: 'rain' | 'ocean' | 'zen' | 'whitenoise', volume = 0.15) {
    try {
      this.initContext();
      if (!this.ctx) return false;

      if (this.isAmbientPlaying && this.currentAmbientType === type) {
        this.stopAmbient();
        return false;
      }

      this.stopAmbient();
      this.currentAmbientType = type;
      this.isAmbientPlaying = true;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.connect(this.ctx.destination);
      this.ambientGain = gain;

      if (type === 'zen') {
        // Binaural / resonant 432Hz ambient chord
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(216, this.ctx.currentTime); // A3
        osc2.frequency.setValueAtTime(432, this.ctx.currentTime); // A4

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, this.ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);

        osc1.start();
        osc2.start();
        this.ambientSource = filter;
      } else {
        // Noise buffer for rain, ocean, or soft soothing white/pink noise
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === 'whitenoise') {
            // Soothing Pink/Brown filtered noise to prevent harsh treble
            lastOut = (lastOut + 0.02 * white) / 1.02;
            output[i] = lastOut * 3.5;
          } else {
            output[i] = white;
          }
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = buffer;
        whiteNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        if (type === 'rain') {
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
        } else if (type === 'whitenoise') {
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(700, this.ctx.currentTime);
        } else {
          // Ocean: modulated filter
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(400, this.ctx.currentTime);
          filter.Q.setValueAtTime(1.5, this.ctx.currentTime);
        }

        whiteNoise.connect(filter);
        filter.connect(gain);
        whiteNoise.start();
        this.ambientSource = whiteNoise;
      }

      return true;
    } catch (e) {
      console.warn('Ambient start failed:', e);
      return false;
    }
  }

  stopAmbient() {
    try {
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      }
      setTimeout(() => {
        if (this.ambientSource) {
          try {
            (this.ambientSource as any).stop?.();
            this.ambientSource.disconnect();
          } catch (_) {}
          this.ambientSource = null;
        }
      }, 500);
      this.isAmbientPlaying = false;
      this.currentAmbientType = 'off';
    } catch (e) {
      console.warn('Stop ambient error:', e);
    }
  }

  getAmbientState() {
    return {
      isPlaying: this.isAmbientPlaying,
      type: this.currentAmbientType,
    };
  }

  // True stereo Binaural Beat neural entrainment generator
  private binauralLeft: OscillatorNode | null = null;
  private binauralRight: OscillatorNode | null = null;
  private binauralGain: GainNode | null = null;
  private isBinauralPlaying = false;

  startBinauralBeat(carrierFreq = 216, beatFreq = 10, volume = 0.14) {
    try {
      this.initContext();
      if (!this.ctx) return false;

      this.stopBinauralBeat();
      this.isBinauralPlaying = true;

      const merger = this.ctx.createChannelMerger(2);
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(volume, this.ctx.currentTime);
      this.binauralGain = masterGain;

      // Left ear: base carrier frequency (e.g. 216 Hz)
      const oscL = this.ctx.createOscillator();
      oscL.type = 'sine';
      oscL.frequency.setValueAtTime(carrierFreq, this.ctx.currentTime);

      // Right ear: base + beat frequency (e.g. 216 + 10 = 226 Hz for 10 Hz Alpha wave)
      const oscR = this.ctx.createOscillator();
      oscR.type = 'sine';
      oscR.frequency.setValueAtTime(carrierFreq + beatFreq, this.ctx.currentTime);

      oscL.connect(merger, 0, 0); // Connect to left channel
      oscR.connect(merger, 0, 1); // Connect to right channel

      merger.connect(masterGain);
      masterGain.connect(this.ctx.destination);

      const now = this.ctx.currentTime;
      oscL.start(now);
      oscR.start(now);

      this.binauralLeft = oscL;
      this.binauralRight = oscR;
      return true;
    } catch (e) {
      console.warn('Binaural beat start failed:', e);
      return false;
    }
  }

  stopBinauralBeat() {
    try {
      if (this.binauralGain && this.ctx) {
        this.binauralGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
      }
      setTimeout(() => {
        try {
          this.binauralLeft?.stop();
          this.binauralRight?.stop();
          this.binauralLeft?.disconnect();
          this.binauralRight?.disconnect();
        } catch (_) {}
        this.binauralLeft = null;
        this.binauralRight = null;
      }, 350);
      this.isBinauralPlaying = false;
    } catch (e) {
      console.warn('Stop binaural error:', e);
    }
  }

  isBinauralActive() {
    return this.isBinauralPlaying;
  }
}

export const soundEngine = new SoundEngine();
