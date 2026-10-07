export class Synth {
  static ctx = new AudioContext();
  #gain?: GainNode;
  #analyser?: AnalyserNode;
  #dataArray?: Float32Array<ArrayBuffer>;
  #osc?: OscillatorNode;

  #vol: number = 0.5;

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
    this.#gain = Synth.ctx.createGain();
    this.#gain.connect(compressor);
    this.#gain.gain.value = 0.5;
  }

  get #now() {
    return Synth.ctx.currentTime;
  }

  get volume() {
    return this.#vol;
  }

  set volume(value: number) {
    if (!this.#gain)
      throw new Error("Synth failed to initialize; cannot set volume.");
    this.#vol = Math.min(1, Math.max(0, value));
    this.#gain.gain.value = this.#vol;
  }

  #createOsc() {
    if (!this.#gain) throw new Error("Oscillator could not be created.");

    const osc = Synth.ctx?.createOscillator();
    osc.connect(this.#gain);

    return osc;
  }

  // #startOsc(osc: OscillatorNode, when: number = 0) {
  //   const decay = 0.3 + when;
  //   this.#gain?.gain.setValueAtTime(0, this.#now);
  //   this.#gain?.gain.exponentialRampToValueAtTime(this.#vol, this.#now + decay)
  //   osc.start(this.#now);
  // }

  // #stopOsc(osc: OscillatorNode, when: number = 0) {
  //   const decay = 0.3 + when;
  //   this.#gain?.gain.exponentialRampToValueAtTime(0.0001, this.#now + decay);
  //   osc.stop(this.#now + decay);

  //   // reset volume
  //   this.#gain?.gain.setValueAtTime(this.#vol, this.#now + decay + 0.0001);
  // }

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

  async startNote(freq: number) {
    if (this.isPlaying()) return;
    await Synth.ctx.resume();

    console.log("starting note");

    this.#osc = this.#createOsc();
    this.#osc.frequency.setValueAtTime(freq, this.#now);
    this.#osc.start(this.#now)
  }
  
  async stopNote() {
    if (!this.#osc || !this.isPlaying()) return;

    console.log("stopping note")

    this.#osc.stop(this.#now)
  }

  async playMelody(freqs: number[]) {
    if (this.isPlaying()) return;
    await Synth.ctx.resume();

    const osc = this.#createOsc();
    osc.start();
    for (const [i, freq] of freqs.entries()) {
      osc.frequency.setValueAtTime(freq, this.#now + i / 2.5);
      osc.stop(this.#now + (1 + i) / 2.5);
    }
  }

  async playHarmony(freqs: number[]) {
    if (this.isPlaying()) return;
    await Synth.ctx.resume();

    for (const freq of freqs) {
      const osc = this.#createOsc();

      osc.start();
      osc.frequency.setValueAtTime(freq, this.#now);
      osc.stop(this.#now + 1);
    }
  }
}
