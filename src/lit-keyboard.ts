import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { accidentals, semitones } from "./music";
import "@lit-labs/virtualizer";
import { createRef, type Ref } from "lit/directives/ref.js";
import { classMap } from "lit/directives/class-map.js";

const getKeys = () => {
  const keys: string[] = [];
  for (let octave = 0; octave < 8; octave++) {
    keys.push(...semitones.map((note) => note[1] + octave));
  }
  return keys;
};

@customElement(`lit-key`)
class LitKey extends LitElement {
  @property({ type: Boolean })
  accidental = false;

  render() {
    console.log(this.accidental);
    const classes = {
      accidental: this.accidental,
    };
    return html`
      <button class=${classMap(classes)}>
        <slot></slot>
      </button>
    `;
  }

  static styles = css`
    button {
      height: 100%;
      width: 40px;
      margin-inline: 2px;
      border-radius: 5px;

      background-color: ivory;
      color: black;
      border: solid 2px lightgray;

      &.accidental {
        background-color: black;
        color: white;
        border: solid 2px lightgray;
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
            index: 48,
            block: "center",
          },
        }}
        .items=${getKeys()}
        .renderItem=${(note: string) =>
          html`<lit-key
            .accidental=${Object.values(accidentals).some((a) =>
              note.includes(a),
            )}
            >${note}</lit-key
          >`}
      ></lit-virtualizer>
    `;
  }

  static styles = css`
    :host {
      width: 100%;
    }

    lit-virtualizer {
      min-height: 100px;
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
