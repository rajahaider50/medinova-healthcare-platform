/**
 * MediNova — Dev tool: validate mock data integrity.
 * Run: node scripts/validate-data.mjs
 */

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

const doctorIds = new Set(doctors.map(d => d.id));
const userIds = new Set(users.map(u => u.id));
const catIds = new Set(categories.map(c => c.id));
const medIds = new Set(medicines.map(m => m.id));

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
for (const m of messages) check(conversations.some(c => c.id === m.conversationId), `msg ${m.id} conv`);
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

if (fails === 0) console.log("ALL DATA CHECKS PASSED");
else { console.error(fails + " check(s) failed"); process.exit(1); }
