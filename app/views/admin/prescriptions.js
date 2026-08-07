/**
 * MediNova — View: Admin prescriptions.
 */

import { h } from "../../utils/html.js";
import * as Db from "../../data/db.js";
import * as Toast from "../../services/ToastService.js";
import { timeAgo } from "../../utils/date.js";

export async function view() {
  const table = h("div", {});

  function render(term = "") {
    let list = Db.collection("prescriptions").all();
    if (term) list = list.filter((p) => `${p.patientName} ${p.doctorName} ${p.diagnosis || ""} ${p.id}`.toLowerCase().includes(term.toLowerCase()));
    list.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    const rows = list.map((p) => {
      const medCount = Array.isArray(p.medications) ? p.medications.length : 0;
      return h("tr", {}, [
        h("td", {}, h("div", { style: { fontWeight: 600, fontSize: "14px" } }, p.patientName)),
        h("td", {}, h("div", {}, `Dr. ${p.doctorName}`)),
        h("td", {}, h("div", {}, p.date || "—")),
        h("td", {}, h("span", { class: "badge badge-neutral" }, `${medCount} meds`)),
        h("td", {}, h("span", { class: "badge badge-info" }, p.type || "prescription")),
        h("td", {}, h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, timeAgo(p.date))),
        h("td", { style: { textAlign: "right" } }, h("button", { class: "btn btn-ghost btn-sm", onclick: () => Toast.info(p.id, `${p.diagnosis || "Prescription"} · ${medCount} medications`) }, h("i", { class: "fa-solid fa-eye" }), " View")),
      ]);
    });
    table.replaceChildren(
      rows.length
        ? h("table", { class: "table" }, [h("thead", {}, h("tr", {}, [h("th", {}, "Patient"), h("th", {}, "Doctor"), h("th", {}, "Date"), h("th", {}, "Medications"), h("th", {}, "Type"), h("th", {}, "Issued"), h("th", { style: { width: "80px" } }, "")])), h("tbody", {}, rows)])
        : h("div", { style: { padding: "32px" } }, h("mn-empty", { icon: "file-prescription", title: "No prescriptions", sub: "No prescriptions on record." }))
    );
  }

  const search = h("input", { class: "input", placeholder: "Search prescriptions…" });
  search.addEventListener("input", () => render(search.value));
  render();

  const header = h("div", { style: { marginBottom: "24px" } }, [
    h("div", { class: "flex items-center justify-between flex-wrap gap-3" }, [
      h("div", {}, [h("h1", { style: { margin: 0, fontSize: "26px" } }, "Prescriptions"), h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, "Patient prescriptions issued by doctors")]),
      h("button", { class: "btn btn-primary", onclick: () => Toast.info("Coming soon", "Prescription authoring tool coming in the full release.") }, h("i", { class: "fa-solid fa-file-prescription" }), " New Prescription"),
    ]),
  ]);

  const panel = h("div", { class: "mn-panel glass", style: { marginTop: "16px" } }, [
    h("div", { class: "glass-header" }, [search]),
    h("div", { class: "glass-body", style: { padding: 0 } }, table),
  ]);

  return h("div", { class: "anim-fade-up" }, [header, panel]);
}

export const route = { path: "/admin/prescriptions", title: "Prescriptions", layout: "admin", auth: true, roles: ["admin", "super_admin"], view };

export default { view, route };
