/**
 * MediNova — String helpers.
 */

/** First character uppercase. */
export function capitalize(str) {
  if (!str) return "";
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
}

/** Pluralize based on count. */
export function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural || singular + "s";
}

/** Remove all whitespace. */
export function compact(str) {
  return String(str || "").replace(/\s+/g, "");
}

/** Wrap words with a span (for search highlighting). */
export function highlight(text, term, cls = "hl") {
  if (!term || !text) return escape(text);
  const safeTerm = String(term).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return escape(text).replace(
    new RegExp(`(${safeTerm})`, "gi"),
    `<span class="${cls}">$1</span>`
  );
}

/** Check a string contains term (case-insensitive). */
export function contains(text, term) {
  return String(text || "").toLowerCase().includes(String(term || "").toLowerCase());
}

/** Random choice from array. */
export function pick(arr) {
  if (!Array.isArray(arr) || !arr.length) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Alphabetical list of letters for filters. */
export function alphabet() {
  return Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
}

/** Split CSV-like string to array. */
export function splitList(str, sep = ",") {
  if (!str) return [];
  return String(str)
    .split(sep)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Join an array into a readable list: "a, b and c". */
export function readableList(arr) {
  const list = Array.isArray(arr) ? arr.filter(Boolean) : [];
  if (list.length === 0) return "";
  if (list.length === 1) return list[0];
  if (list.length === 2) return `${list[0]} and ${list[1]}`;
  return `${list.slice(0, -1).join(", ")} and ${list[list.length - 1]}`;
}

/** Abbreviate long words list. */
export function truncateList(arr, max = 3) {
  const list = Array.isArray(arr) ? arr : [];
  if (list.length <= max) return readableList(list);
  return `${list.slice(0, max).join(", ")} +${list.length - max}`;
}

/** Remove diacritics. */
export function normalize(str) {
  return String(str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Encode a string for storage (base64). */
export function b64(str) {
  try {
    return btoa(unescape(encodeURIComponent(String(str))));
  } catch {
    return "";
  }
}

/** Decode base64 string. */
export function fromB64(str) {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    return "";
  }
}

export default { capitalize, pluralize, compact, highlight, contains, pick, alphabet, splitList, readableList, truncateList, normalize, b64, fromB64 };
