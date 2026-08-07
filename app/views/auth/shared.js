/**
 * MediNova — Auth view helpers.
 * Shared form field builders + demo credential chips.
 */

import { h } from "../../utils/html.js";
import { DEMO_ACCOUNTS } from "../../config/app.config.js";

/** Build a labeled form field. */
export function field({ label, name, type = "text", value = "", placeholder = "", icon = "", required = true, autoComplete = "on", help = "" }) {
  const iconEl = icon ? h("i", { class: `fa-solid fa-${icon} field-icon` }) : null;
  return h("div", { class: "form-group" }, [
    label ? h("label", { class: "form-label", for: name }, label) : null,
    h("div", { class: "field-wrap" }, [
      iconEl,
      h("input", { class: "input", type, name, id: name, value, placeholder, required, autoComplete }),
    ]),
    help ? h("p", { class: "field-error", style: { color: "var(--text-muted)" } }, help) : null,
  ]);
}

/** Demo account quick-fill chips. */
export function demoChips(onSelect) {
  return h("div", { class: "demo-chips", style: { display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" } }, [
    h("span", { style: { fontSize: "12px", color: "var(--text-muted)", alignSelf: "center" } }, "Demo:"),
    Object.entries(DEMO_ACCOUNTS).map(([key, acc]) =>
      h("button", {
        type: "button",
        class: "chip chip-filter",
        "data-demo": key,
        onclick: () => onSelect(key, acc),
      }, `${acc.name.split(" ").slice(-1)[0]} (${key})`)),
  ]);
}

/** Form submit helper: gather FormData into a plain object. */
export function formData(form) {
  const data = {};
  for (const el of form.querySelectorAll("[name]")) {
    data[el.name] = el.value;
  }
  return data;
}

export default { field, demoChips, formData };
