/**
 * MediNova — Dev tool: validate data integrity.
 * Run: node scripts/validate-data.mjs
 *
 * 1. Mock data stays intact as a static catalog (demo content source).
 * 2. Constants, defaults and seed templates are structurally sound.
 * 3. Regression guard: NO app module may import from app/data/mock —
 *    the live app is empty-by-default and reads the database/services.
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import "./dom-shim.mjs";
import { SPECIALTIES, TIME_SLOTS, RECORD_TYPES, NOTIFICATION_TYPES, TICKET_CATEGORIES, TICKET_STATUSES, ORDER_STATUS_FLOW, APPOINTMENT_STATUSES, ROLE_OPTIONS, PAYMENT_METHODS } from "../app/config/constants.js";
import { DEFAULT_SETTINGS, DEFAULT_PAGES, PAGE_FIELD_SCHEMAS, DEFAULT_USER_SETTINGS } from "../app/data/defaults.js";
import { SEED_VERSION, BOOTSTRAP_ADMIN, BUSINESS_COLLECTIONS } from "../app/data/seed.js";

import { categories } from "../app/data/mock/categories.js";
import { doctors, specialties, timeSlots } from "../app/data/mock/doctors.js";
import { medicines } from "../app/data/mock/medicines.js";
import { users } from "../app/data/mock/users.js";
import { appointments } from "../app/data/mock/appointments.js";
import { prescriptions } from "../app/data/mock/prescriptions.js";
import { records, reports } from "../app/data/mock/records.js";
import { orders, coupons } from "../app/data/mock/orders.js";
import { notifications } from "../app/data/mock/notifications.js";
import { conversations, messages } from "../app/data/mock/messages.js";
import { tickets, faqs } from "../app/data/mock/tickets.js";
import { reviews } from "../app/data/mock/reviews.js";
import { banners, cms, pages } from "../app/data/mock/cms.js";
import { platformSettings } from "../app/data/mock/settings.js";

let fails = 0;
const check = (cond, msg) => { if (!cond) { console.error("FAIL:", msg); fails++; } };

/* ---------- New app sources (constants / defaults / seed) ---------- */
check(SPECIALTIES.length >= 8, "SPECIALTIES non-empty");
check(TIME_SLOTS.length >= 6, "TIME_SLOTS non-empty");
check(RECORD_TYPES.length >= 5 && RECORD_TYPES.every((r) => r.id && r.label && r.icon), "RECORD_TYPES complete");
check(NOTIFICATION_TYPES.every((n) => n.id && n.label && n.icon && n.tone), "NOTIFICATION_TYPES complete");
check(Array.isArray(TICKET_CATEGORIES) && TICKET_CATEGORIES.includes("technical"), "TICKET_CATEGORIES");
check(Array.isArray(TICKET_STATUSES) && TICKET_STATUSES.includes("open"), "TICKET_STATUSES");
check(ORDER_STATUS_FLOW[0] === "pending" && ORDER_STATUS_FLOW.includes("delivered"), "ORDER_STATUS_FLOW");
check(APPOINTMENT_STATUSES.includes("pending") && APPOINTMENT_STATUSES.includes("cancelled"), "APPOINTMENT_STATUSES");
check(ROLE_OPTIONS.some((r) => r.id === "admin"), "ROLE_OPTIONS");
check(PAYMENT_METHODS.some((p) => p.id === "cash" || p.id === "cod"), "PAYMENT_METHODS");

check(DEFAULT_SETTINGS.brand.name && DEFAULT_SETTINGS.brand.supportEmail && DEFAULT_SETTINGS.brand.accentColor, "DEFAULT_SETTINGS.brand");
check(typeof DEFAULT_SETTINGS.pharmacy.deliveryFee === "number" && typeof DEFAULT_SETTINGS.appointments.slotDuration === "number", "DEFAULT_SETTINGS numbers");
check(Array.isArray(DEFAULT_SETTINGS.security) === false && typeof DEFAULT_SETTINGS.security.sessionTimeoutMin === "number", "DEFAULT_SETTINGS.security");
check(DEFAULT_USER_SETTINGS.profile.name !== undefined && DEFAULT_USER_SETTINGS.preferences.language, "DEFAULT_USER_SETTINGS");

