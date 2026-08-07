/**
 * MediNova — View: Medical records.
 */

import { h } from "../../utils/html.js";
import UserData from "../../services/UserDataService.js";
import { recordTypes } from "../../data/mock/records.js";
import { formatDate } from "../../utils/date.js";
import * as Toast from "../../services/ToastService.js";

function typeInfo(type) {
  return recordTypes.find((t) => t.id === type) || { label: type, icon: "fa-folder" };
}

export async function view() {
  const records = UserData.myRecords();

  const chips = h("div", { class: "filter-bar", style: { display: "flex", gap: "8px", flexWrap: "wrap", margin: "16px 0" } }, [
    h("button", { class: "chip chip-filter", onclick: () => { filter.setAttribute("data-type", ""); render(); } }, "All"),
    ...recordTypes.map((t) =>
      h("button", { class: "chip", onclick: () => { filter.setAttribute("data-type", t.id); render(); } }, h("i", { class: `fa-solid ${t.icon}` }), ` ${t.label}`)),
  ]);

  const filter = h("div", { "data-type": "" });

  const list = h("div", { class: "grid-auto" });

  function render() {
    const type = filter.getAttribute("data-type");
    const filtered = type ? records.filter((r) => r.type === type) : records;
    chips.querySelectorAll(".chip").forEach((c) => c.classList.toggle("chip-filter", !type ? c.textContent.trim() === "All" : c.textContent.includes(typeInfo(type).label)));
    list.replaceChildren(
      filtered.length ? filtered.map((r) => {
        const info = typeInfo(r.type);
        return h("div", { class: "mn-panel glass glass-hover" }, [
          h("div", { style: { display: "flex", gap: "12px", alignItems: "flex-start" } }, [
            h("div", { class: "icon-box" }, h("i", { class: `fa-solid ${info.icon}` })),
            h("div", { style: { flex: 1, minWidth: 0 } }, [
              h("div", { style: { fontWeight: 600 } }, r.title),
              h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, `${info.label} · ${formatDate(r.date)}`),
              h("p", { style: { color: "var(--text-secondary)", fontSize: "13px", margin: "8px 0 0" } }, r.description),
            ]),
          ]),
          h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--glass-border)", paddingTop: "12px", marginTop: "12px" } }, [
            h("span", { class: "badge badge-success" }, h("i", { class: "fa-solid fa-lock" }), " Private"),
            h("button", { class: "btn btn-ghost btn-sm", onclick: () => Toast.info("Opening record", r.title) }, h("i", { class: "fa-solid fa-eye" }), " View"),
          ]),
        ]);
      }) :
      h("div", { class: "span-full" }, h("mn-empty", { icon: "folder-open", title: "No records found", text: "Upload or generate your first medical record." })),
    );
  }
  render();

  return h("div", { class: "anim-fade-up" }, [
    h("div", { class: "page-header flex items-center justify-between flex-wrap gap-3" }, [
      h("div", {}, [
        h("h1", { style: { margin: 0, fontSize: "26px" } }, "Medical Records"),
        h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, "Your health history, stored privately"),
      ]),
      h("button", { class: "btn btn-primary", onclick: () => Toast.info("Upload", "Record upload coming in this demo flow.") }, h("i", { class: "fa-solid fa-cloud-arrow-up" }), " Upload Record"),
    ]),
    chips,
    list,
  ]);
}

export const route = { path: "/records", title: "Medical Records", layout: "user", auth: true, view };

export default { view, route };
