/**
 * MediNova — ToastService.
 * Success / info / warning / error toasts rendered into #toast-root.
 */

import { h } from "../utils/html.js";
import { uid } from "../utils/id.js";

const ICONS = {
  success: "fa-circle-check",
  error: "fa-circle-xmark",
  warning: "fa-triangle-exclamation",
  info: "fa-circle-info",
};

function root() {
  let el = document.getElementById("toast-root");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast-root";
    el.className = "toast-root";
    document.body.appendChild(el);
  }
  return el;
}

/**
 * Show a toast.
 * @param {object} opts { type, title, msg, duration, icon }
 */
export function show(opts) {
  const type = opts.type || "info";
  const toast = h("div", { class: `toast ${type}`, role: "status" }, [
    h("i", { class: `fa-solid ${opts.icon || ICONS[type]} toast-icon` }),
    h("div", { class: "toast-content", style: { flex: "1" } }, [
      opts.title ? h("div", { class: "toast-title" }, opts.title) : null,
      opts.msg ? h("div", { class: "toast-msg" }, opts.msg) : null,
    ]),
    h("button", {
      class: "toast-close",
      "aria-label": "Dismiss",
      onclick: () => toast.remove(),
    }, h("i", { class: "fa-solid fa-xmark" })),
  ]);

  const r = root();
  r.appendChild(toast);
  const duration = opts.duration ?? 4200;
  const timer = setTimeout(() => {
    toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateX(16px)";
    setTimeout(() => toast.remove(), 320);
  }, duration);

  // Pause on hover
  toast.addEventListener("mouseenter", () => clearTimeout(timer));
  return toast;
}

export const success = (title, msg, opts = {}) => show({ type: "success", title, msg, ...opts });
export const error = (title, msg, opts = {}) => show({ type: "error", title, msg, ...opts });
export const warning = (title, msg, opts = {}) => show({ type: "warning", title, msg, ...opts });
export const info = (title, msg, opts = {}) => show({ type: "info", title, msg, ...opts });

export default { show, success, error, warning, info };
