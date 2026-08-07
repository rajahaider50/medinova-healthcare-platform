/**
 * MediNova — <mn-accordion> component.
 * Collapsible items (open state via `open` attribute / class).
 */

import { define, props } from "./base.js";

class MnAccordion extends HTMLElement {
  static get observedAttributes() { return ["items"]; }

  connectedCallback() {
    this.addEventListener("click", (e) => {
      const header = e.target.closest(".accordion-header");
      if (header) header.parentElement.classList.toggle("open");
    });
    this.render();
  }

  attributeChangedCallback() { this.render(); }

  render() {
    const items = (this.getAttribute("items") || "").split("|").filter(Boolean);
    const markup = items.map((raw) => {
      const [q = "", a = ""] = raw.split("::");
      return `
        <div class="accordion-item">
          <button class="accordion-header" aria-expanded="false">
            <span>${q}</span>
            <i class="fa-solid fa-chevron-down"></i>
          </button>
          <div class="accordion-body"><div class="accordion-content">${a}</div></div>
        </div>`;
    }).join("");

    this.innerHTML = markup || "<slot></slot>";
    this.querySelectorAll(".accordion-header").forEach((h) => {
      h.addEventListener("click", () => {
        const item = h.parentElement;
        const open = item.classList.toggle("open");
        h.setAttribute("aria-expanded", String(open));
        this.dispatchEvent(new CustomEvent("toggle", { detail: { open }, bubbles: true }));
      });
    });
  }
}

define("mn-accordion", MnAccordion);
export default MnAccordion;
