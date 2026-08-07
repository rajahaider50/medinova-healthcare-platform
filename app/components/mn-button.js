/**
 * MediNova — <mn-button> component.
 * Button using design-system .btn classes.
 */

import { define, props, bool } from "./base.js";

class MnButton extends HTMLElement {
  static get observedAttributes() { return ["variant", "size", "icon", "iconRight", "loading", "disabled", "block", "type"]; }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const { variant, size, icon, iconRight } = props(this, { variant: "primary", size: "", icon: "", iconRight: "" });
    const cls = [
      "btn",
      variant !== "primary" ? `btn-${variant}` : "btn-primary",
      size ? `btn-${size}` : "",
      bool(this, "block") ? "btn-block" : "",
    ].filter(Boolean).join(" ");

    const loading = bool(this, "loading");
    const content = this.textContent.trim() || "Button";

    this.innerHTML = `
      <button
        type="${this.getAttribute("type") || "button"}"
        class="${cls}"
        ${bool(this, "disabled") || loading ? "disabled" : ""}
        ${loading ? `aria-busy="true"` : ""}>
        ${loading ? `<span class="spinner spinner-sm"></span>` : icon ? `<i class="fa-solid fa-${icon}"></i>` : ""}
        <span>${content}</span>
        ${iconRight ? `<i class="fa-solid fa-${iconRight}"></i>` : ""}
      </button>`;
  }
}

define("mn-button", MnButton);
export default MnButton;
