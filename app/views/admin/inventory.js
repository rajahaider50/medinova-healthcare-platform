/**
 * MediNova — View: Admin inventory & stock.
 */

import { h } from "../../utils/html.js";
import * as Db from "../../data/db.js";
import * as Toast from "../../services/ToastService.js";

export async function view() {
  const table = h("div", {});

  function render(term = "") {
    let list = Db.collection("medicines").all();
    if (term) list = list.filter((m) => `${m.name} ${m.brand} ${m.category}`.toLowerCase().includes(term.toLowerCase()));
    list.sort((a, b) => (a.stock || 0) - (b.stock || 0));

    const rows = list.map((m) => {
      const pct = Math.min(100, Math.round(((m.stock || 0) / (m.maxStock || 200)) * 100));
      return h("tr", {}, [
        h("td", {}, h("div", { style: { fontWeight: 600, fontSize: "14px" } }, m.name)),
        h("td", {}, h("span", { class: "badge badge-neutral" }, m.category)),
        h("td", {}, h("div", {}, `${m.stock} ${m.unit || ""}`)),
        h("td", { style: { minWidth: "140px" } }, h("div", { class: "progress" }, h("div", { class: `progress-fill ${pct < 25 ? "danger" : pct < 60 ? "warning" : ""}`, style: { width: `${pct}%` } }))),
        h("td", {}, m.stock > 20 ? h("span", { class: "badge badge-success" }, "Healthy") : m.stock > 5 ? h("span", { class: "badge badge-warning" }, "Low stock") : h("span", { class: "badge badge-danger" }, "Reorder")),
      ]);
    });
    table.replaceChildren(
      rows.length
        ? h("table", { class: "table" }, [h("thead", {}, h("tr", {}, [h("th", {}, "Medicine"), h("th", {}, "Category"), h("th", {}, "Stock"), h("th", {}, "Level"), h("th", {}, "Status")])), h("tbody", {}, rows)])
        : h("div", { style: { padding: "32px" } }, h("mn-empty", { icon: "boxes-stacked", title: "No items", sub: "Inventory is empty." }))
    );
  }

  const search = h("input", { class: "input", placeholder: "Search inventory…" });
  search.addEventListener("input", () => render(search.value));
  render();

  const lowCount = Db.collection("medicines").all().filter((m) => m.stock <= 5).length;

  const header = h("div", { class: "flex items-center justify-between flex-wrap gap-3", style: { marginBottom: "24px" } }, [
    h("div", {}, [h("h1", { style: { margin: 0, fontSize: "26px" } }, "Inventory"), h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, "Stock levels across the pharmacy")]),
    h("span", { class: `badge ${lowCount ? "badge-warning" : "badge-success"}` }, lowCount ? `${lowCount} low-stock items` : "Stock healthy"),
  ]);

  const panel = h("div", { class: "mn-panel glass", style: { marginTop: "16px" } }, [
    h("div", { class: "glass-header flex items-center justify-between flex-wrap gap-3" }, [search, h("button", { class: "btn btn-outline btn-sm", onclick: () => Toast.info("Inventory synced", "Stock levels refreshed.") }, h("i", { class: "fa-solid fa-arrows-rotate" }), " Sync")]),
    h("div", { class: "glass-body", style: { padding: 0 } }, table),
  ]);

  return h("div", { class: "anim-fade-up" }, [header, panel]);
}

export const route = { path: "/admin/inventory", title: "Inventory", layout: "admin", auth: true, roles: ["admin", "super_admin"], view };

export default { view, route };
