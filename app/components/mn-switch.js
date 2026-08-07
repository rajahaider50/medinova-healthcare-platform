/**
 * MediNova — <mn-switch> component.
 * Accessible toggle switch wrapping the design-system .switch.
 */

import { define, props, bool } from "./base.js";

class MnSwitch extends HTMLElement {
  static get observedAttributes() { return ["checked", "label", "disabled"]; }

  connectedCallback() {
    this.addEventListener("click", () => {
      if (bool(this, "disabled")) return;
      this.toggleAttribute("checked");
      this.dispatchEvent(new CustomEvent("change", { detail: bool(this, "checked"), bubbles: true }));
    });
    this.render();
  }

  attributeChangedCallback() { this.render(); }

  render() {
    const label = this.getAttribute("label") || "";
    const on = bool(this, "checked");
    this.innerHTML = `
      <label class="switch-row ${bool(this, "disabled") ? "is-disabled" : ""}">
        ${label ? `<span class="switch-label">${label}</span>` : ""}
        <span class="switch${on ? " is-on" : ""}" role="switch" aria-checked="${on}" tabindex="0">
          <span class="switch-track"></span><span class="switch-thumb"></span>
        </span>
      </label>`;
  }
}

define("mn-switch", MnSwitch);
export default MnSwitch;
