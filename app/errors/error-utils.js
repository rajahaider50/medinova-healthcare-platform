/**
 * MediNova — Error normalization helpers.
 * Converts native errors / strings / events into a structured AppError object.
 */

import { ERROR_TYPES } from "./error-codes.js";
import { SEVERITY } from "./error-levels.js";
import { errId } from "../utils/id.js";
import { isEmail } from "../utils/is.js";

/** Normalize any thrown value into a structured error record. */
export function normalizeError(raw, overrides = {}) {
  const base = raw instanceof Error ? raw : new Error(String(raw || "Unknown error"));
  const stack = base.stack || "";
  const frame = extractFrame(stack);
  const ua = getUa();
  const now = new Date().toISOString();

  return {
    id: overrides.id || errId(),
    type: overrides.type || inferType(base, raw),
    level: overrides.level || inferSeverity(base, raw),
    message: sanitizeMessage(overrides.message || base.message),
    file: overrides.file || frame.file || "",
    function: overrides.function || frame.fn || "",
    line: overrides.line || frame.line || null,
    column: overrides.column || frame.column || null,
    url: window.location.href || "",
    page: overrides.page || currentPage(),
    module: overrides.module || "",
    timestamp: now,
    time: formatTime(now),
    browser: `${ua.browser} ${ua.version}`,
    device: `${ua.platform} / ${ua.os}`,
    userAgent: ua.raw,
    stack: (overrides.stack || stack).split("\n").slice(0, 30).join("\n"),
    retry: overrides.retry !== undefined ? overrides.retry : !!overrides.retryFn,
    retryFn: overrides.retryFn || null,
    details: overrides.details || {},
    meta: overrides.meta || {},
  };
}

/** Convert unknown into a public-safe user message (prod mode). */
export function publicMessage(error) {
  const map = {
    [ERROR_TYPES.NETWORK]: "Network connection problem. Please check your internet and try again.",
    [ERROR_TYPES.OFFLINE]: "You appear to be offline. Check your connection.",
    [ERROR_TYPES.TIMEOUT]: "The request timed out. Please try again.",
    [ERROR_TYPES.AUTH]: "Session expired. Please sign in again.",
    [ERROR_TYPES.PERMISSION]: "You don't have permission to do that.",
    [ERROR_TYPES.NOT_FOUND]: "We couldn't find what you were looking for.",
    [ERROR_TYPES.STORAGE]: "Could not access local data. Please clear site data and reload.",
    [ERROR_TYPES.VALIDATION]: "Please check the highlighted fields and try again.",
    [ERROR_TYPES.UPLOAD]: "The file could not be uploaded. Try a different file.",
    [ERROR_TYPES.IMAGE]: "This image could not be loaded.",
    [ERROR_TYPES.SERVER]: "Something went wrong on our side. Please try again.",
  };
  return map[error?.type] || "Something went wrong. Please try again.";
}

/** Build a safe, readable "error summary" for logging. */
export function summary(error) {
  return `${error?.level?.toUpperCase()} [${error?.id}] ${error?.type} — ${error?.message}`;
}

function inferType(error, raw) {
  if (raw instanceof TypeError) return ERROR_TYPES.JS;
  if (raw instanceof Promise) return ERROR_TYPES.PROMISE;
  if (raw && raw.isNetworkError) return ERROR_TYPES.NETWORK;
  if (raw && raw.isAuthError) return ERROR_TYPES.AUTH;
  if (raw && raw.isValidationError) return ERROR_TYPES.VALIDATION;
  if (/failed to fetch|networkerror|load failed/i.test(error.message)) return ERROR_TYPES.NETWORK;
  if (/timeout|timed out/i.test(error.message)) return ERROR_TYPES.TIMEOUT;
  if (/session|unauthorized|not authorized/i.test(error.message)) return ERROR_TYPES.AUTH;
  return ERROR_TYPES.RUNTIME;
}

function inferSeverity(error, raw) {
  if (raw && raw.isCritical) return SEVERITY.CRITICAL;
  if (raw && raw.isWarning) return SEVERITY.WARNING;
  if (/critical|fatal|uncaught|unhandled/i.test(error.message)) return SEVERITY.CRITICAL;
  return SEVERITY.ERROR;
}

/** Extract file/fn/line from a stack string. */
export function extractFrame(stack) {
  if (!stack) return { file: "", fn: "", line: null, column: null };
  const lines = stack.split("\n").slice(1);
  for (const line of lines) {
    const m =
      line.match(/at\s+([^(]*?)\s*\(?([^()]+\.js):(\d+):(\d+)\)?/) ||
      line.match(/at\s+([^()]+\.js):(\d+):(\d+)/);
    if (m) {
      const fn = (m[1] || "").trim().split(".").pop() || "";
      const file = (m[2] || m[1] || "").split("/").pop();
      return { fn, file, line: Number(m[3] || m[2] || 0), column: Number(m[4] || 0) };
    }
  }
  return { file: "", fn: "", line: null, column: null };
}

/** Sanitize: never leak credentials into messages. */
function sanitizeMessage(msg) {
  let s = String(msg || "").replace(/(password|token|secret|key)[=:"'\s]+[^\s]+/gi, "$1=***");
  if (s.length > 300) s = s.slice(0, 300) + "\u2026";
  return s;
}

function currentPage() {
  const hash = window.location.hash || "#/";
  const path = hash.slice(1);
  return path || "/";
}

function getUa() {
  const raw = navigator.userAgent || "";
  let browser = "Unknown";
  let version = "";
  let os = "Unknown";
  if (/edg\//i.test(raw)) { browser = "Edge"; version = raw.match(/edg\/([\d.]+)/)?.[1]; }
  else if (/firefox\//i.test(raw)) { browser = "Firefox"; version = raw.match(/firefox\/([\d.]+)/)?.[1]; }
  else if (/chrome\//i.test(raw)) { browser = "Chrome"; version = raw.match(/chrome\/([\d.]+)/)?.[1]; }
  else if (/safari\//i.test(raw)) { browser = "Safari"; version = raw.match(/version\/([\d.]+)/)?.[1]; }
  if (/windows/i.test(raw)) os = "Windows";
  else if (/android/i.test(raw)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(raw)) os = "iOS";
  else if (/mac os x/i.test(raw)) os = "macOS";
  else if (/linux/i.test(raw)) os = "Linux";
  return { raw, browser, version, os, platform: navigator.platform || "" };
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toTimeString().slice(0, 8);
}

/** Create a tagged Error with helpers (for services). */
export function createAppError(message, opts = {}) {
  const err = new Error(message);
  err.isNetworkError = opts.type === ERROR_TYPES.NETWORK || opts.network;
  err.isAuthError = opts.type === ERROR_TYPES.AUTH || opts.auth;
  err.isValidationError = opts.type === ERROR_TYPES.VALIDATION || opts.validation;
  err.isCritical = opts.critical;
  err.isWarning = opts.warning;
  err.code = opts.code;
  err.details = opts.details;
  err.retryFn = opts.retryFn;
  return err;
}

export default { normalizeError, publicMessage, summary, extractFrame, createAppError };
