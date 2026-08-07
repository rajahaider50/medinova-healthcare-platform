/**
 * MediNova — Seed service.
 * Seeds the DataStore with mock data on first load (idempotent).
 */

import Db from "./db.js";
import { allMockData } from "./mock/index.js";
import * as ErrorManager from "../errors/ErrorManager.js";

const SEED_VERSION = "1.0.0";

const ARRAY_COLLECTIONS = [
  "categories",
  "doctors",
  "medicines",
  "users",
  "appointments",
  "prescriptions",
  "records",
  "reports",
  "orders",
  "coupons",
  "notifications",
  "conversations",
  "messages",
  "tickets",
  "faqs",
  "reviews",
  "banners",
  "pages",
];

const OBJECT_COLLECTIONS = ["platformSettings", "analytics", "cms"];

export function needsSeeding() {
  const meta = Db.collection("_meta").findOne({ id: "seed" });
  return !meta || meta.version !== SEED_VERSION;
}

function markSeeded(counts) {
  Db.collection("_meta").removeWhere({ id: "seed" });
  Db.collection("_meta").insert({ id: "seed", version: SEED_VERSION, seededAt: new Date().toISOString(), counts });
}

function seedData() {
  const counts = {};
  for (const name of ARRAY_COLLECTIONS) {
    const rows = allMockData[name];
    if (!Array.isArray(rows) || rows.length === 0) continue;
    const col = Db.collection(name);
    for (const row of rows) col.insert(row);
    counts[name] = rows.length;
  }
  for (const name of OBJECT_COLLECTIONS) {
    const value = allMockData[name];
    if (!value) continue;
    Db.collection(name).removeWhere({ id: "__seed__" });
    Db.collection(name).insert({ id: "__seed__", ...value });
    counts[name] = 1;
  }
  return counts;
}

export function seedDatabase() {
  try {
    if (!needsSeeding()) {
      const meta = Db.collection("_meta").findOne({ id: "seed" });
      return { seeded: false, reason: "already seeded", version: meta?.version || SEED_VERSION };
    }
    const counts = seedData();
    markSeeded(counts);
    return { seeded: true, version: SEED_VERSION, counts };
  } catch (error) {
    ErrorManager.report(error, { source: "seed", level: "error" });
    return { seeded: false, error: error.message };
  }
}

export function isSeeded() {
  return !!Db.collection("_meta").findOne({ id: "seed" });
}

export const seedService = { seedDatabase, needsSeeding, isSeeded, SEED_VERSION };

export default seedService;
