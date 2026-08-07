/**
 * MediNova — <mn-panel> component.
 * Glass panel with optional header/footer slots.
 */

import { define, props } from "./base.js";

class MnPanel extends HTMLElement {
  static get observedAttributes() { return ["title", "subtitle", "icon", "actions"]; }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const { title, subtitle, icon, actions } = props(this, { title: "", subtitle: "", icon: "", actions: "" });

    const header = title
      ? `<div class="glass-header">
           <div class="panel-heading">
             ${icon ? `<span class="icon-box icon-box-sm"><i class="fa-solid fa-${icon}"></i></span>` : ""}
             <div>
               <div class="panel-title">${title}</div>
               ${subtitle ? `<div class="panel-subtitle">${subtitle}</div>` : ""}
             </div>
           </div>
           ${actions ? `<div class="panel-actions">${actions}</div>` : ""}
         </div>`
      : "";

    this.innerHTML = `
      <div class="mn-panel glass">
        ${header}
        <div class="glass-body"><slot></slot></div>
        <slot name="footer"></slot>
      </div>`;
  }
}

define("mn-panel", MnPanel);
export default MnPanel;
