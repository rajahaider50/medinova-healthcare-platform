/**
 * MediNova — Keyboard shortcuts & accessibility helpers.
 */

/** Register a global keydown handler and return an off() function. */
export function onKey(key, handler, opts = {}) {
  const fn = (e) => {
    const k = e.key;
    const match = Array.isArray(key) ? key.includes(k) : k === key;
    if (!match) return;
    const target = e.target;
    const isTyping =
      target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) && !opts.includeInputs;
    if (isTyping) return;
    if (opts.ctrl && !(e.ctrlKey || e.metaKey)) return;
    if (!opts.ctrl && (e.ctrlKey || e.metaKey || e.altKey)) return;
    if (opts.preventDefault !== false) e.preventDefault();
    handler(e);
  };
  document.addEventListener("keydown", fn);
  return () => document.removeEventListener("keydown", fn);
}

/** Map of common shortcuts. */
export function shortcutMap() {
  return {
    "/": "Focus global search",
    g: "Open dashboard (then d)",
    "?" : "Show keyboard shortcuts",
    Escape: "Close dialogs",
    "ctrl+k": "Global search",
    "ctrl+b": "Toggle sidebar",
  };
}

/** Escape handler for closing modals. */
export function onEscape(handler) {
  return onKey("Escape", handler);
}

/** Handle arrow-key navigation over a list of focusables. */
export function setupArrowNav(container, itemSelector) {
  const fn = (e) => {
    if (!["ArrowDown", "ArrowUp"].includes(e.key)) return;
    const items = Array.from(container.querySelectorAll(itemSelector + ":not([hidden])"));
    if (!items.length) return;
    const idx = items.indexOf(document.activeElement);
    let next;
    if (e.key === "ArrowDown") next = idx + 1 < items.length ? idx + 1 : 0;
    else next = idx - 1 >= 0 ? idx - 1 : items.length - 1;
    e.preventDefault();
    items[next].focus();
  };
  container.addEventListener("keydown", fn);
  return () => container.removeEventListener("keydown", fn);
}

/** Announce a message to screen readers. */
export function announce(message, polite = true) {
  let node = document.querySelector("#aria-live-region");
  if (!node) {
    node = document.createElement("div");
    node.id = "aria-live-region";
    node.className = "sr-only";
    node.setAttribute("aria-live", polite ? "polite" : "assertive");
    document.body.appendChild(node);
  }
  node.textContent = "";
  requestAnimationFrame(() => {
    node.textContent = message;
  });
}

export default { onKey, shortcutMap, onEscape, setupArrowNav, announce };
