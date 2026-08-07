/**
 * MediNova — Error history store (persisted, in-memory mirror).
 * Central repository for the Error Console.
 */

import { ERROR_MAX_HISTORY, ERROR_PERSIST } from "../config/error.config.js";
import { STORAGE_KEYS } from "../config/app.config.js";

let errors = [];
let listeners = new Set();

/** Load persisted history. */
export function load() {
  if (!ERROR_PERSIST) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.errors);
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) errors = parsed;
  } catch {
    errors = [];
  }
  return errors;
}

/** Save history. */
export function persist() {
  if (!ERROR_PERSIST) return;
  try {
    localStorage.setItem(STORAGE_KEYS.errors, JSON.stringify(errors.slice(0, ERROR_MAX_HISTORY)));
  } catch {
    /* storage full or blocked — non-fatal */
  }
}

/** Add an error to history, enforcing cap. */
export function push(error) {
  errors.unshift(error);
  if (errors.length > ERROR_MAX_HISTORY) errors = errors.slice(0, ERROR_MAX_HISTORY);
  persist();
  emit();
  return error;
}

/** Replace an existing error record (e.g. after retry). */
export function update(id, patch) {
  const idx = errors.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  errors[idx] = { ...errors[idx], ...patch };
  persist();
  emit();
  return errors[idx];
}

/** Get all errors (newest first). */
export function getAll() {
  return errors;
}

/** Get errors filtered by severity. */
export function getBySeverity(level) {
  return errors.filter((e) => e.level === level);
}

/** Counts grouped by severity. */
export function counts() {
  const c = { info: 0, warning: 0, error: 0, critical: 0, total: errors.length };
  for (const e of errors) {
    if (c[e.level] != null) c[e.level] += 1;
  }
  return c;
}

/** Search across id/message/file/page/module/type. */
export function search(term, { severity, type } = {}) {
  const t = (term || "").toLowerCase().trim();
  return errors.filter((e) => {
    if (severity && e.level !== severity) return false;
    if (type && e.type !== type) return false;
    if (!t) return true;
    return [e.id, e.message, e.file, e.page, e.module, e.type, e.function]
      .some((v) => String(v || "").toLowerCase().includes(t));
  });
}

/** Remove a single error. */
export function remove(id) {
  errors = errors.filter((e) => e.id !== id);
  persist();
  emit();
}

/** Clear entire history. */
export function clear() {
  errors = [];
  persist();
  emit();
}

/** Export all logs as JSON. */
export function exportJson() {
  return JSON.stringify(errors, null, 2);
}

/** Export as CSV string. */
export function exportCsv() {
  const head = ["id", "level", "type", "message", "file", "page", "time", "module"];
  const rows = errors.map((e) =>
    head.map((k) => `"${String(e[k] || "").replace(/"/g, '""')}"`).join(",")
  );
  return [head.join(","), ...rows].join("\n");
}

/** Subscribe to changes. */
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  for (const fn of listeners) fn(errors.slice());
}

export default { load, push, update, getAll, getBySeverity, counts, search, remove, clear, exportJson, exportCsv, subscribe };
