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

export default { counts, appointmentsByStatus, recentAppointments, recentOrders };
