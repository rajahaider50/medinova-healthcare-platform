/**
 * MediNova — ID generation & unique keys.
 */

let counter = 0;

/** Human-readable sequential id with prefix, e.g. "MED0000142". */
export function seqId(prefix = "ID", min = 7) {
  counter += 1;
  return `${prefix}${String(counter).padStart(min, "0")}`;
}

/** Short unique id. */
export function uid(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
}

/** Monotonic microsecond id for ordering. */
export function mts() {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 6);
  return t + r;
}

/** Generate an error-style id "ERR-2026-00125". */
export function errId() {
  const year = new Date().getFullYear();
  counter += 1;
  return `ERR-${year}-${String(counter).padStart(5, "0")}`;
}

/** Generate a reference id like an invoice. */
export function refId(prefix = "ORD") {
  const d = new Date();
  const y = String(d.getFullYear()).slice(2);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  counter += 1;
  return `${prefix}-${y}${m}-${String(counter).padStart(4, "0")}`;
}

/** Random short token (not for security). */
export function token(len = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  const rnd = new Uint32Array(len);
  crypto.getRandomValues ? crypto.getRandomValues(rnd) : rnd.forEach((_, i) => (rnd[i] = Math.random() * 0xffffffff));
  for (let i = 0; i < len; i++) out += chars[rnd[i] % chars.length];
  return out;
}

/** Random numeric code, e.g. OTP. */
export function otp(len = 6) {
  let out = "";
  for (let i = 0; i < len; i++) out += Math.floor(Math.random() * 10);
  return out;
}

/** Random 8-digit-ish price/integer helper. */
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default { seqId, uid, mts, errId, refId, token, otp, randInt };
