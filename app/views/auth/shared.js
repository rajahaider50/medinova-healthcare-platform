/**
 * MediNova — Auth view helpers.
 * Shared form field builders (professional, no demo shortcuts).
 */

import { h } from "../../utils/html.js";

/** Build a labeled form field. */
export function field({ label, name, type = "text", value = "", placeholder = "", icon = "", required = true, autoComplete = "on", help = "", id = name }) {
  const iconEl = icon ? h("i", { class: `fa-solid fa-${icon} field-icon` }) : null;
  return h("div", { class: "form-group" }, [
    label ? h("label", { class: "form-label", for: id }, label) : null,
    h("div", { class: "field-wrap" }, [
      iconEl,
      h("input", { class: "input", type, name, id, value, placeholder, required, autoComplete }),
    ]),
    help ? h("p", { class: "field-error", style: { color: "var(--text-muted)" } }, help) : null,
  ]);
}

/** Password field with visibility toggle. */
export function passwordField({ label = "Password", name = "password", id = "password", placeholder = "Enter your password", autoComplete = "current-password", help = "" }) {
  const toggleBtn = h("button", {
    class: "field-toggle",
    type: "button",
    "aria-label": "Show password",
    tabindex: "-1",
  }, h("i", { class: "fa-solid fa-eye-slash" }));

  const input = h("input", { class: "input", type: "password", name, id, placeholder, required: true, autoComplete });

  toggleBtn.addEventListener("click", () => {
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    toggleBtn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    toggleBtn.firstChild.className = `fa-solid ${show ? "fa-eye" : "fa-eye-slash"}`;
    input.focus();
  });

  return h("div", { class: "form-group" }, [
    label ? h("label", { class: "form-label", for: id }, label) : null,
    h("div", { class: "field-wrap" }, [input, toggleBtn]),
    help ? h("p", { class: "field-error", style: { color: "var(--text-muted)" } }, help) : null,
  ]);
}

/** Form submit helper: gather FormData into a plain object. */
export function formData(form) {
  const data = {};
  for (const el of form.querySelectorAll("[name]")) {
    const type = el.getAttribute("type");
    if (type === "checkbox") data[el.name] = el.checked;
    else data[el.name] = el.value;
  }
  return data;
}

/** Basic client-side validation helpers. */
export const validators = {
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "")),
  password: (v) => String(v || "").length >= 8,
  required: (v) => String(v || "").trim().length > 0,
  match: (a, b) => a === b,
};

/** Validate a values map against a rule map; returns first error or null. */
export function validate(values, rules, labels) {
  for (const key of Object.keys(rules || {})) {
    const rule = rules[key];
    if (typeof rule === "function") {
      const msg = rule(values[key], values);
      if (msg !== true && msg) return msg;
    } else if (rule) {
      if (!validators[rule](values[key])) {
        return `${labels?.[key] || key} is invalid`;
      }
    }
  }
  return null;
}

export default { field, passwordField, formData, validators, validate };
