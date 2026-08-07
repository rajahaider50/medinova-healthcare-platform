/**
 * MediNova — Type / value checks.
 */

/** Is the value an empty string / null / undefined / empty array / empty object? */
export function isEmpty(value) {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof Date) return isNaN(value.getTime());
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

/** Is it a plain object? */
export function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

/** Is it a valid email? */
export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || ""));
}

/** Is it a valid phone (digits 7-15)? */
export function isPhone(value) {
  return /^\+?[\d\s-]{7,15}$/.test(String(value || ""));
}

/** Is it a valid URL? */
export function isUrl(value) {
  try {
    const u = new URL(String(value));
    return /^https?:$/.test(u.protocol);
  } catch {
    return false;
  }
}

/** Is it a valid date string / date? */
export function isDate(value) {
  if (value instanceof Date) return !isNaN(value.getTime());
  if (typeof value === "string") return !isNaN(new Date(value).getTime());
  return false;
}

/** Is a number integer? */
export function isInt(value) {
  return Number.isInteger(Number(value));
}

/** Is a number positive? */
export function isPositive(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
}

/** In range check. */
export function inRange(value, min, max) {
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max;
}

/** Length between bounds. */
export function lenBetween(value, min, max) {
  const s = String(value || "");
  return s.length >= min && s.length <= max;
}

/** Has required keys. */
export function hasKeys(obj, keys) {
  return Array.isArray(keys) && keys.every((k) => obj && Object.prototype.hasOwnProperty.call(obj, k) && obj[k] != null && obj[k] !== "");
}

/** Is valid password (>= 8 chars, letter + number). */
export function isStrongPassword(value, min = 8) {
  const s = String(value || "");
  return s.length >= min && /[A-Za-z]/.test(s) && /\d/.test(s);
}

export default { isEmpty, isPlainObject, isEmail, isPhone, isUrl, isDate, isInt, isPositive, inRange, lenBetween, hasKeys, isStrongPassword };
