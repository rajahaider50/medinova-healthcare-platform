/**
 * MediNova — Dev tool: end-to-end data QA.
 * Run: node scripts/qa.mjs
 *
 * Exercises the real database + service layer the way a user would:
 *   1. seed (empty-by-default)
 *   2. create a doctor, medicine, category, appointment, order, review
 *   3. verify the admin analytics derive from the new records
 *   4. clean up every created record
 *   5. verify the database is back to its pristine seeded state
 *
 * Uses the same Node shim as validate-data.mjs so app modules import cleanly.
 */

import "./dom-shim.mjs";
import { seedService, SEED_VERSION } from "../app/data/seed.js";
import * as Db from "../app/data/db.js";
import * as Admin from "../app/services/AdminDataService.js";

let fails = 0;
const check = (cond, msg) => { if (!cond) { console.error("FAIL:", msg); fails++; } else console.log("PASS:", msg); };

const mkId = (p) => `${p}-qa-${Date.now()}`;
const created = [];

function add(collection, item) {
  const rec = Db.collection(collection).insert(item);
  created.push({ collection, id: rec.id });
  return rec;
}

/* ---------- 1. Seed ---------- */
const seed = seedService.seedDatabase();
check(seed.seeded === true || seed.seeded === false, `seed ran (version=${seed.version || SEED_VERSION})`);
check(Db.collection("users").count({ isBootstrap: true }) === 1, "exactly one bootstrap admin");
check(Db.collection("doctors").count() === 0, "doctors empty after seed");

/* ---------- 2. Create catalog content ---------- */
const category = add("categories", { name: "QA Cardiology", slug: "qa-cardiology", icon: "heart-pulse", description: "Temporary QA category" });
const doctor = add("doctors", {
  name: "Dr. QA Test", slug: "qa-test", specialty: "Cardiologist", specialtyId: "cardiology",
  qualification: "MBBS", experience: 5, fee: 1500, rating: 4.0, reviews: 0,
  status: "active", verified: true, city: "QA City",
  availability: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false },
  timings: [{ day: "Mon", slots: ["10:00 AM"] }],
  services: ["Consultation"], createdAt: new Date().toISOString(),
});
const medicine = add("medicines", {
  name: "QA Tablet", generic: "QAGeneric", brand: "QALab", categoryId: category.id,
  category: category.name, type: "Tablet", strength: "10mg", price: 500, stock: 100,
  uses: ["QA test"], keywords: ["qa"], rating: 0, sold: 0, createdAt: new Date().toISOString(),
});

check(Db.collection("doctors").get(doctor.id)?.name === "Dr. QA Test", "doctor created + retrievable");
check(Db.collection("medicines").get(medicine.id)?.categoryId === category.id, "medicine created + linked to category");

/* ---------- 3. User-facing interactions ---------- */
const user = Db.collection("users").findOne({ isBootstrap: true });
const appointment = add("appointments", {
  patientId: user.id, patientName: user.name, doctorId: doctor.id, doctorName: doctor.name,
  type: "physical", date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  time: "10:00 AM", slot: "10:00 AM", reason: "QA appointment", symptoms: [],
  status: "confirmed", fee: doctor.fee, paymentStatus: "unpaid", createdAt: new Date().toISOString(),
});
const order = add("orders", {
  userId: user.id, items: [{ medicineId: medicine.id, name: medicine.name, qty: 2, price: medicine.price }],
  total: medicine.price * 2, status: "delivered", paymentStatus: "paid", createdAt: new Date().toISOString(),
});
add("reviews", {
  doctorId: doctor.id, userId: user.id, rating: 5, comment: "QA review", status: "approved", createdAt: new Date().toISOString(),
});

check(Db.collection("appointments").count({ doctorId: doctor.id }) === 1, "appointment created");
check(Db.collection("orders").get(order.id)?.total === 1000, "order total computed (2 x 500)");

/* ---------- 4. Admin analytics derive from new records ---------- */
check(Admin.counts().doctors === 1, "admin counts reflect the new doctor");
check(Admin.counts().medicines === 1, "admin counts reflect the new medicine");
check(Admin.appointmentsByStatus().confirmed >= 1, "appointment status breakdown includes confirmed");
check(Admin.popularMedicines(5).some((m) => m.name === "QA Tablet"), "popular medicines derived from sales");
check(Admin.revenueSeries(12).reduce((a, b) => a + b.value, 0) >= 1000, "revenue series includes the QA order");
check(Admin.weeklyActivity().some((d) => d.value > 0), "weekly activity reflects appointments/orders");

/* ---------- 5. Cleanup ---------- */
for (const { collection, id } of created.reverse()) {
  Db.collection(collection).remove(id);
}
check(Db.collection("doctors").count() === 0, "all QA doctors cleaned up");
check(Db.collection("medicines").count() === 0, "all QA medicines cleaned up");
check(Db.collection("appointments").count() === 0, "all QA appointments cleaned up");
check(Db.collection("orders").count() === 0, "all QA orders cleaned up");
check(Db.collection("reviews").count() === 0, "all QA reviews cleaned up");
check(Db.collection("categories").count() === 0, "all QA categories cleaned up");
check(Db.collection("users").count({ isBootstrap: true }) === 1, "bootstrap admin preserved after cleanup");

if (fails === 0) console.log("\nQA FLOW PASSED");
else { console.error(`\n${fails} QA check(s) failed`); process.exit(1); }
