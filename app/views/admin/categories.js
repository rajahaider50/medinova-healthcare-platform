/**
 * MediNova — View: Admin categories.
 */

import { h } from "../../utils/html.js";
import * as Db from "../../data/db.js";
import * as Toast from "../../services/ToastService.js";
import { compactNumber } from "../../utils/format.js";

export async function view() {
  const grid = h("div", {});

  function render() {
    const cats = Db.collection("categories").all();
    const meds = Db.collection("medicines").all();
    const cards = cats.map((c) => {
      const count = meds.filter((m) => m.category === c.name).length;
      return h("div", { class: "mn-panel glass category-card", style: { padding: "18px" } }, [
        h("div", { class: "icon-box icon-box-purple" }, h("i", { class: `fa-solid ${c.icon || "fa-tag"}` })),
        h("div", { style: { marginTop: "12px", fontWeight: 700, fontSize: "15px" } }, c.name),
        h("div", { style: { color: "var(--text-muted)", fontSize: "12px", marginTop: "2px" } }, compactNumber(count) + " products"),
        h("div", { style: { marginTop: "12px" } }, c.description ? h("p", { style: { color: "var(--text-muted)", fontSize: "12px", margin: 0 } }, c.description) : null),
        h("div", { style: { marginTop: "12px", display: "flex", gap: "8px" } }, [
          h("button", { class: "btn btn-outline btn-sm", onclick: () => Toast.info(c.name, "Edit form coming in the full release.") }, h("i", { class: "fa-solid fa-pen" }), " Edit"),
          h("button", { class: "btn btn-outline btn-sm", onclick: () => Toast.info(c.name, `${compactNumber(count)} products in this category.`) }, h("i", { class: "fa-solid fa-boxes-stacked" }), " View"),
        ]),
      ]);
    });
    grid.replaceChildren(cards.length ? h("div", { class: "grid grid-3" }, cards) : h("div", { style: { padding: "32px" } }, h("mn-empty", { icon: "tags", title: "No categories" })));
  }

  render();

  const header = h("div", { class: "flex items-center justify-between flex-wrap gap-3", style: { marginBottom: "24px" } }, [
    h("div", {}, [h("h1", { style: { margin: 0, fontSize: "26px" } }, "Categories"), h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, "Organize the pharmacy catalog")]),
    h("button", { class: "btn btn-primary", onclick: () => Toast.info("Coming soon", "Add category form coming in the full release.") }, h("i", { class: "fa-solid fa-plus" }), " Add Category"),
  ]);

  return h("div", { class: "anim-fade-up" }, [header, h("div", { style: { marginTop: "16px" } }, grid)]);
}

export const route = { path: "/admin/categories", title: "Categories", layout: "admin", auth: true, roles: ["admin", "super_admin"], view };

export default { view, route };
