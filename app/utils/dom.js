/**
 * MediNova — DOM query / document helpers.
 */

/** Query selector shorthand. */
export function qs(selector, root = document) {
  return root.querySelector(selector);
}

/** Query selector all shorthand. */
export function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

/** Attach a one-time DOM-ready callback (or run immediately). */
export function onReady(fn) {
  if (document.readyState !== "loading") fn();
  else document.addEventListener("DOMContentLoaded", fn, { once: true });
}

/** Delegated event binding on a container. */
export function on(root, event, selector, handler) {
  root.addEventListener(event, (e) => {
    const target = e.target.closest(selector);
    if (target) handler.call(target, e, target);
  });
}

/** Remove an element from the DOM. */
export function remove(node) {
  if (node && node.parentNode) node.parentNode.removeChild(node);
}

/** Insert node after a reference element. */
export function after(ref, node) {
  ref.parentNode && ref.parentNode.insertBefore(node, ref.nextSibling);
}

/** Insert node before a reference element. */
export function before(ref, node) {
  ref.parentNode && ref.parentNode.insertBefore(node, ref);
}

/** Toggle a class. */
export function toggleClass(node, cls, force) {
  node.classList.toggle(cls, force);
}

/** Scroll an element into view smoothly. */
export function scrollIntoView(node, opts = {}) {
  node && node.scrollIntoView({ behavior: "smooth", block: "start", ...opts });
}

/** Measure viewport type. */
export function isMobileView() {
  return window.matchMedia("(max-width: 960px)").matches;
}
export function isTabletView() {
  return window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches;
}
export function isDesktopView() {
  return window.matchMedia("(min-width: 961px)").matches;
}

/** Track element resize via ResizeObserver. */
export function onResize(node, fn) {
  if (typeof ResizeObserver === "undefined") {
    window.addEventListener("resize", () => fn(node.clientWidth, node.clientHeight));
    return () => window.removeEventListener("resize", fn);
  }
  const ro = new ResizeObserver(() => fn(node.clientWidth, node.clientHeight));
  ro.observe(node);
  return () => ro.disconnect();
}

/** Get element offset relative to document. */
export function offset(node) {
  const r = node.getBoundingClientRect();
  return {
    top: r.top + window.scrollY,
    left: r.left + window.scrollX,
    width: r.width,
    height: r.height,
  };
}

export default { qs, qsa, onReady, on, remove, after, before, toggleClass, scrollIntoView, isMobileView, isDesktopView };
