import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { accidentals, eharmonicEquivalentToSemitoneIdx, semitones, semitonesInOctave, type Note } from "./music";
import "@lit-labs/virtualizer";
import { createRef, type Ref } from "lit/directives/ref.js";
import { classMap } from "lit/directives/class-map.js";
import { getFreq, Synth } from "./synth";

const getKeys = () => {
  const keys: Note[] = [];
  for (let octave = 0; octave < 8; octave++) {
    keys.push(...semitones.map((note) => note[1]));
  }
  return keys;
};

const a4Idx = eharmonicEquivalentToSemitoneIdx["A"] + (semitonesInOctave * 4);

@customElement(`lit-key`)
class LitKey extends LitElement {
  #synth: Synth;
  constructor() {
    super();
    this.#synth = new Synth();
  }

  @property({ type: String })
  note: Note = "C";

  @property({ type: Number })
  index = 0;

  @property({ type: Boolean })
  accidental = false;

  get octave() {
    return Math.trunc(this.index / semitonesInOctave)
  }

  #startNote() {
    this.#synth.startNote(getFreq(this.index, a4Idx));
  }

  #stopNote() {
    this.#synth.stopNote();
  }

  render() {
    const classes = {
      accidental: this.accidental,
    };
    return html`
      <button class=${classMap(classes)}
      @keydown=${(e: KeyboardEvent) => {
        console.log(e.key);
        if (e.key === "Enter" || e.key === " ") this.#startNote();
        if (e.key === "Tab") this.#stopNote();
      }}
      @keyup=${this.#stopNote}
      @pointerdown=${this.#startNote}
      @pointerup=${this.#stopNote}
      @pointerleave=${this.#stopNote}
      >${this.note + this.octave}</button>
    `;
  }

  static styles = css`
    button {
      display: flex;
      justify-content: center;
      padding: 5px;
      text-align: start;
      height: 100%;
      box-sizing: border-box;
      width: 40px;
      margin-inline: 2px;
      border-radius: 5px;

      background-color: ivory;
      color: black;
      border: solid 2px lightgray;

      &.accidental {
        height: 80cqh;
        margin-top: unset;
        background-color: black;
        color: white;
        border: solid 2px gray;
      }
    }
  `;
}

@customElement("lit-keyboard")
export class LitKeyboard extends LitElement {
  inputRef: Ref<HTMLInputElement> = createRef();

  render() {
    return html`
      <lit-virtualizer
        scroller
        .layout=${{
          direction: "horizontal",
          pin: {
            index: eharmonicEquivalentToSemitoneIdx["C"] + (semitonesInOctave * 4),
            block: "center",
          },
        }}
        .items=${getKeys()}
        .renderItem=${(note: Note, i: number) =>
          html`<lit-key
            .note=${note}
            .accidental=${Object.values(accidentals).some((a) =>
              note.includes(a),
            )}
            .index=${i}
            ></lit-key
          >`}
      ></lit-virtualizer>
    `;
  }

  static styles = css`
    :host {
      width: 100%;
    }

    lit-virtualizer {
      container-type: size;
      height: 100px;
    }

    lit-key {
      height: 100%;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-key": LitKey;
    "lit-keyboard": LitKeyboard;
  }
}
