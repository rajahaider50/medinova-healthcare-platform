/**
 * MediNova — <mn-empty> component.
 * Empty state placeholder (icon + title + text + optional slot action).
 */

import { define, props } from "./base.js";

class MnEmpty extends HTMLElement {
  static get observedAttributes() { return ["icon", "title", "text"]; }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const { icon, title, text } = props(this, { icon: "folder-open", title: "Nothing here yet", text: "No items found. Try adjusting your filters." });
    this.innerHTML = `
      <div class="empty-state">
        <div class="icon-box icon-box-lg"><i class="fa-solid fa-${icon}"></i></div>
        <h3>${title}</h3>
        <p>${text}</p>
        <div class="empty-actions"><slot></slot></div>
      </div>`;
  }
}

define("mn-empty", MnEmpty);
export default MnEmpty;
