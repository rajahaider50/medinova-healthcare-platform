/**
 * MediNova — Global Error Manager.
 * Captures window errors, unhandled promise rejections, resource errors,
 * and centralized reporting from every module (User + Admin panels).
 */

import { AUTO_CAPTURE, ERROR_DEDUPE_WINDOW, ERROR_OVERLAY_DEV_ONLY, ERROR_TOAST_DURATION } from "../config/error.config.js";
import { IS_DEV } from "../config/app.config.js";
import { normalizeError, publicMessage } from "./error-utils.js";
import { SEVERITY } from "./error-levels.js";
import * as ErrorStore from "./ErrorStore.js";

let listeners = new Set();
let toastFn = null;
let lastToast = { key: "", at: 0 };
const recent = new Map();

function attachGlobalHandlers() {
  window.addEventListener("error", (event) => {
    report(event.error || new Error(event.message), {
      type: "js",
      file: event.filename,
      line: event.lineno,
      column: event.colno,
      level: SEVERITY.ERROR,
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason instanceof Error ? event.reason : new Error(String(event.reason || "Unhandled promise rejection"));
    report(reason, { type: "promise", level: SEVERITY.ERROR });
  });

  // Resource load failures (images, scripts, css)
  document.addEventListener("error", (event) => {
    const target = event.target;
    if (target && (target.tagName === "IMG" || target.tagName === "SCRIPT" || target.tagName === "LINK")) {
      report(new Error(`Failed to load resource: ${target.src || target.href}`), {
        type: target.tagName === "IMG" ? "image" : "resource",
        level: SEVERITY.WARNING,
        page: window.location.hash || "/",
      });
    }
  }, true);
}

/**
 * Report an error through the global pipeline.
 * @param {Error|string} raw
 * @param {object} opts { level, type, module, page, retryFn, details, silent }
 * @returns {object} normalized error record
 */
export function report(raw, opts = {}) {
  const error = normalizeError(raw, opts);
  ErrorStore.push(error);
  notifyListeners(error);
  showToast(error, opts);
  return error;
}

/** Info-level report (non-error telemetry). */
export function info(message, opts = {}) {
  return report(message, { ...opts, level: SEVERITY.INFO, type: opts.type || "runtime", silent: true });
}

/** Warning-level report. */
export function warn(message, opts = {}) {
  return report(message, { ...opts, level: SEVERITY.WARNING, type: opts.type || "runtime", silent: true });
}

/** Error-level report. */
export function error(message, opts = {}) {
  return report(message, { ...opts, level: SEVERITY.ERROR, type: opts.type || "runtime" });
}

/** Critical-level report with prominent toast. */
export function critical(message, opts = {}) {
  return report(message, { ...opts, level: SEVERITY.CRITICAL, type: opts.type || "runtime" });
}

/** Report a caught error from an async operation with retry. */
export function fromAsync(fn, opts = {}) {
  return Promise.resolve()
    .then(fn)
    .catch((err) => {
      report(err, opts);
      return null;
    });
}

/** Wrap a function so any throw is reported instead of crashing the caller. */
export function guard(fn, opts = {}) {
  return function (...args) {
    try {
      return fn.apply(this, args);
    } catch (e) {
      report(e, opts);
      return null;
    }
  };
}

/** Human-safe message depending on environment. */
export function messageFor(error) {
  if (IS_DEV) return error.message;
  return publicMessage(error);
}

/** Count of current errors in history (for live counter). */
export function liveCount() {
  return ErrorStore.counts().total;
}

/** Subscribe to new error events (live monitor). */
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notifyListeners(error) {
  for (const fn of listeners) {
    try { fn(error); } catch { /* ignore */ }
  }
}

function showToast(error, opts) {
  if (opts.silent) return;
  if (error.level === SEVERITY.INFO) return;
  // Dedupe identical errors within the window
  const key = `${error.level}:${error.type}:${error.message}:${error.module}`;
  const now = Date.now();
  const last = recent.get(key) || 0;
  if (now - last < ERROR_DEDUPE_WINDOW) return;
  recent.set(key, now);

  const showOverlay = IS_DEV || !ERROR_OVERLAY_DEV_ONLY;
  if (!showOverlay && error.level !== SEVERITY.CRITICAL) return;

  if (toastFn) {
    toastFn({
      id: error.id,
      level: error.level,
      title: error.level === SEVERITY.CRITICAL ? "System Critical Error" : "System Error",
      message: IS_DEV ? error.message : publicMessage(error),
      file: error.file,
      page: error.page,
      time: error.time,
      retryFn: opts.retryFn || error.retryFn,
      duration: error.level === SEVERITY.CRITICAL ? ERROR_TOAST_DURATION * 2 : ERROR_TOAST_DURATION,
    });
  }
}

/** Set the toast renderer (called by UI layer). */
export function setToastRenderer(fn) {
  toastFn = fn;
}

/** Bind dev overlay + store boot. */
export function init() {
  ErrorStore.load();
  if (AUTO_CAPTURE) attachGlobalHandlers();
}

export default { report, info, warn, error, critical, fromAsync, guard, messageFor, liveCount, subscribe, setToastRenderer, init };
