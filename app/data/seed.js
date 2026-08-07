/**
 * MediNova — Seed service (empty-by-default).
 *
 * The application starts EMPTY: no doctors, medicines, appointments, orders,
 * patients, records, prescriptions, reviews or notifications. Business data
 * is created manually by admins (or by the QA agent for testing) only.
 *
 * First-run seeding writes ONLY:
 *   1. A bootstrap admin account (so the admin panel can be entered).
 *   2. Default editable platform settings (brand, contact, toggles).
 *   3. Default CMS page content templates (editable by the admin).
 *
 * Any previously seeded demo data (older versions) is wiped on reseed.
 */

import Db from "./db.js";
import { DEFAULT_SETTINGS, DEFAULT_PAGES } from "./defaults.js";
import { uid } from "../utils/id.js";
import { hash } from "../services/AuthService.js";
import * as ErrorManager from "../errors/ErrorManager.js";

export const SEED_VERSION = "2.0.0";

/** Bootstrap super admin — the only account created on a fresh install. */
export const BOOTSTRAP_ADMIN = {
  email: "admin@medinova.app",
  password: "Admin@123",
  name: "MediNova Admin",
  role: "admin",
};

/** Collections that must always exist (empty by default). */
export const BUSINESS_COLLECTIONS = [
  "patients", "doctors", "medicines", "categories", "appointments",
  "prescriptions", "records", "reports", "orders", "notifications",
  "messages", "conversations", "tickets", "reviews", "coupons",
  "payments", "banners", "slots", "cart", "faqs", "analytics",
];

export function needsSeeding() {
  const meta = Db.collection("_meta").findOne({ id: "seed" });
  return !meta || meta.version !== SEED_VERSION;
}

function markSeeded(counts) {
  Db.collection("_meta").removeWhere({ id: "seed" });
  Db.collection("_meta").insert({ id: "seed", version: SEED_VERSION, seededAt: new Date().toISOString(), counts });
}

/** Reset all business collections so no demo data survives. */
function clearBusinessData() {
  for (const name of BUSINESS_COLLECTIONS) {
    Db.collection(name).clear();
  }
}

function seedBootstrapAdmin() {
  const col = Db.collection("users");
  const existing = col.findOne({ email: BOOTSTRAP_ADMIN.email });
  if (existing) return { inserted: false, count: 1 };
  col.insert({
    id: uid("u"),
    name: BOOTSTRAP_ADMIN.name,
    email: BOOTSTRAP_ADMIN.email,
    phone: "",
    role: BOOTSTRAP_ADMIN.role,
    password: hash(BOOTSTRAP_ADMIN.password),
    status: "active",
    isBootstrap: true,
    createdAt: new Date().toISOString(),
  });
  return { inserted: true, count: 1 };
}

function seedObject(collectionName, value) {
  Db.collection(collectionName).removeWhere({ id: "__seed__" });
  Db.collection(collectionName).insert({ id: "__seed__", ...value });
}

function seedData() {
  const counts = { users: 0 };

  clearBusinessData();

  const admin = seedBootstrapAdmin();
  counts.users = admin.count;

  seedObject("platformSettings", DEFAULT_SETTINGS);
  seedObject("cms", { pages: DEFAULT_PAGES });

  counts.platformSettings = 1;
  counts.cms = 1;
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
    ErrorManager.report(error, { source: "seed", level: "error", type: "db" });
    return { seeded: false, error: error.message };
  }
}

export function isSeeded() {
  return !!Db.collection("_meta").findOne({ id: "seed" });
}

/** Wipe everything back to a pristine empty install. */
export function factoryReset() {
  try {
    for (const name of Db.COLLECTIONS) {
      if (name === "_meta") continue;
      Db.collection(name).clear();
    }
    Db.collection("_meta").removeWhere({ id: "seed" });
    return seedDatabase();
  } catch (error) {
    ErrorManager.report(error, { source: "seed", level: "error", type: "db" });
    return { seeded: false, error: error.message };
  }
}

export const seedService = { seedDatabase, needsSeeding, isSeeded, factoryReset, SEED_VERSION };

export default seedService;
