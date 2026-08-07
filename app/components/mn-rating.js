/**
 * MediNova — <mn-rating> component.
 * Star rating display / interactive input.
 */

import { define, props, bool } from "./base.js";

class MnRating extends HTMLElement {
  static get observedAttributes() { return ["value", "max", "readonly", "interactive"]; }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const value = parseFloat(this.getAttribute("value") || "0");
    const max = parseInt(this.getAttribute("max") || "5", 10);
    const interactive = bool(this, "interactive");

    let stars = "";
    for (let i = 1; i <= max; i++) {
      const full = value >= i - 0.25;
      const half = !full && value >= i - 0.75;
      const icon = full ? "fa-solid fa-star" : half ? "fa-solid fa-star-half-stroke" : "fa-regular fa-star";
      stars += `<i class="${icon} star" data-value="${i}"></i>`;
    }

    this.innerHTML = `<span class="rating${interactive ? " rating-input" : ""}">${stars}</span>
      ${value ? `<span class="rating-value">${value}</span>` : ""}`;

    if (interactive) {
      this.querySelectorAll(".star").forEach((s) => {
        s.addEventListener("click", () => {
          this.setAttribute("value", s.dataset.value);
          this.dispatchEvent(new CustomEvent("change", { detail: Number(s.dataset.value), bubbles: true }));
        });
      });
    }
  }
}

define("mn-rating", MnRating);
export default MnRating;
