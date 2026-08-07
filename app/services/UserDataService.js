/**
 * MediNova — User dashboard data helpers.
 * Reads logged-in user's data from the seeded store.
 */

import * as Db from "../data/db.js";
import { currentUser } from "./AuthService.js";

export function myId() {
  return currentUser()?.id || "u-1001";
}

export function myAppointments() {
  return Db.collection("appointments").find({ patientId: myId() });
}

export function myPrescriptions() {
  return Db.collection("prescriptions").find({ patientId: myId() });
}

export function myOrders() {
  return Db.collection("orders").find({ userId: myId() });
}

export function myNotifications() {
  return Db.collection("notifications").find({ userId: myId() });
}

export function myConversations() {
  return Db.collection("conversations").find({ patientId: myId() });
}

export function myRecords() {
  return Db.collection("records").find({ patientId: myId() });
}

export function myReports() {
  return Db.collection("reports").find({ patientId: myId() });
}

export function upcomingAppointments(limit = 3) {
  const today = new Date().toISOString().slice(0, 10);
  const list = myAppointments()
    .filter((a) => a.status === "confirmed" || a.status === "pending")
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  return list.filter((a) => a.date >= today).slice(0, limit);
}

export function unreadNotifications() {
  return myNotifications().filter((n) => !n.read).length;
}

export default {
  myId, myAppointments, myPrescriptions, myOrders, myNotifications,
  myConversations, myRecords, myReports, upcomingAppointments, unreadNotifications,
};
