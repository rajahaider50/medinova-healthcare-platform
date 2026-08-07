/**
 * MediNova — Formatting utilities (currency, numbers, initials, masks).
 */

/** Format a number with thousand separators. */
export function number(value, digits = 0) {
  const n = toNum(value);
  return n.toLocaleString("en", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

/** Compact number: 1.2k, 3.4M. */
export function compactNumber(value) {
  const n = toNum(value);
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
  return String(Math.round(n));
}

/** Money formatting with currency symbol. */
export function money(value, currency = "Rs") {
  const n = toNum(value);
  const sign = n < 0 ? "-" : "";
  return `${sign}${currency} ${number(Math.abs(n), 0)}`;
}

/** Percentage formatting. */
export function percent(value, digits = 1) {
  return `${toNum(value).toFixed(digits)}%`;
}

/** Safely convert to number. */
export function toNum(value) {
  if (typeof value === "number") return isFinite(value) ? value : 0;
  if (value == null || value === "") return 0;
  const n = parseFloat(String(value).replace(/[^\d.-]/g, ""));
  return isFinite(n) ? n : 0;
}

/** Initials from a name, e.g. "Ali Khan" -> "AK". */
export function initials(name, max = 2) {
  if (!name) return "?";
  return String(name)
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, max)
    .join("")
    .toUpperCase();
}

/** Mask a phone number partially. */
export function maskPhone(phone) {
  if (!phone) return "";
  const s = String(phone);
  if (s.length < 6) return s;
  return s.slice(0, 3) + "***" + s.slice(-3);
}

/** Mask an email address. */
export function maskEmail(email) {
  if (!email) return "";
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const head = name.slice(0, 2) + "***";
  return head + "@" + domain;
}

/** Title case a string. */
export function titleCase(str) {
  if (!str) return "";
  return String(str)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Sentence case. */
export function sentenceCase(str) {
  if (!str) return "";
  const s = String(str).replace(/[_-]+/g, " ").toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Slugify a string for urls/ids. */
export function slugify(str) {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Truncate with ellipsis. */
export function truncate(str, max = 60) {
  if (!str) return "";
  if (str.length <= max) return str;
  return str.slice(0, max - 1).trimEnd() + "\u2026";
}

/** Byte size humanized. */
export function bytes(size) {
  if (size == null || isNaN(size)) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = size;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

/** Phone number with country code e.g. "923001234567" -> "+92 300 1234567". */
export function formatPhone(phone, region = "PK") {
  if (!phone) return "";
  const s = String(phone).replace(/\D/g, "");
  if (region === "PK" && s.startsWith("92") && s.length === 12) {
    return `+92 ${s.slice(2, 5)} ${s.slice(5, 8)} ${s.slice(8)}`;
  }
  if (s.startsWith("92") && s.length === 12) return `+${s}`;
  return String(phone);
}

/** Duration label "10 days" from a number + unit. */
export function durationLabel(value, unit = "day") {
  if (!value) return "";
  const plural = Math.abs(value) === 1 ? unit : unit + "s";
  return `${value} ${plural}`;
}

export default { number, compactNumber, money, percent, toNum, initials, maskPhone, maskEmail, titleCase, sentenceCase, slugify, truncate, bytes, formatPhone, durationLabel };
