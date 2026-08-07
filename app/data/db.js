/**
 * MediNova — DataStore (Db facade).
 * Unified collection CRUD over persisted JSON. Architecture is
 * swap-ready for a real backend via ApiService.
 */

import * as Storage from "../services/StorageService.js";
import { STORAGE_KEYS } from "../config/app.config.js";
import * as ErrorManager from "../errors/ErrorManager.js";
import { uid } from "../utils/id.js";

const COLLECTIONS = [
  "users", "patients", "doctors", "medicines", "categories",
  "appointments", "prescriptions", "records", "reports", "orders",
  "notifications", "messages", "conversations", "tickets", "logs",
  "reviews", "coupons", "payments", "cms", "settings", "faqs",
  "banners", "slots", "cart", "platformSettings", "_meta",
];

let db = null;

/** Load entire db from storage. */
export function load() {
  if (db) return db;
  const raw = Storage.get(STORAGE_KEYS.db, null);
  db = raw && typeof raw === "object" ? raw : {};
  for (const c of COLLECTIONS) {
    if (!Array.isArray(db[c])) db[c] = [];
  }
  return db;
}

/** Persist db. */
export function save() {
  Storage.set(STORAGE_KEYS.db, db);
}

/** Full replace of db (used by seed/reset). */
export function replace(next) {
  db = next;
  save();
}

/** Reset the entire database (clears all collections). */
export function reset() {
  db = {};
  for (const c of COLLECTIONS) db[c] = [];
  save();
}

/** Direct raw access (internal). */
export function raw() {
  return db;
}

/** Access a collection with CRUD helpers. */
export function collection(name) {
  load();
  if (!db[name]) db[name] = [];

  const rows = () => db[name];

  return {
    name,
    all() { return rows(); },
    find(filter = {}, sort) {
      let list = rows().filter((item) => match(item, filter));
      if (sort) list = sortItems(list, sort);
      return list;
    },
    findOne(filter = {}) {
      return rows().find((item) => match(item, filter)) || null;
    },
    get(id) {
      return rows().find((item) => item.id === id) || null;
    },
    insert(item) {
      const record = { id: item.id || uid(name.slice(0, 2).toUpperCase()), createdAt: item.createdAt || new Date().toISOString(), ...item };
      rows().unshift(record);
      save();
      return record;
    },
    insertMany(items) {
      const created = (items || []).map((it) => this.insert(it));
      return created;
    },
    update(id, patch) {
      const idx = rows().findIndex((item) => item.id === id);
      if (idx === -1) return null;
      const record = { ...rows()[idx], ...patch, id, updatedAt: new Date().toISOString() };
      rows()[idx] = record;
      save();
      return record;
    },
    remove(id) {
      const idx = rows().findIndex((item) => item.id === id);
      if (idx === -1) return false;
      rows().splice(idx, 1);
      save();
      return true;
    },
    removeWhere(filter) {
      const before = rows().length;
      db[name] = rows().filter((item) => !match(item, filter));
      save();
      return before - db[name].length;
    },
    count(filter = {}) {
      return filter && Object.keys(filter).length ? rows().filter((item) => match(item, filter)).length : rows().length;
    },
    clear() {
      db[name] = [];
      save();
    },
  };
}

function match(item, filter) {
  return Object.entries(filter).every(([key, value]) => {
    const actual = item[key];
    if (typeof value === "function") return value(actual, item);
    if (value instanceof RegExp) return value.test(String(actual ?? ""));
    if (Array.isArray(value)) return Array.isArray(actual) && value.every((v) => actual.includes(v));
    return actual === value;
  });
}

function sortItems(list, sort) {
  const keys = Array.isArray(sort) ? sort : [sort];
  const sorted = [...list];
  for (const k of keys) {
    const desc = typeof k === "string" && k.startsWith("-");
    const key = desc ? k.slice(1) : k;
    sorted.sort((a, b) => {
      const av = a?.[key];
      const bv = b?.[key];
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
      return desc ? -cmp : cmp;
    });
  }
  return sorted;
}

/** Simple pagination over an array. */
export function paginate(list, page = 1, perPage = 10) {
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), pages);
  const start = (safePage - 1) * perPage;
  return {
    items: list.slice(start, start + perPage),
    page: safePage,
    perPage,
    total,
    pages,
    hasPrev: safePage > 1,
    hasNext: safePage < pages,
  };
}

/** Log a store-level error through the global manager. */
export function logError(err, opts = {}) {
  ErrorManager.report(err, { type: "db", module: "db", ...opts });
}

export default { load, save, replace, reset, raw, collection, paginate, logError, COLLECTIONS };
