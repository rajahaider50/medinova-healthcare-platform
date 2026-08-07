/**
 * MediNova — View: Admin medicines & catalog.
 */

import { h } from "../../utils/html.js";
import * as Db from "../../data/db.js";
import * as Toast from "../../services/ToastService.js";
import { money } from "../../utils/format.js";

export async function view() {
  const table = h("div", {});

  function render(term = "", cat = "") {
    let list = Db.collection("medicines").all();
    if (term) list = list.filter((m) => `${m.name} ${m.brand} ${m.category} ${m.generic}`.toLowerCase().includes(term.toLowerCase()));
    if (cat) list = list.filter((m) => m.category === cat);

    const rows = list.map((m) =>
      h("tr", {}, [
        h("td", {}, h("div", { style: { display: "flex", alignItems: "center", gap: "10px" } }, [
          h("span", { class: "avatar avatar-sm avatar-med" }, h("i", { class: "fa-solid fa-pills" })),
          h("div", {}, [h("div", { style: { fontWeight: 600, fontSize: "14px" } }, m.name), h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, m.brand || m.generic || "")]),
        ])),
        h("td", {}, h("span", { class: "badge badge-neutral" }, m.category)),
        h("td", {}, h("div", {}, money(m.price))),
        h("td", {}, h("div", {}, `${m.stock} ${m.unit || ""}`)),
        h("td", {}, m.stock > 20 ? h("span", { class: "badge badge-success" }, "In stock") : m.stock > 5 ? h("span", { class: "badge badge-warning" }, "Low") : h("span", { class: "badge badge-danger" }, "Out")),
        h("td", { style: { textAlign: "right" } }, h("button", { class: "btn btn-ghost btn-sm icon-btn", title: "Edit", onclick: () => Toast.info(m.name, "Edit form coming in the full release.") }, h("i", { class: "fa-solid fa-pen" }))),
      ]));
    table.replaceChildren(
      rows.length
        ? h("table", { class: "table" }, [h("thead", {}, h("tr", {}, [h("th", {}, "Medicine"), h("th", {}, "Category"), h("th", {}, "Price"), h("th", {}, "Stock"), h("th", {}, "Status"), h("th", { style: { width: "48px" } }, "")])), h("tbody", {}, rows)])
        : h("div", { style: { padding: "32px" } }, h("mn-empty", { icon: "pills", title: "No medicines found", sub: "Try different filters." }))
    );
  }

  const search = h("input", { class: "input", placeholder: "Search medicines…" });
  const cat = h("select", { class: "input", style: { maxWidth: "180px" } }, [
    h("option", { value: "" }, "All categories"),
    ...Db.collection("categories").all().map((c) => h("option", { value: c.name }, c.name)),
  ]);
  search.addEventListener("input", () => render(search.value, cat.value));
  cat.addEventListener("change", () => render(search.value, cat.value));

  render();

  const header = h("div", { class: "flex items-center justify-between flex-wrap gap-3", style: { marginBottom: "24px" } }, [
    h("div", {}, [h("h1", { style: { margin: 0, fontSize: "26px" } }, "Medicines"), h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, "Pharmacy catalog management")]),
    h("button", { class: "btn btn-primary", onclick: () => Toast.info("Coming soon", "Add medicine form coming in the full release.") }, h("i", { class: "fa-solid fa-plus" }), " Add Medicine"),
  ]);

  const panel = h("div", { class: "mn-panel glass", style: { marginTop: "16px" } }, [
    h("div", { class: "glass-header flex items-center justify-between flex-wrap gap-3" }, [search, cat]),
    h("div", { class: "glass-body", style: { padding: 0 } }, table),
  ]);

  return h("div", { class: "anim-fade-up" }, [header, panel]);
}

export const route = { path: "/admin/medicines", title: "Medicines", layout: "admin", auth: true, roles: ["admin", "super_admin"], view };

export default { view, route };
