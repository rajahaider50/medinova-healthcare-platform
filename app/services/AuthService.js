/**
 * MediNova — AuthService.
 * Session management, login/register (demo-mode auth), roles & permissions.
 * Isolated mock auth — swap-ready for a real backend.
 */

import { STORAGE_KEYS, IS_DEV } from "../config/app.config.js";
import * as Storage from "./StorageService.js";
import * as Db from "../data/db.js";
import * as Log from "./LogService.js";
import { uid, token } from "../utils/id.js";
import { createAppError } from "../errors/error-utils.js";

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  DOCTOR: "doctor",
  PHARMACIST: "pharmacist",
  SUPPORT: "support",
  EDITOR: "editor",
  MANAGER: "manager",
  USER: "user",
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.ADMIN]: "Admin",
  [ROLES.DOCTOR]: "Doctor",
  [ROLES.PHARMACIST]: "Pharmacist",
  [ROLES.SUPPORT]: "Support Agent",
  [ROLES.EDITOR]: "Editor",
  [ROLES.MANAGER]: "Manager",
  [ROLES.USER]: "Patient",
};

/** Permission matrix (module -> actions per role). */
const PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: "*",
  [ROLES.ADMIN]: { "*": ["view", "create", "edit", "delete", "export", "import", "approve", "manage", "settings"] },
  [ROLES.MANAGER]: { "*": ["view", "create", "edit", "export", "approve"] },
  [ROLES.DOCTOR]: {
    appointments: ["view", "manage"], prescriptions: ["view", "create", "edit"],
    patients: ["view"], messages: ["view", "create"], records: ["view", "create"],
  },
  [ROLES.PHARMACIST]: {
    medicines: ["view", "edit", "manage"], orders: ["view", "manage"],
    categories: ["view"], inventory: ["view", "edit"],
  },
  [ROLES.SUPPORT]: {
    tickets: ["view", "manage"], users: ["view"], messages: ["view", "create"],
  },
  [ROLES.EDITOR]: { cms: ["view", "edit"], settings: ["view"], banners: ["view", "edit"] },
  [ROLES.USER]: {
    profile: ["view", "edit"], appointments: ["view", "create", "edit", "delete"],
    prescriptions: ["view", "export"], records: ["view", "create", "delete"],
    orders: ["view", "create"], messages: ["view", "create"], notifications: ["view"],
    support: ["view", "create"],
  },
};

/** Current session. */
export function session() {
  return Storage.get(STORAGE_KEYS.session, null);
}

/** Current logged-in user (from session). */
export function currentUser() {
  const s = session();
  if (!s) return null;
  return Db.collection("users").get(s.userId) || s.user;
}

/** Is someone logged in? */
export function isAuthed() {
  return !!session();
}

/** Create a session from a user record. */
export function createSession(user, remember = true) {
  const s = {
    userId: user.id,
    role: user.role || ROLES.USER,
    token: token(24),
    createdAt: new Date().toISOString(),
    device: navigator.userAgent || "",
  };
  const store = remember ? localStorage : sessionStorage;
  try { store.setItem("mn:" + STORAGE_KEYS.session, JSON.stringify(s)); } catch { /* ignore */ }
  Storage.set(STORAGE_KEYS.session, s);
  return s;
}

/** Login by email + password (real accounts only). */
export function login(email, password) {
  const norm = String(email || "").trim().toLowerCase();
  if (!norm || !password) {
    throw createAppError("Enter your email and password", { type: "validation", validation: true });
  }

  // Local registered users
  const user = Db.collection("users").findOne({ email: norm });
  if (!user) throw createAppError("No account found with this email", { type: "auth", auth: true, code: 404 });
  if (user.status === "suspended" || user.status === "disabled") {
    throw createAppError("This account is disabled", { type: "permission", auth: true, code: 403 });
  }
  if (user.password !== hash(password)) {
    throw createAppError("Invalid credentials", { type: "auth", auth: true, code: 401 });
  }
  const s = createSession(user);
  Log.login(user.name, { actorId: user.id, role: user.role });
  return { user, session: s };
}

