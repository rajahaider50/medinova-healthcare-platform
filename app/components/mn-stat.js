/**
 * MediNova — <mn-stat> component.
 * Dashboard stat card (icon, label, value, delta).
 */

import { define, props } from "./base.js";

class MnStat extends HTMLElement {
  static get observedAttributes() { return ["label", "value", "icon", "tone", "delta", "deltaLabel", "sub"]; }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const { label, value, icon, tone, delta, deltaLabel, sub } = props(this, {
      label: "", value: "—", icon: "chart-simple", tone: "purple", delta: "", deltaLabel: "vs last month", sub: "",
    });

    const deltaHtml = delta
      ? `<div class="delta ${String(delta).startsWith("-") ? "delta-down" : "delta-up"}">
           <i class="fa-solid ${String(delta).startsWith("-") ? "fa-arrow-trend-down" : "fa-arrow-trend-up"}"></i>
           <span>${delta}</span><span class="delta-label">${deltaLabel}</span>
         </div>`
      : "";

    const subHtml = sub ? `<div class="stat-sub">${sub}</div>` : "";

    this.innerHTML = `
      <div class="stat-card glass-hover">
        <div class="stat-top">
          <div class="stat-icon icon-box icon-box-${tone}"><i class="fa-solid fa-${icon}"></i></div>
        </div>
        <div class="stat-value">${value}</div>
        <div class="stat-label">${label}</div>
        ${deltaHtml}
        ${subHtml}
      </div>`;
  }
}

define("mn-stat", MnStat);
export default MnStat;
