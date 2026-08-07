/**
 * MediNova — <mn-badge> component.
 * Status / count badge using design-system badge classes.
 */

import { define, props } from "./base.js";

class MnBadge extends HTMLElement {
  static get observedAttributes() { return ["tone", "dot", "text"]; }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const { tone, dot, text } = props(this, { tone: "neutral", dot: "", text: "" });
    const base = dot === "true" ? "badge badge-dot" : "badge";
    const cls = `${base} badge-${tone}`;
    const content = text || this.textContent.trim() || (dot === "true" ? "" : "Badge");
    this.innerHTML = `<span class="${cls}">${content}</span>`;
  }
}

define("mn-badge", MnBadge);
export default MnBadge;
