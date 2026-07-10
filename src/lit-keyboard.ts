import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { semitones } from "./music";
import "@lit-labs/virtualizer";
import { createRef, type Ref } from "lit/directives/ref.js";

const getKeys = () => {
  const keys: string[] = [];
  for (let octave = 0; octave < 8; octave++) {
    keys.push(...semitones.map((note) => note[1] + octave));
  }
  return keys;
};

@customElement(`lit-key`)
class LitKey extends LitElement {
  render() {
    return html`
      <button style="height: 100%; width: 40px; margin-inline: 2px;">
        <slot></slot>
      </button>
    `;
  }
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
        .renderItem=${(note: string) => html`<lit-key>${note}</lit-key>`}
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
