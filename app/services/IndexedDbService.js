/**
 * MediNova — IndexedDbService.
 * Lightweight Promise wrapper over IndexedDB for larger binary/document data
 * (records, images, attachments). Falls back gracefully when unavailable.
 */

import * as ErrorManager from "../errors/ErrorManager.js";

const DB_NAME = "medinova-db";
const DB_VERSION = 1;
const STORE = "assets";

let dbPromise = null;

function open() {
  if (dbPromise) return dbPromise;
  if (typeof indexedDB === "undefined") {
    dbPromise = Promise.reject(new Error("IndexedDB unavailable"));
    return dbPromise;
  }
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

/** Set an entry (Blob/ArrayBuffer/string or JSON-serializable). */
export async function set(key, value) {
  try {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put({ id: key, value });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    ErrorManager.warn("IndexedDB write failed", { type: "storage", details: { key } });
    return false;
  }
}

/** Get an entry by key. */
export async function get(key) {
  try {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(key);
      req.onsuccess = () => resolve(req.result ? req.result.value : null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

/** Delete an entry. */
export async function remove(key) {
  try {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    return false;
  }
}

/** List all keys. */
export async function keys() {
  try {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).getAllKeys();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

/** Clear the store. */
export async function clear() {
  try {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).clear();
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    return false;
  }
}

/** Detect support. */
export function supported() {
  return typeof indexedDB !== "undefined";
}

export default { set, get, remove, keys, clear, supported };
