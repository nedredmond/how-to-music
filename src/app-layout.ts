import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import {
  accidentals,
  getScale,
  modeIntervals,
  naturals,
  scaleIntervals,
  getChords,
  type Note,
  type Scale,
  type Accidental,
  type ScaleName,
} from "./music";
import { Synth } from "./synth";
import { notesToFreqs } from "./utils";
import { styleMap } from "lit/directives/style-map.js";

@customElement("app-layout")
export class AppLayout extends LitElement {
  #synth: Synth;
  constructor() {
    super();
    this.#synth = new Synth();
  }

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Array })
  scale: Readonly<Scale> | undefined = undefined;

  protected async firstUpdated() {
    await this.updateComplete;
    this.renderRoot.querySelector("form")?.requestSubmit();
  }

  render() {
    return html`
      <heading>
        <h1>how to music</h1>
      </heading>
      <main>
        <slot name="keyboard"></slot>
        <form @submit=${this._onSubmit} @change=${this._onInnerChange}>
          <div class="wrapper">
            <label>
              Key:
              <select name="note" id="note">
                ${naturals.map((note) => html` <option>${note}</option> `)}
              </select>
            </label>
            <fieldset id="accidental">
              <legend>Accidental:</legend>
              ${Object.keys(accidentals).map(
                (a) => html`
                  <input
                    type="radio"
                    name="accidental"
                    aria-label="${a}"
                    value="${a}"
                    ?checked=${a === "natural"}
                  />
                  <label> ${accidentals[a as keyof typeof accidentals]} </label>
                `,
              )}
            </fieldset>
            <label>
              Scale:
              <select name="scale" id="scale">
                ${Object.keys(scaleIntervals).map(
                  (scale) => html`
                  <option aria-label="${scale}" value="${scale}">
                    ${scale
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (m) => m.toUpperCase())}
                  </option>
                  </optgroup>
                `,
                )}
                <optgroup label="Mode">
                  ${Object.keys(modeIntervals).map(
                    (mode) => html`
                  <option aria-label="${mode}" value="${mode}">
                    ${mode
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (m) => m.toUpperCase())}
                  </option>
                  </optgroup>
                `,
                  )}
                </optgroup>
              </select>
            </label>
          </div>
          <output name="scale" for="note accidental scale" aria-live="polite">
            ${!this.scale
              ? nothing
              : html`
                  <button
                    @click=${() => {
                      if (this.scale) {
                        this.#synth.playMelody(
                          notesToFreqs(this.scale, this.scale?.[0]),
                        );
                      }
                    }}
                  >
                    ${this.scale.join(", ")}
                  </button>
                  <ul role="list" style=${styleMap({
                    "list-style": "none", 
                    "padding": "unset",
                    "display": "flex",
                    "flex-direction": "column",
                    "gap": "1rem"
                  })}>
                    ${getChords(this.scale).map(
                      (chord) => html`
                        <li>
                          <button
                            @click=${() => {
                              if (chord.notes) {
                                this.#synth.playHarmony(
                                  notesToFreqs(chord.notes, this.scale?.[0]),
                                );
                              }
                            }}
                            style=${styleMap({inlineSize: "100%"})}
                          >
                            ${unsafeHTML(chord.romanNumeral)}:
                            ${unsafeHTML(chord.name)}
                          </button>
                        </li>
                      `,
                    )}
                  </ul>
                `}
          </output>
        </form>
      </main>
    `;
  }

  private _onSubmit(e: SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    const a = data.accidental.valueOf() as Accidental;
    const tonic = data.note.valueOf() + (a === "natural" ? "" : accidentals[a]);
    this.scale = getScale(tonic as Note, data.scale.valueOf() as ScaleName);
  }

  private _onInnerChange(e: Event) {
    const form = e.currentTarget as HTMLFormElement | null;
    form?.requestSubmit();
  }

  static styles = css`
    :host {
      --text: #6b6375;
      --text-h: #08060d;
      --bg: #fff;
      --border: #e5e4e7;
      --code-bg: #f4f3ec;
      --accent: #aa3bff;
      --accent-bg: rgba(170, 59, 255, 0.1);
      --accent-border: rgba(170, 59, 255, 0.5);
      --social-bg: rgba(244, 243, 236, 0.5);
      --shadow:
        rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px;

      --sans: system-ui, "Segoe UI", Roboto, sans-serif;
      --heading: system-ui, "Segoe UI", Roboto, sans-serif;
      --mono: ui-monospace, Consolas, monospace;

      font: 18px/145% var(--sans);
      letter-spacing: 0.18px;

      width: 900px;
      max-width: 100%;
      margin: 0 auto;
      text-align: center;
      min-height: 100svh;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      color: var(--text);
    }

    @media (prefers-color-scheme: dark) {
      :host {
        --text: #9ca3af;
        --text-h: #f3f4f6;
        --bg: #16171d;
        --border: #2e303a;
        --code-bg: #1f2028;
        --accent: #c084fc;
        --accent-bg: rgba(192, 132, 252, 0.15);
        --accent-border: rgba(192, 132, 252, 0.5);
        --social-bg: rgba(47, 48, 58, 0.5);
        --shadow:
          rgba(0, 0, 0, 0.4) 0 10px 15px -3px,
          rgba(0, 0, 0, 0.25) 0 4px 6px -2px;
      }
    }

    h1,
    h2 {
      font-family: var(--heading);
      font-weight: 500;
      color: var(--text-h);
    }

    h1 {
      font-size: 56px;
      letter-spacing: -1.68px;
      margin: 32px 0;
    }

    h2 {
      font-size: 24px;
      line-height: 118%;
      letter-spacing: -0.24px;
      margin: 0 0 8px;
    }

    p {
      margin: 0;
    }

    .wrapper {
      display: flex;
      place-items: center;
      gap: 16px;
    }

    #accidental {
      border: unset;
      margin: unset;
      padding: unset;
      display: flex;
    }

    label {
      display: flex;
      flex-direction: column;
      place-items: start center;
    }

    main {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 25px;
      place-content: center;
      place-items: center;
      flex-grow: 1;
      margin: auto;
    }

    form {
      display: contents;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "app-layout": AppLayout;
  }
}
