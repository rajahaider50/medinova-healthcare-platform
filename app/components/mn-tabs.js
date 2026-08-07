/**
 * MediNova — <mn-tabs> component.
 * Tab bar + panels (light DOM, no shadow).
 */

import { define, props } from "./base.js";

class MnTabs extends HTMLElement {
  static get observedAttributes() { return ["active"]; }

  connectedCallback() {
    this.addEventListener("click", (e) => {
      const btn = e.target.closest(".tab");
      if (btn && !btn.classList.contains("active")) this.activate(btn.dataset.tab);
    });
    this.render();
  }

  attributeChangedCallback() { this.render(); }

  activate(tab) {
    this.setAttribute("active", tab);
    this.dispatchEvent(new CustomEvent("change", { detail: tab, bubbles: true }));
  }

  render() {
    const active = this.getAttribute("active") || "";
    const labels = (this.getAttribute("labels") || "").split(",").filter(Boolean);

    const tabs = labels.map((l) => {
      const key = String(l).toLowerCase().replace(/\s+/g, "-");
      return `<button class="tab${key === active ? " active" : ""}" data-tab="${key}" role="tab">${l}</button>`;
    }).join("");

    this.innerHTML = `<div class="tabs" role="tablist">${tabs}</div><div class="tab-panel"><slot></slot></div>`;
  }
}

define("mn-tabs", MnTabs);
export default MnTabs;
