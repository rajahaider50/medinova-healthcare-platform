/**
 * MediNova — Error Toast renderer.
 * Floating error notifications with COPY / DISMISS / RETRY actions.
 */

import { h } from "../utils/html.js";
import { buildErrorClipboard, copyText } from "../utils/clipboard.js";
import * as ErrorStore from "./ErrorStore.js";
import { ERROR_TOAST_DURATION } from "../config/error.config.js";

const SEV_META = {
  warning: { icon: "fa-triangle-exclamation" },
  error: { icon: "fa-circle-exclamation" },
  critical: { icon: "fa-bolt" },
};

/** Build a single error toast element. */
export function createErrorToast(item) {
  const meta = SEV_META[item.level] || SEV_META.error;
  const cls = item.level === "critical" ? "critical" : item.level === "warning" ? "warning" : "";

  const toast = h("div", { class: `error-toast ${cls}`, role: "alert" }, [
    h("div", { class: "error-toast-icon" }, h("i", { class: `fa-solid ${meta.icon}` })),
    h("div", { class: "error-toast-info" }, [
      h("div", { class: "error-toast-id" }, item.id || ""),
      h("div", { class: "error-toast-title" }, item.title || "System Error"),
      h("div", { class: "error-toast-msg" }, item.message || ""),
      item.file || item.page
        ? h("div", { class: "error-toast-meta" }, [
            item.file ? h("span", { class: "mono", style: { color: "var(--cyan)" } }, item.file) : null,
            item.page ? h("span", { class: "mono" }, item.page) : null,
            item.time ? h("span", { class: "mono" }, item.time) : null,
          ])
        : null,
    ]),
    h("div", { class: "error-toast-actions" }, [
      h("button", {
        class: "et-btn et-btn-copy",
        title: "Copy error details",
        onclick: () => {
          const rec = ErrorStore.getAll().find((e) => e.id === item.id);
          copyText(rec ? buildErrorClipboard(rec) : buildErrorClipboard(item));
        },
      }, h("i", { class: "fa-solid fa-copy" }), " COPY"),
      item.retryFn
        ? h("button", {
            class: "et-btn et-btn-retry",
            onclick: () => {
              close();
              try { item.retryFn(); } catch (e) { /* reported upstream */ }
            },
          }, h("i", { class: "fa-solid fa-rotate" }), " RETRY")
        : null,
      h("button", { class: "et-btn et-btn-dismiss", onclick: close }, h("i", { class: "fa-solid fa-xmark" }), " DISMISS"),
    ]),
  ]);

  function close() {
    toast.remove();
    clearTimeout(timer);
  }

  const timer = setTimeout(close, item.duration || ERROR_TOAST_DURATION);
  return toast;
}

/** Render a toast into the given root. */
export function showErrorToast(root, item) {
  const toast = createErrorToast(item);
  root.appendChild(toast);
  return toast;
}

export default { createErrorToast, showErrorToast };
