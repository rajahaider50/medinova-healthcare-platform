/**
 * MediNova — LogService (Activity / Audit logs).
 * Records admin + user actions with actor, module, action and result.
 */

import * as Db from "../data/db.js";
import { STORAGE_KEYS } from "../config/app.config.js";
import * as Storage from "./StorageService.js";

const MAX_LOGS = 300;

/** Append an activity log entry. */
export function log({ actor, actorId, role, module, action, record, result, detail, ip }) {
  const entry = {
    id: "LOG-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    actor: actor || "System",
    actorId: actorId || null,
    role: role || "system",
    module: module || "general",
    action: action || "view",
    record: record || "",
    result: result || "success",
    detail: detail || "",
    ip: ip || "",
    timestamp: new Date().toISOString(),
  };
  try {
    const logs = Db.collection("logs");
    logs.insert(entry);
    const all = logs.all();
    if (all.length > MAX_LOGS) {
      const excess = all.slice(MAX_LOGS);
      for (const e of excess) logs.remove(e.id);
    }
  } catch {
    /* logging must never crash the app */
  }
  return entry;
}

/** Convenience creators. */
export const Actions = {
  login: "login",
  logout: "logout",
  create: "created",
  update: "updated",
  delete: "deleted",
  approve: "approved",
  reject: "rejected",
  export: "exported",
  import: "imported",
  settings: "settings-changed",
  register: "registered",
  book: "booked",
  cancel: "cancelled",
  status: "status-changed",
  verify: "verified",
  suspend: "suspended",
};

export function login(actor, opts = {}) {
  return log({ actor, action: Actions.login, module: "auth", result: "success", ...opts });
}
export function logout(actor, opts = {}) {
  return log({ actor, action: Actions.logout, module: "auth", result: "success", ...opts });
}
export function created(module, record, opts = {}) {
  return log({ module, action: Actions.create, record, result: "success", ...opts });
}
export function updated(module, record, opts = {}) {
  return log({ module, action: Actions.update, record, result: "success", ...opts });
}
export function deleted(module, record, opts = {}) {
  return log({ module, action: Actions.delete, record, result: "success", ...opts });
}
export function settingsChanged(opts = {}) {
  return log({ module: "settings", action: Actions.settings, result: "success", ...opts });
}
export function failed(module, action, detail, opts = {}) {
  return log({ module, action, result: "failed", detail, ...opts });
}

/** Recent logs. */
export function recent(limit = 30) {
  return Db.collection("logs").find({}, "-timestamp").slice(0, limit);
}

/** Logs by module. */
export function byModule(module, limit = 100) {
  return Db.collection("logs").find({ module }, "-timestamp").slice(0, limit);
}

/** All logs. */
export function all() {
  return Db.collection("logs").find({}, "-timestamp");
}

/** Clear logs. */
export function clearLogs() {
  Db.collection("logs").clear();
}

/** Export logs to JSON. */
export function exportJson() {
  return JSON.stringify(all(), null, 2);
}

export default { log, login, logout, created, updated, deleted, settingsChanged, failed, recent, byModule, all, clearLogs, exportJson, Actions };
