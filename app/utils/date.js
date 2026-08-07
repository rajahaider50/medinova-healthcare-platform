/**
 * MediNova — Date & time utilities.
 */

/** Format a Date/ISO string with given options. */
export function formatDate(date, opts = {}) {
  const d = toDate(date);
  if (!d) return "";
  return new Intl.DateTimeFormat(opts.locale || undefined, {
    year: opts.year ?? "numeric",
    month: opts.month ?? "short",
    day: opts.day ?? "numeric",
    ...opts,
  }).format(d);
}

/** Full date e.g. "Aug 7, 2026". */
export function fullDate(date) {
  return formatDate(date, { month: "short", day: "numeric", year: "numeric" });
}

/** Long date e.g. "Friday, August 7, 2026". */
export function longDate(date) {
  return formatDate(date, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

/** Time e.g. "14:32" -> "02:32 PM". */
export function formatTime(date, opts = {}) {
  const d = toDate(date);
  if (!d) return "";
  return new Intl.DateTimeFormat(opts.locale || undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

/** Combined datetime. */
export function formatDateTime(date) {
  return `${fullDate(date)} \u00B7 ${formatTime(date)}`;
}

/** Relative time e.g. "5m ago", "2h ago", "3d ago". */
export function timeAgo(date) {
  const d = toDate(date);
  if (!d) return "";
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const intervals = [
    { label: "y", seconds: 31536000 },
    { label: "mo", seconds: 2592000 },
    { label: "w", seconds: 604800 },
    { label: "d", seconds: 86400 },
    { label: "h", seconds: 3600 },
    { label: "m", seconds: 60 },
  ];
  for (const int of intervals) {
    const count = Math.floor(seconds / int.seconds);
    if (count >= 1) return count + int.label + " ago";
  }
  return "just now";
}

/** Short relative: "2h", "5m" (no suffix). */
export function shortAgo(date) {
  const d = toDate(date);
  if (!d) return "";
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return Math.floor(s / 60) + "m";
  if (s < 86400) return Math.floor(s / 3600) + "h";
  return Math.floor(s / 86400) + "d";
}

/** Convert anything to a Date safely. */
export function toDate(date) {
  if (!date) return null;
  if (date instanceof Date) return isNaN(date.getTime()) ? null : date;
  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d;
}

/** Start of today. */
export function startOfDay(date = new Date()) {
  const d = toDate(date) || new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** ISO date part only "YYYY-MM-DD". */
export function isoDate(date = new Date()) {
  const d = toDate(date) || new Date();
  return d.toISOString().slice(0, 10);
}

/** "YYYY-MM-DD" -> Date at local midnight. */
export function fromIso(str) {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/** Add days to a date. */
export function addDays(date, days) {
  const d = toDate(date) || new Date();
  d.setDate(d.getDate() + days);
  return d;
}

/** Add months to a date. */
export function addMonths(date, months) {
  const d = toDate(date) || new Date();
  d.setMonth(d.getMonth() + months);
  return d;
}

/** Is the date today? */
export function isToday(date) {
  const d = toDate(date);
  return !!d && isoDate(d) === isoDate(new Date());
}

/** Is the date in the future? */
export function isFuture(date) {
  const d = toDate(date);
  return !!d && d.getTime() > Date.now();
}

/** Human greeting by hour. */
export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/** Weekday label e.g. "Mon". */
export function weekday(date) {
  const d = toDate(date);
  if (!d) return "";
  return new Intl.DateTimeFormat("en", { weekday: "short" }).format(d);
}

/** Month label e.g. "Aug". */
export function monthLabel(date) {
  const d = toDate(date);
  if (!d) return "";
  return new Intl.DateTimeFormat("en", { month: "short" }).format(d);
}

/** Duration between two dates in ms. */
export function diffMs(a, b) {
  return (toDate(b) || new Date()).getTime() - (toDate(a) || new Date()).getTime();
}

/** Next N days array of Dates starting today. */
export function nextDays(count = 7) {
  const out = [];
  for (let i = 0; i < count; i++) out.push(addDays(new Date(), i));
  return out;
}

export default { formatDate, fullDate, longDate, formatTime, formatDateTime, timeAgo, shortAgo, toDate, startOfDay, isoDate, fromIso, addDays, addMonths, isToday, isFuture, greeting, weekday, monthLabel, diffMs, nextDays };
