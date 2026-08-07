/**
 * MediNova — <mn-dropdown> component.
 * Dropdown menu (light DOM, click-outside close).
 */

import { define, props } from "./base.js";

class MnDropdown extends HTMLElement {
  static get observedAttributes() { return ["label", "icon", "align"]; }

  connectedCallback() {
    this.addEventListener("click", (e) => {
      const trigger = e.target.closest(".dropdown-trigger");
      if (trigger) {
        e.stopPropagation();
        this.classList.toggle("open");
      }
      const item = e.target.closest(".dropdown-item");
      if (item) {
        this.classList.remove("open");
        this.dispatchEvent(new CustomEvent("select", { detail: { value: item.dataset.value, text: item.textContent.trim() }, bubbles: true }));
      }
    });
    document.addEventListener("click", (e) => {
      if (!this.contains(e.target)) this.classList.remove("open");
    });
    this.render();
  }

  attributeChangedCallback() { this.render(); }

  render() {
    const { label, icon, align } = props(this, { label: "Menu", icon: "", align: "left" });
    this.innerHTML = `
      <div class="dropdown">
        <button class="dropdown-trigger btn btn-ghost">
          ${icon ? `<i class="fa-solid fa-${icon}"></i>` : ""}
          <span>${label}</span>
          <i class="fa-solid fa-chevron-down"></i>
        </button>
        <div class="dropdown-menu${align === "right" ? " dropdown-right" : ""}">
          <slot></slot>
        </div>
      </div>`;
  }
}

define("mn-dropdown", MnDropdown);
export default MnDropdown;
