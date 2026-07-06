export class Synth {
  static ctx = new AudioContext();
  #compressor?: DynamicsCompressorNode;
  #analyser?: AnalyserNode;
  #dataArray?: Float32Array<ArrayBuffer>;

  constructor() {
    this.#analyser = Synth.ctx.createAnalyser();
    this.#analyser.connect(Synth.ctx.destination);
    this.#dataArray = new Float32Array(this.#analyser.frequencyBinCount);
    this.#analyser.getFloatTimeDomainData(this.#dataArray);

    this.#compressor = Synth.ctx.createDynamicsCompressor();
    this.#compressor.connect(this.#analyser);
  }

  #createOsc() {
    if (!this.#compressor) throw new Error("Oscillator could not be created.");

    const osc = Synth.ctx?.createOscillator();
    osc.connect(this.#compressor);

    return osc;
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
      osc.frequency.setValueAtTime(freq, Synth.ctx.currentTime + i / 2);
      osc.stop(Synth.ctx.currentTime + (1 + i) / 2);
    }
  }

  async playHarmony(freqs: number[]) {
    if (this.isPlaying()) return;
    await Synth.ctx.resume();

    for (const freq of freqs) {
      const osc = this.#createOsc();

      osc.start();
      osc.frequency.setValueAtTime(freq, Synth.ctx.currentTime);
      osc.stop(Synth.ctx.currentTime + 1.5);
    }
  }
}
