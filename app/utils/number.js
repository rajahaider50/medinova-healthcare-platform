/**
 * MediNova — Number helpers.
 */

/** Clamp a number between min and max. */
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/** Round to precision. */
export function round(value, precision = 0) {
  const f = Math.pow(10, precision);
  return Math.round(value * f) / f;
}

/** Percentage of total. */
export function pct(part, total) {
  if (!total) return 0;
  return (part / total) * 100;
}

/** Average of numbers. */
export function avg(arr) {
  if (!Array.isArray(arr) || !arr.length) return 0;
  return arr.reduce((a, b) => a + toNumSafe(b), 0) / arr.length;
}

/** Sum of numbers. */
export function sum(arr) {
  if (!Array.isArray(arr)) return 0;
  return arr.reduce((a, b) => a + toNumSafe(b), 0);
}

/** Min & max of array. */
export function minMax(arr) {
  if (!Array.isArray(arr) || !arr.length) return [0, 0];
  return [Math.min(...arr), Math.max(...arr)];
}

/** Random number in range. */
export function random(min, max) {
  return Math.random() * (max - min) + min;
}

/** Integer random in range inclusive. */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Safe numeric parse helper. */
function toNumSafe(v) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

/** To a fixed number with 2 decimals as string. */
export function fixed2(value) {
  return toNumSafe(value).toFixed(2);
}

/** Discounted price: price - (price * discountPct / 100). */
export function discounted(price, discountPct) {
  const p = toNumSafe(price);
  const d = toNumSafe(discountPct);
  if (!d) return p;
  return round(p - (p * d) / 100, 2);
}

/** Tax addition. */
export function withTax(amount, taxPct = 0) {
  return round(toNumSafe(amount) * (1 + toNumSafe(taxPct) / 100), 2);
}

export default { clamp, round, pct, avg, sum, minMax, random, randomInt, fixed2, discounted, withTax };
