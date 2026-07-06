export class Synth {
  static ctx = new AudioContext();
  #gainNode?: GainNode;
  #analyser?: AnalyserNode;
  #dataArray?: Float32Array<ArrayBuffer>;

  constructor() {
    // can be used for visual waveform output; currently used to check if playing
    this.#analyser = Synth.ctx.createAnalyser();
    this.#analyser.connect(Synth.ctx.destination);
    this.#dataArray = new Float32Array(this.#analyser.frequencyBinCount);
    this.#analyser.getFloatTimeDomainData(this.#dataArray);

    // necessary to prevent distortion in Chrome
    const compressor = Synth.ctx.createDynamicsCompressor();
    compressor.connect(this.#analyser);

    // volume control
    this.#gainNode = Synth.ctx.createGain();
    this.#gainNode.connect(compressor);
    this.#gainNode.gain.value = 0.5;
  }

  #createOsc() {
    if (!this.#gainNode) throw new Error("Oscillator could not be created.");

    const osc = Synth.ctx?.createOscillator();
    osc.connect(this.#gainNode);

    return osc;
  }

  get volume() {
    return this.#gainNode?.gain.value ?? 0;
  }
  set volume(value: number) {
    if (!this.#gainNode)
      throw new Error("Synch failed to initialize; cannot set volume.");
    this.#gainNode.gain.value = Math.min(1, Math.max(0, value));
  }

  isPlaying() {
    if (Synth.ctx.state !== "running") return false;
    if (!this.#dataArray || !this.#analyser)
      throw new Error("Cannot find analyser");

    this.#analyser?.getFloatTimeDomainData(this.#dataArray);
    for (let i = 0; i < this.#analyser.frequencyBinCount; i++) {
      if (this.#dataArray[i] != 0) return true;
    }
    return false;
  }

  async playMelody(freqs: number[]) {
    if (this.isPlaying()) return;
    await Synth.ctx.resume();

    const osc = this.#createOsc();
    osc.start();
    for (const [i, freq] of freqs.entries()) {
      osc.frequency.setValueAtTime(freq, Synth.ctx.currentTime + i / 2.5);
      osc.stop(Synth.ctx.currentTime + (1 + i) / 2.5);
    }
  }

  async playHarmony(freqs: number[]) {
    if (this.isPlaying()) return;
    await Synth.ctx.resume();

    for (const freq of freqs) {
      const osc = this.#createOsc();

      osc.start();
      osc.frequency.setValueAtTime(freq, Synth.ctx.currentTime);
      osc.stop(Synth.ctx.currentTime + 1);
    }
  }
}
