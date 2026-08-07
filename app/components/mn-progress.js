/**
 * MediNova — <mn-progress> component.
 * Progress bar with tone + animated value.
 */

import { define, props } from "./base.js";

class MnProgress extends HTMLElement {
  static get observedAttributes() { return ["value", "max", "tone", "label"]; }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const value = parseFloat(this.getAttribute("value") || "0");
    const max = parseFloat(this.getAttribute("max") || "100");
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    const tone = this.getAttribute("tone") || "";
    const label = this.getAttribute("label") || "";

    this.innerHTML = `
      <div class="progress-wrap">
        ${label ? `<div class="progress-label">${label}</div>` : ""}
        <div class="progress${tone ? ` progress-${tone}` : ""}" role="progressbar" aria-valuenow="${value}" aria-valuemax="${max}">
          <div class="progress-bar" style="width:${pct}%"></div>
        </div>
        <span class="progress-value">${value}%</span>
      </div>`;
  }
}

define("mn-progress", MnProgress);
export default MnProgress;
