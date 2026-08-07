/**
 * MediNova — <mn-pagination> component.
 * Page controls with prev/next and page numbers.
 */

import { define, props } from "./base.js";

function range(page, pages) {
  const out = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, page + 2);
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

class MnPagination extends HTMLElement {
  static get observedAttributes() { return ["page", "pages", "total"]; }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  go(page) {
    const pages = parseInt(this.getAttribute("pages") || "1", 10);
    const next = Math.min(Math.max(1, page), pages);
    this.setAttribute("page", String(next));
    this.dispatchEvent(new CustomEvent("change", { detail: next, bubbles: true }));
  }

  render() {
    const page = parseInt(this.getAttribute("page") || "1", 10);
    const pages = Math.max(1, parseInt(this.getAttribute("pages") || "1", 10));
    const total = this.getAttribute("total") || "";

    const nums = range(page, pages).map((p) => `
      <button class="page-btn${p === page ? " active" : ""}" data-page="${p}" ${p === page ? "disabled" : ""}>${p}</button>`).join("");

    this.innerHTML = `
      <nav class="pagination" aria-label="Pagination">
        <button class="btn btn-ghost btn-icon" data-page="${page - 1}" ${page <= 1 ? "disabled" : ""} aria-label="Previous">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        ${nums}
        <button class="btn btn-ghost btn-icon" data-page="${page + 1}" ${page >= pages ? "disabled" : ""} aria-label="Next">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
        ${total ? `<span class="page-total">${total}</span>` : ""}
      </nav>`;

    this.querySelectorAll("[data-page]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const p = parseInt(btn.dataset.page, 10);
        if (p >= 1 && p <= pages && p !== page) this.go(p);
      });
    });
  }
}

define("mn-pagination", MnPagination);
export default MnPagination;
