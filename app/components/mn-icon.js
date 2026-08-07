/**
 * MediNova — <mn-icon> component.
 * Font Awesome icon wrapper with sizing helper.
 */

import { define, props } from "./base.js";

const SIZES = { xs: "icon-xs", sm: "icon-sm", md: "", lg: "icon-lg" };

class MnIcon extends HTMLElement {
  static get observedAttributes() { return ["name", "size", "color", "spin"]; }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const { name, size, color, spin } = props(this, { name: "circle-info", size: "md", color: "", spin: "" });
    const cls = [
      "fa-solid",
      "fa-" + name,
      SIZES[size] || "",
      spin === "true" ? "fa-spin" : "",
    ].filter(Boolean).join(" ");

    this.innerHTML = `<i class="${cls}"${color ? ` style="color:${color}"` : ""}></i>`;
  }
}

define("mn-icon", MnIcon);
export default MnIcon;
