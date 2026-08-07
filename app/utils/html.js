/**
 * MediNova — DOM/HTML utilities.
 * Hyperscript + safe template helpers used by every view.
 */

/**
 * Hyperscript: create an element from tag + props + children.
 * @param {string|Function} tag element name or component fn returning a Node
 * @param {object} [props]
 * @param {...any} children text / node / array / null / false
 * @returns {HTMLElement}
 */
export function h(tag, props, ...children) {
  if (typeof tag === "function") {
    const node = tag(props || {}, ...children);
    return node;
  }
  const el = document.createElement(tag);
  applyProps(el, props);
  appendChildren(el, children);
  return el;
}

/** Alias of h() */
export const el = h;

/** Create an element from a string tag (no hyperscript children). */
export function tag(name, props) {
  const node = document.createElement(name);
  applyProps(node, props);
  return node;
}

function applyProps(node, props) {
  if (!props) return;
  for (const key of Object.keys(props)) {
    const value = props[key];
    if (value == null || value === false) continue;

    if (key === "class" || key === "className") {
      node.className = value;
    } else if (key === "style" && typeof value === "object") {
      Object.assign(node.style, value);
    } else if (key === "html") {
      node.innerHTML = value;
    } else if (key === "dataset") {
      Object.assign(node.dataset, value);
    } else if (key === "value") {
      node.value = value;
    } else if (key === "checked") {
      node.checked = !!value;
    } else if (key === "selected") {
      node.selected = !!value;
    } else if (key === "disabled") {
      node.disabled = !!value;
    } else if (key === "ref") {
      value(node);
    } else if (key.startsWith("on") && key.length > 2 && typeof value === "function") {
      const evt = key.slice(2).toLowerCase();
      node.addEventListener(evt, value);
    } else if (key === "textContent" || key === "text") {
      node.textContent = value;
    } else if (key === "dataset") {
      Object.assign(node.dataset, value);
    } else {
      node.setAttribute(key, value);
    }
  }
}

function appendChildren(node, children) {
  for (const child of flatten(children)) {
    if (child == null || child === false || child === true) continue;
    if (typeof child === "string" || typeof child === "number") {
      node.appendChild(document.createTextNode(String(child)));
    } else if (child instanceof Node) {
      node.appendChild(child);
    } else if (Array.isArray(child)) {
      appendChildren(node, child);
    }
  }
}

function flatten(arr) {
  return arr.reduce((acc, item) => {
    return acc.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}

/** Escape HTML entities. */
export function escape(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Tagged template producing an HTML string (values escaped). */
export function html(strings, ...values) {
  let out = "";
  for (let i = 0; i < strings.length; i++) {
    out += strings[i];
    if (i < values.length) {
      const v = values[i];
      if (Array.isArray(v)) out += v.map((x) => escape(x)).join("");
      else out += escape(v == null ? "" : v);
    }
  }
  return out;
}

/** Build a DocumentFragment from nodes. */
export function frag(...nodes) {
  const f = document.createDocumentFragment();
  appendChildren(f, flatten(nodes));
  return f;
}

/** Replace element's children. */
export function setChildren(node, ...children) {
  node.replaceChildren(frag(...children));
  return node;
}

/** Empty an element. */
export function clear(node) {
  node.replaceChildren();
  return node;
}

/**
 * Create element from an HTML string.
 * @param {string} markup
 * @returns {HTMLElement}
 */
export function create(markup) {
  const tpl = document.createElement("template");
  tpl.innerHTML = markup.trim();
  return tpl.content.firstElementChild;
}

/** Create several elements from an HTML string. */
export function createAll(markup) {
  const tpl = document.createElement("template");
  tpl.innerHTML = markup.trim();
  return Array.from(tpl.content.children);
}

/** Move focus into an element and scroll it into view (a11y helper). */
export function focusFirst(node) {
  if (!node) return;
  const focusables = node.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusables.length) focusables[0].focus();
  else node.setAttribute("tabindex", "-1"), node.focus();
}

export default { h, el, tag, html, escape, frag, setChildren, clear, create, createAll, focusFirst };
