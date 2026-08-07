/**
 * MediNova — Network Monitor.
 * Detects online/offline transitions, shows banner + recovery notification,
 * and provides a request wrapper with timeout/retry.
 */

import { createAppError } from "./error-utils.js";
import * as ErrorManager from "./ErrorManager.js";

let bannerEl = null;
let online = navigator.onLine !== false;
let listeners = new Set();

/** Initialize network monitoring + banner binding. */
export function init(bannerRoot) {
  bannerEl = bannerRoot || document.getElementById("network-banner");
  window.addEventListener("online", () => setOnline(true));
  window.addEventListener("offline", () => setOnline(false));
  setOnline(online, true);
}

/** Current connectivity state. */
export function isOnline() {
  return online;
}

function setOnline(value, initial = false) {
  online = value;
  if (bannerEl) {
    if (value) {
      bannerEl.hidden = true;
      bannerEl.innerHTML = "";
    } else {
      bannerEl.hidden = false;
      bannerEl.innerHTML = `<i class="fa-solid fa-wifi"></i><span>You're offline. Changes will sync when you're back online.</span>`;
    }
  }
  if (!initial) {
    notify(value);
    ErrorManager.info(value ? "Connection restored" : "Connection lost", {
      type: "network",
      silent: true,
    });
  }
}

function notify(value) {
  for (const fn of listeners) fn(value);
}

/** Subscribe to connectivity changes. */
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Fetch wrapper with timeout + optional automatic retry + error reporting.
 * @param {string} url
 * @param {object} opts { timeout, retries, retryDelay, reportErrors, ...fetchOpts }
 */
export async function request(url, opts = {}) {
  const { timeout = 10000, retries = 0, retryDelay = 800, reportErrors = true, ...fetchOpts } = opts;
  let attempt = 0;

  while (true) {
    try {
      if (!online) throw createAppError("Network connection lost", { type: "network", network: true });
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), timeout);
      const res = await fetch(url, { ...fetchOpts, signal: ctrl.signal });
      clearTimeout(timer);
      if (!res.ok) {
        const err = createAppError(`Request failed with status ${res.status}`, {
          type: res.status >= 500 ? "server" : "api",
          code: res.status,
        });
        throw err;
      }
      return res;
    } catch (e) {
      const isAbort = e.name === "AbortError";
      const err = isAbort
        ? createAppError(`Request timed out after ${timeout}ms`, { type: "timeout", code: "TIMEOUT" })
        : e;
      attempt += 1;
      if (attempt <= retries) {
        await new Promise((r) => setTimeout(r, retryDelay * attempt));
        continue;
      }
      if (reportErrors) ErrorManager.report(err, { type: err.type || "network", module: "network" });
      throw err;
    }
  }
}

/** Convenience: safe JSON get with graceful fallback. */
export async function jsonGet(url, opts = {}) {
  const res = await request(url, opts);
  return res.json();
}

export default { init, isOnline, subscribe, request, jsonGet };
