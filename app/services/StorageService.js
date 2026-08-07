/**
 * MediNova — StorageService.
 * Namespaced localStorage JSON wrapper with quota-safe handling.
 */

import { STORAGE_KEYS } from "../config/app.config.js";
import * as ErrorManager from "../errors/ErrorManager.js";

const PREFIX = "mn:";

/** Read + parse a key. */
export function get(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/** Write a value. */
export function set(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (e) {
    ErrorManager.warn("Storage write failed", { type: "storage", details: { key } });
    return false;
  }
}

/** Remove a key. */
export function remove(key) {
  try {
    localStorage.removeItem(PREFIX + key);
    return true;
  } catch {
    return false;
  }
}

/** Does the key exist? */
export function has(key) {
  return localStorage.getItem(PREFIX + key) != null;
}

/** Read raw string. */
export function getRaw(key) {
  try {
    return localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

/** Write raw string. */
export function setRaw(key, value) {
  try {
    localStorage.setItem(PREFIX + key, value);
    return true;
  } catch {
    return false;
  }
}

/** All keys under prefix. */
export function keys() {
  const out = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) out.push(k.slice(PREFIX.length));
  }
  return out;
}

/** Clear all MediNova keys. */
export function clearAll() {
  for (const k of keys()) localStorage.removeItem(PREFIX + k);
}

/** Clear everything (all prefixes) — used by "Reset demo data". */
export function clearStorage() {
  localStorage.clear();
}

export default { get, set, remove, has, getRaw, setRaw, keys, clearAll, clearStorage, KEYS: STORAGE_KEYS };
