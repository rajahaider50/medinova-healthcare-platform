/**
 * MediNova — <mn-modal> component.
 * Modal / bottom-sheet with scrim, close handling and ESC support.
 */

import { define, props, bool } from "./base.js";
import { uid } from "../utils/id.js";

class MnModal extends HTMLElement {
  static get observedAttributes() { return ["open", "size", "title", "dismissable"]; }

  connectedCallback() {
    this.addEventListener("click", (e) => {
      if (e.target.classList && e.target.classList.contains("modal-scrim") && bool(this, "dismissable")) this.close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && bool(this, "open") && bool(this, "dismissable")) this.close();
    });
    this.render();
  }

  attributeChangedCallback() {
    this.render();
    if (bool(this, "open")) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
  }

  open() {
    this.setAttribute("open", "");
    this.dispatchEvent(new CustomEvent("open", { bubbles: true }));
  }

  close() {
    this.removeAttribute("open");
    this.dispatchEvent(new CustomEvent("close", { bubbles: true }));
  }

  render() {
    const { size, title } = props(this, { size: "", title: "" });
    if (!bool(this, "open")) {
      this.innerHTML = "";
      return;
    }

    this.innerHTML = `
      <div class="modal-scrim" role="presentation">
        <div class="modal${size ? ` modal-${size}` : ""}" role="dialog" aria-modal="true" aria-label="${title}">
          ${title ? `
          <div class="modal-header">
            <h2>${title}</h2>
            <button class="modal-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
          </div>` : ""}
          <div class="modal-body"><slot></slot></div>
          <div class="modal-footer"><slot name="footer"></slot></div>
        </div>
      </div>`;

    this.querySelector(".modal-close")?.addEventListener("click", () => this.close());
  }
}

define("mn-modal", MnModal);
export default MnModal;
