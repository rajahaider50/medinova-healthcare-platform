/**
 * MediNova — <mn-avatar> component.
 * Avatar with initials fallback and online status dot.
 */

import { define, props } from "./base.js";

function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

class MnAvatar extends HTMLElement {
  static get observedAttributes() { return ["name", "src", "size", "status", "icon"]; }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const { name, src, size, status, icon } = props(this, { name: "", src: "", size: "md", status: "", icon: "" });
    const sizeClass = `avatar${size !== "md" ? `-${size}` : ""}`;

    let inner = "";
    if (src) {
      inner = `<img src="${src}" alt="${name}" loading="lazy">`;
    } else if (icon) {
      inner = `<i class="fa-solid fa-${icon}"></i>`;
    } else {
      inner = `<span>${initials(name)}</span>`;
    }

    const statusDot = status ? `<span class="status-dot status-${status}" aria-hidden="true"></span>` : "";
    this.innerHTML = `<div class="${sizeClass}">${inner}${statusDot}</div>`;
  }
}

define("mn-avatar", MnAvatar);
export default MnAvatar;