for (const key of Object.keys(PAGE_FIELD_SCHEMAS)) {
  check(DEFAULT_PAGES[key] !== undefined, `PAGE_FIELD_SCHEMAS has fields for missing page '${key}'`);
}
for (const [key, page] of Object.entries(DEFAULT_PAGES)) {
  if (key !== "features" && key !== "footer") {
    check(page.id === key, `page ${key} id matches`);
    check(typeof page.title === "string" && page.title.length > 0, `page ${key} has title`);
  }
}
check(Array.isArray(DEFAULT_PAGES.features) && DEFAULT_PAGES.features.length >= 4, "DEFAULT_PAGES.features");
check(typeof SEED_VERSION === "string" && BOOTSTRAP_ADMIN.email === "admin@medinova.app" && BOOTSTRAP_ADMIN.role === "admin", "seed bootstrap admin");
check(BUSINESS_COLLECTIONS.includes("doctors") && BUSINESS_COLLECTIONS.includes("medicines") && BUSINESS_COLLECTIONS.includes("appointments"), "BUSINESS_COLLECTIONS");

/* ---------- Mock catalog integrity (static demo content) ---------- */
const doctorIds = new Set(doctors.map((d) => d.id));
const userIds = new Set(users.map((u) => u.id));
const catIds = new Set(categories.map((c) => c.id));
const medIds = new Set(medicines.map((m) => m.id));

check(categories.length >= 15, ">=15 categories");
check(doctors.length >= 10, ">=10 doctors");
check(medicines.length >= 30, ">=30 medicines");
check(users.length >= 8, ">=8 users");
check(appointments.length >= 8, ">=8 appointments");
check(prescriptions.length >= 4, ">=4 prescriptions");

for (const m of medicines) check(catIds.has(m.categoryId), `medicine ${m.id} category ${m.categoryId}`);
for (const o of orders) for (const item of o.items) check(medIds.has(item.medicineId), `order ${o.id} item ${item.medicineId}`);
for (const a of appointments) {
  check(userIds.has(a.patientId), `appt ${a.id} patient ${a.patientId}`);
  check(doctorIds.has(a.doctorId), `appt ${a.id} doctor ${a.doctorId}`);
}
for (const p of prescriptions) {
  check(userIds.has(p.patientId), `rx ${p.id} patient`);
  check(doctorIds.has(p.doctorId), `rx ${p.id} doctor`);
}
for (const c of conversations) {
  check(userIds.has(c.patientId), `conv ${c.id} patient`);
  check(doctorIds.has(c.doctorId), `conv ${c.id} doctor`);
}
for (const m of messages) check(conversations.some((c) => c.id === m.conversationId), `msg ${m.id} conv`);
for (const n of notifications) check(userIds.has(n.userId), `ntf ${n.id} user`);
for (const t of tickets) check(userIds.has(t.userId), `tkt ${t.id} user`);
for (const r of reviews) check(doctorIds.has(r.doctorId), `rvw ${r.id} doctor`);
for (const b of banners) check(typeof b.title === "string" && b.title.length > 0, `banner ${b.id}`);
check(specialties.length > 0, "specialties non-empty");
check(timeSlots.length > 0, "timeSlots non-empty");
check(platformSettings.brand.name === "MediNova", "platform brand");
check(cms.hero.title.length > 0 && pages.length >= 5, "cms + pages");

const named = ["doctors", "medicines", "users", "appointments", "prescriptions", "records", "reports", "orders", "coupons", "notifications", "conversations", "messages", "tickets", "faqs", "reviews", "banners"];
const groups = [doctors, medicines, users, appointments, prescriptions, records, reports, orders, coupons, notifications, conversations, messages, tickets, faqs, reviews, banners];
groups.forEach((arr, i) => {
  const seen = new Set();
  for (const x of arr) { if (seen.has(x.id)) { console.error("DUP:", named[i], x.id); fails++; } seen.add(x.id); }
});

/* ---------- Regression: no mock imports in the live app ---------- */
const root = fileURLToPath(new URL("..", import.meta.url));
const appRoot = join(root, "app");
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".js")) {
      const src = readFileSync(p, "utf8");
      if (/from\s+["'][^"']*data\/mock[^"']*["']/.test(src)) {
        check(false, `app module imports mock data: ${p.replace(appRoot, "app")}`);
      }
    }
  }
})(appRoot);

if (fails === 0) console.log("ALL DATA CHECKS PASSED");
else { console.error(fails + " check(s) failed"); process.exit(1); }
