/**
 * MediNova — Admin dashboard data helpers.
 */

import * as Db from "../data/db.js";

export function counts() {
  return {
    users: Db.collection("users").count(),
    doctors: Db.collection("doctors").count(),
    medicines: Db.collection("medicines").count(),
    appointments: Db.collection("appointments").count(),
    orders: Db.collection("orders").count(),
    tickets: Db.collection("tickets").count(),
    categories: Db.collection("categories").count(),
    prescriptions: Db.collection("prescriptions").count(),
  };
}

export function appointmentsByStatus() {
  const all = Db.collection("appointments").all();
  const by = {};
  for (const a of all) by[a.status] = (by[a.status] || 0) + 1;
  return by;
}

export function recentAppointments(limit = 6) {
  return Db.collection("appointments")
    .all()
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
    .slice(0, limit);
}

export function recentOrders(limit = 6) {
  return Db.collection("orders")
    .all()
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
    .slice(0, limit);
}

/** Label + month key for the last `months` months (oldest → newest). */
function monthBuckets(months = 12) {
  const now = new Date();
  const buckets = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("en", { month: "short" }),
    });
  }
  return buckets;
}

function bucketOf(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Monthly revenue (sum of paid/fulfilled order totals) over the last 12 months. */
export function revenueSeries(months = 12) {
  const buckets = monthBuckets(months);
  const byKey = {};
  for (const o of Db.collection("orders").all()) {
    const key = bucketOf(o.createdAt || o.updatedAt);
    if (key && (o.status === "delivered" || o.status === "shipped" || o.paymentStatus === "paid")) {
      byKey[key] = (byKey[key] || 0) + Number(o.total || o.subtotal || 0);
    }
  }
  return buckets.map((b) => ({ ...b, value: byKey[b.key] || 0 }));
}

/** Monthly registered-user counts over the last 12 months. */
export function userGrowth(months = 12) {
  const buckets = monthBuckets(months);
  const byKey = {};
  for (const u of Db.collection("users").all()) {
    const key = bucketOf(u.createdAt);
    if (key) byKey[key] = (byKey[key] || 0) + 1;
  }
  let running = 0;
  return buckets.map((b) => {
    running += byKey[b.key] || 0;
    return { ...b, users: running, appointments: 0 };
  });
}

/** Appointments created per month over the last 12 months. */
export function appointmentSeries(months = 12) {
  const buckets = monthBuckets(months);
  const byKey = {};
  for (const a of Db.collection("appointments").all()) {
    const key = bucketOf(a.createdAt);
    if (key) byKey[key] = (byKey[key] || 0) + 1;
  }
  return buckets.map((b) => ({ ...b, value: byKey[b.key] || 0 }));
}

/** Weekly activity distribution (Mon–Sun) across the last 7 days of records. */
export function weeklyActivity() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const counts = new Array(7).fill(0);
  const now = new Date();
  const weekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  const seen = new Set();
  const stamp = (t) => (t ? new Date(t).getTime() : 0);
  const bump = (ts) => {
    if (!ts || ts < weekAgo || ts > now.getTime()) return;
    const idx = (new Date(ts).getDay() + 6) % 7;
    counts[idx]++;
  };
  for (const col of ["users", "orders", "appointments", "tickets"]) {
    for (const row of Db.collection(col).all()) {
      const key = `${col}-${row.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      bump(stamp(row.createdAt) || stamp(row.updatedAt));
    }
  }
  return days.map((label, i) => ({ label, value: counts[i] }));
}

/** Top-selling medicines by quantity across delivered/shipped orders. */
export function popularMedicines(limit = 5) {
  const tally = new Map();
  for (const o of Db.collection("orders").all()) {
    if (o.status !== "delivered" && o.status !== "shipped") continue;
    for (const item of o.items || []) {
      const entry = tally.get(item.medicineId) || { medicineId: item.medicineId, name: item.name, sales: 0 };
      entry.sales += Number(item.qty || 0);
      tally.set(item.medicineId, entry);
    }
  }
  return Array.from(tally.values()).sort((a, b) => b.sales - a.sales).slice(0, limit);
}

export default { counts, appointmentsByStatus, recentAppointments, recentOrders, revenueSeries, userGrowth, appointmentSeries, weeklyActivity, popularMedicines };