/** Register a new patient user. */
export function register({ name, email, password, phone = "", ...rest }) {
  const norm = String(email || "").trim().toLowerCase();
  const existing = Db.collection("users").findOne({ email: norm });
  if (existing) throw createAppError("An account with this email already exists", { type: "validation", validation: true });
  const user = Db.collection("users").insert({
    id: uid("u"),
    name: name?.trim(),
    email: norm,
    phone,
    role: ROLES.USER,
    password: hash(password),
    status: "active",
    createdAt: new Date().toISOString(),
    ...rest,
  });
  Log.register(user.name, { actorId: user.id, role: user.role });
  return { user, session: createSession(user) };
}

/** Logout current session. */
export function logout() {
  const u = currentUser();
  Storage.remove(STORAGE_KEYS.session);
  if (u) Log.logout(u.name, { actorId: u.id, role: u.role });
  try { localStorage.removeItem("mn:" + STORAGE_KEYS.session); sessionStorage.removeItem("mn:" + STORAGE_KEYS.session); } catch { /* ignore */ }
  return true;
}

/** Request password reset (demo flow returns a reset token). */
export function requestPasswordReset(email) {
  const user = Db.collection("users").findOne({ email: String(email || "").trim().toLowerCase() });
  if (!user) return { ok: false, message: "If this email exists, a reset link has been sent." };
  const resetToken = token(12);
  Db.collection("users").update(user.id, { resetToken });
  return { ok: true, message: "Reset link sent (demo).", token: resetToken, email: user.email };
}

/** Reset password with token. */
export function resetPassword(token, newPassword) {
  const user = Db.collection("users").findOne({ resetToken: token });
  if (!user) throw createAppError("Invalid or expired reset token", { type: "auth", auth: true });
  Db.collection("users").update(user.id, { password: hash(newPassword), resetToken: null });
  return true;
}

/** Change password for current user. */
export function changePassword(currentPw, newPw) {
  const u = currentUser();
  if (!u) throw createAppError("Not authenticated", { type: "auth", auth: true });
  if (u.password !== hash(currentPw)) throw createAppError("Current password is incorrect", { type: "validation", validation: true });
  Db.collection("users").update(u.id, { password: hash(newPw) });
  return true;
}

/** Simple demo hash (not for production — clearly isolated mock auth). */
export function hash(value) {
  let h = 5381;
  const s = String(value || "");
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return "h" + (h >>> 0).toString(36);
}

/** Role helpers. */
export function isAdmin(role) {
  return role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN;
}
export function canAccess(role, module, action = "view") {
  if (!role) return false;
  if (PERMISSIONS[role] === "*") return true;
  const perms = PERMISSIONS[role] || {};
  if (perms["*"] === "*") return true;
  const mod = perms[module];
  if (!mod) return false;
  if (mod === "*") return true;
  return mod.includes(action);
}

/** Permission summary for a role (used in role editor). */
export function permissionMap(role) {
  return PERMISSIONS[role] === "*" ? { all: true } : PERMISSIONS[role] || {};
}

/** List of app modules with labels (used by role/permission UI). */
export const MODULES = [
  { id: "dashboard", label: "Dashboard" },
  { id: "users", label: "Users" },
  { id: "patients", label: "Patients" },
  { id: "doctors", label: "Doctors" },
  { id: "medicines", label: "Medicines" },
  { id: "categories", label: "Categories" },
  { id: "inventory", label: "Inventory" },
  { id: "appointments", label: "Appointments" },
  { id: "prescriptions", label: "Prescriptions" },
  { id: "records", label: "Medical Records" },
  { id: "reports", label: "Lab Reports" },
  { id: "orders", label: "Orders" },
  { id: "payments", label: "Payments" },
  { id: "messages", label: "Messages" },
  { id: "notifications", label: "Notifications" },
  { id: "tickets", label: "Support Tickets" },
  { id: "cms", label: "CMS" },
  { id: "settings", label: "Settings" },
  { id: "security", label: "Security" },
  { id: "logs", label: "Logs" },
  { id: "analytics", label: "Analytics" },
  { id: "profile", label: "Profile" },
  { id: "support", label: "Support" },
];

export const ACTIONS = ["view", "create", "edit", "delete", "export", "import", "approve", "manage", "settings"];

export default { ROLES, ROLE_LABELS, PERMISSIONS, MODULES, ACTIONS, session, currentUser, isAuthed, login, register, logout, requestPasswordReset, resetPassword, changePassword, isAdmin, canAccess, permissionMap, createSession };
