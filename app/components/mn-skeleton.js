/**
 * MediNova — <mn-skeleton> component.
 * Skeleton loading placeholder variants.
 */

import { define, props } from "./base.js";

class MnSkeleton extends HTMLElement {
  static get observedAttributes() { return ["variant", "count"]; }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const variant = this.getAttribute("variant") || "text";
    const count = Math.max(1, parseInt(this.getAttribute("count") || "1", 10));

    let unit = "";
    if (variant === "circle") unit = `<div class="skeleton skeleton-circle"></div>`;
    else if (variant === "card") unit = `<div class="skeleton skeleton-card"></div>`;
    else unit = `<div class="skeleton skeleton-text"></div>`;

    this.innerHTML = `<div class="skeleton-wrap" aria-busy="true">${unit.repeat(count)}</div>`;
  }
}

define("mn-skeleton", MnSkeleton);
export default MnSkeleton;
