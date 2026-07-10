import {html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import { semitones, type Note } from './music';

@customElement('virtual-scroll')
export class Keyboard extends LitElement {
  render() {
    return html`
        <div class="keyboard">
          <lit-keyboard
            scroller
            .layout=${{
              direction: "horizontal"
            }}
            .items=${[...semitones, ...semitones, ...semitones, ...semitones, ...semitones, ...semitones, ...semitones, ...semitones]}
            .renderItem=${(note: Note) => html`<button>${note[1]}</button>`}
          ></lit-keyboard>
        </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-keyboard": Keyboard;
  }
}
