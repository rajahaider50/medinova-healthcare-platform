/**
 * MediNova — Component base.
 * Minimal helper for light-DOM custom elements using global design-system classes.
 */

/**
 * Define a custom element with automatic re-render on observed attribute change.
 * @param {string} tag
 * @param {typeof HTMLElement} klass
 */
export function define(tag, klass) {
  if (!customElements.get(tag)) customElements.define(tag, klass);
}

/**
 * Resolve slots/properties against attributes, with defaults.
 * @param {HTMLElement} el
 * @param {object} defs { propName: default }
 */
export function props(el, defs) {
  const out = {};
  for (const [key, def] of Object.entries(defs)) {
    const attr = el.getAttribute(key);
    out[key] = attr == null ? def : attr;
  }
  return out;
}

/** Boolean attribute read helper. */
export function bool(el, name) {
  return el.hasAttribute(name) && el.getAttribute(name) !== "false";
}

export default { define, props, bool };
