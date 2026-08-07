/**
 * MediNova — Debounce / throttle / timing helpers.
 */

/** Debounce a function call. */
export function debounce(fn, wait = 250, immediate = false) {
  let timeout;
  return function (...args) {
    const call = () => fn.apply(this, args);
    if (immediate && !timeout) call();
    clearTimeout(timeout);
    timeout = setTimeout(call, wait);
  };
}

/** Throttle leading edge. */
export function throttle(fn, limit = 250) {
  let last = 0;
  let pending = null;
  return function (...args) {
    const now = Date.now();
    const remaining = limit - (now - last);
    const ctx = this;
    if (remaining <= 0) {
      last = now;
      fn.apply(ctx, args);
    } else if (!pending) {
      pending = setTimeout(() => {
        last = Date.now();
        pending = null;
        fn.apply(ctx, args);
      }, remaining);
    }
  };
}

/** Run fn only after `times` consecutive calls (for multi-error batching). */
export function after(times, fn) {
  let count = 0;
  return (...args) => {
    count += 1;
    if (count >= times) return fn(...args);
    return null;
  };
}

/** Chain promises with a delay between them. */
export async function paced(items, delay = 50) {
  const out = [];
  for (const item of items) {
    out.push(await Promise.resolve(typeof item === "function" ? item() : item));
    if (delay) await sleep(delay);
  }
  return out;
}

/** Query parameter builder from object. */
export function qs(params) {
  const sp = new URLSearchParams();
  for (const k of Object.keys(params || {})) {
    const v = params[k];
    if (v == null || v === "") continue;
    if (Array.isArray(v)) v.forEach((x) => sp.append(k, x));
    else sp.append(k, v);
  }
  const s = sp.toString();
  return s ? "?" + s : "";
}

export default { debounce, throttle, after, paced, qs };
