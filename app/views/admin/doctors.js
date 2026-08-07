/**
 * MediNova — View: Admin doctors management.
 */

import { h } from "../../utils/html.js";
import * as Db from "../../data/db.js";
import * as Toast from "../../services/ToastService.js";
import { initials } from "../../utils/format.js";
import { timeAgo } from "../../utils/date.js";

export async function view() {
  const grid = h("div", {});

  function render(term = "", specialty = "") {
    let list = Db.collection("doctors").all();
    if (term) list = list.filter((d) => `${d.name} ${d.specialty} ${d.hospital}`.toLowerCase().includes(term.toLowerCase()));
    if (specialty) list = list.filter((d) => d.specialty === specialty);

    const cards = list.map((d) =>
      h("div", { class: "doctor-card mn-panel glass", style: { padding: "16px" } }, [
        h("div", { style: { display: "flex", gap: "12px", alignItems: "center" } }, [
          h("span", { class: "avatar" }, d.avatar || initials(d.name)),
          h("div", { style: { flex: 1 } }, [
            h("div", { style: { fontWeight: 700, fontSize: "15px" } }, `Dr. ${d.name}`),
            h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, d.specialty),
          ]),
          h("span", { class: `badge ${d.available ? "badge-success" : "badge-neutral"}` }, d.available ? "Available" : "Busy"),
        ]),
        h("div", { style: { marginTop: "12px", color: "var(--text-muted)", fontSize: "12px" } }, [
          h("div", {}, h("i", { class: "fa-solid fa-hospital", style: { width: "16px" } }), " ", d.hospital),
          h("div", { style: { marginTop: "4px" } }, h("i", { class: "fa-solid fa-stethoscope", style: { width: "16px" } }), " ", d.specialty),
        ]),
        h("div", { style: { marginTop: "12px", display: "flex", justifyContent: "space-between" } }, [
          h("div", {}, h("mn-rating", { value: String(d.rating || 0), readonly: "true" })),
          h("span", { style: { color: "var(--text-muted)", fontSize: "12px" } }, `${d.reviews || 0} reviews`),
        ]),
      ]));
    grid.replaceChildren(
      cards.length
        ? h("div", { class: "grid grid-3" }, cards)
        : h("div", { style: { padding: "32px" } }, h("mn-empty", { icon: "user-doctor", title: "No doctors found", sub: "Try different filters." }))
    );
  }

  const search = h("input", { class: "input", placeholder: "Search doctors…" });
  const spec = h("select", { class: "input", style: { maxWidth: "180px" } }, [
    h("option", { value: "" }, "All specialties"),
    ...Db.collection("specialties").all().map((s) => h("option", { value: s.name }, s.name)),
  ]);
  search.addEventListener("input", () => render(search.value, spec.value));
  spec.addEventListener("change", () => render(search.value, spec.value));

  render();

  const header = h("div", { class: "flex items-center justify-between flex-wrap gap-3", style: { marginBottom: "24px" } }, [
    h("div", {}, [h("h1", { style: { margin: 0, fontSize: "26px" } }, "Doctors"), h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, "Directory of registered specialists")]),
    h("button", { class: "btn btn-primary", onclick: () => Toast.info("Coming soon", "Doctor onboarding form will be added in the full release.") }, h("i", { class: "fa-solid fa-user-plus" }), " Add Doctor"),
  ]);

  const panel = h("div", { class: "mn-panel glass", style: { marginTop: "16px" } }, [
    h("div", { class: "glass-header flex items-center justify-between flex-wrap gap-3" }, [search, spec]),
    h("div", { class: "glass-body" }, grid),
  ]);

  return h("div", { class: "anim-fade-up" }, [header, panel]);
}

export const route = { path: "/admin/doctors", title: "Doctors", layout: "admin", auth: true, roles: ["admin", "super_admin"], view };

export default { view, route };
