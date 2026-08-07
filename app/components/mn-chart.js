/**
 * MediNova — <mn-chart> component.
 * SVG charts: bar, line, donut, sparkline (no external chart lib).
 */

import { define, props } from "./base.js";

const COLORS = ["#8b5cf6", "#a855f7", "#38bdf8", "#34d399", "#fbbf24", "#f87171", "#2dd4bf", "#c084fc"];

function parseData(json) {
  try { return JSON.parse(json); } catch { return []; }
}

function buildPath(points) {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
}

class MnChart extends HTMLElement {
  static get observedAttributes() { return ["type", "data", "height", "labels", "donutTitle", "spark"]; }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const { type, height } = props(this, { type: "bar", height: "220" });
    const data = parseData(this.getAttribute("data") || "[]");
    const labels = (this.getAttribute("labels") || "").split(",").filter(Boolean);

    if (!data.length) {
      this.innerHTML = `<div class="empty-state" style="padding:24px"><p>No data</p></div>`;
      return;
    }

    if (type === "line") this.renderLine(data, labels, height);
    else if (type === "donut") this.renderDonut(data, height);
    else if (type === "spark") this.renderSpark(data);
    else this.renderBar(data, labels, height);
  }

  renderBar(data, labels, height) {
    const max = Math.max(...data, 1);
    const w = data.length * 42;
    const h = 170;
    const bars = data.map((v, i) => {
      const bh = (v / max) * (h - 30);
      return `
        <rect x="${i * 42 + 8}" y="${h - bh - 8}" width="26" height="${Math.max(bh, 2)}" rx="6" fill="${COLORS[i % COLORS.length]}">
          <title>${labels[i] || ""}: ${v}</title>
        </rect>`;
    }).join("");

    const axis = labels.map((l, i) => `<text x="${i * 42 + 21}" y="${h + 14}" text-anchor="middle" class="chart-axis">${l}</text>`).join("");
    this.innerHTML = `<svg viewBox="0 0 ${w} ${h + 24}" class="mn-chart" height="${height}">${bars}${axis}</svg>`;
  }

  renderLine(data, labels, height) {
    const w = Math.max(300, data.length * 60);
    const h = 180;
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const points = data.map((v, i) => ({
      x: (i / (data.length - 1 || 1)) * (w - 40) + 20,
      y: h - 20 - ((v - min) / range) * (h - 50),
    }));
    const path = buildPath(points);
    const dots = points.map((p, i) => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="${COLORS[0]}"><title>${labels[i] || ""}: ${data[i]}</title></circle>`).join("");
    const area = `${path} L${points[points.length - 1].x},${h - 10} L${points[0].x},${h - 10} Z`;
    this.innerHTML = `<svg viewBox="0 0 ${w} ${h}" class="mn-chart" height="${height}">
      <path d="${area}" fill="${COLORS[0]}" opacity="0.12"></path>
      <path d="${path}" fill="none" stroke="${COLORS[0]}" stroke-width="3" stroke-linecap="round"></path>
      ${dots}
    </svg>`;
  }

  renderDonut(data, height) {
    const total = data.reduce((a, b) => a + b, 0) || 1;
    const r = 60;
    const c = 2 * Math.PI * r;
    let offset = 0;
    const segs = data.map((v, i) => {
      const frac = v / total;
      const dash = frac * c;
      const seg = `<circle r="${r}" cx="80" cy="80" fill="none" stroke="${COLORS[i % COLORS.length]}" stroke-width="20"
        stroke-dasharray="${dash} ${c - dash}" stroke-dashoffset="${-offset}" transform="rotate(-90 80 80)">
        <title>${this.getAttribute("labels")?.split(",")[i] || ""}: ${v}</title></circle>`;
      offset += dash;
      return seg;
    }).join("");
    const title = this.getAttribute("donutTitle") || total;
    this.innerHTML = `<svg viewBox="0 0 160 160" class="mn-chart" height="${height}">
      ${segs}
      <text x="80" y="78" text-anchor="middle" class="donut-center-label" font-size="20">${title}</text>
    </svg>`;
  }

  renderSpark(data) {
    const w = 120;
    const h = 36;
    const max = Math.max(...data, 1);
    const points = data.map((v, i) => ({
      x: (i / (data.length - 1 || 1)) * w,
      y: h - 4 - (v / max) * (h - 10),
    }));
    const path = buildPath(points);
    this.innerHTML = `<svg viewBox="0 0 ${w} ${h}" class="sparkline"><path d="${path}" fill="none" stroke="${COLORS[0]}" stroke-width="2"></path></svg>`;
  }
}

define("mn-chart", MnChart);
export default MnChart;
