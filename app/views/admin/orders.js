/**
 * MediNova — View: Admin orders.
 */

import { h } from "../../utils/html.js";
import * as Db from "../../data/db.js";
import * as Toast from "../../services/ToastService.js";
import { money } from "../../utils/format.js";
import { timeAgo } from "../../utils/date.js";

const NEXT = { pending: "processing", processing: "shipped", shipped: "delivered", delivered: "delivered" };

export async function view() {
  const table = h("div", {});

  function render(term = "") {
    let list = Db.collection("orders").all();
    if (term) list = list.filter((o) => `${o.customerName} ${o.id}`.toLowerCase().includes(term.toLowerCase()));
    list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

    const rows = list.map((o) =>
      h("tr", {}, [
        h("td", {}, h("div", { style: { fontWeight: 600, fontSize: "13px", fontFamily: "monospace" } }, o.id)),
        h("td", {}, h("div", { style: { fontWeight: 600, fontSize: "14px" } }, o.customerName)),
        h("td", {}, h("div", {}, money(o.total))),
        h("td", {}, h("span", { class: "badge badge-neutral" }, o.status)),
        h("td", {}, h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, timeAgo(o.createdAt))),
        h("td", { style: { textAlign: "right" } }, NEXT[o.status] && NEXT[o.status] !== o.status
          ? h("button", { class: "btn btn-ghost btn-sm", onclick: () => { Db.collection("orders").update(o.id, { status: NEXT[o.status] }); Toast.success("Updated", `Order ${o.id} → ${NEXT[o.status]}.`); render(term); } }, `Mark ${NEXT[o.status]}`)
          : h("span", { style: { color: "var(--text-muted)", fontSize: "12px" } }, "—")),
      ]));
    table.replaceChildren(
      rows.length
        ? h("table", { class: "table" }, [h("thead", {}, h("tr", {}, [h("th", {}, "Order"), h("th", {}, "Customer"), h("th", {}, "Total"), h("th", {}, "Status"), h("th", {}, "Placed"), h("th", { style: { width: "110px" } }, "")])), h("tbody", {}, rows)])
        : h("div", { style: { padding: "32px" } }, h("mn-empty", { icon: "truck", title: "No orders", sub: "No orders placed yet." }))
    );
  }

  const search = h("input", { class: "input", placeholder: "Search by order ID or customer…" });
  search.addEventListener("input", () => render(search.value));
  render();

  const header = h("div", { style: { marginBottom: "24px" } }, [
    h("div", { class: "flex items-center justify-between flex-wrap gap-3" }, [
      h("div", {}, [h("h1", { style: { margin: 0, fontSize: "26px" } }, "Orders"), h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, "Pharmacy orders and fulfillment")]),
      h("button", { class: "btn btn-outline btn-sm", onclick: () => { Db.collection("orders").all().forEach((o) => { if (NEXT[o.status] && NEXT[o.status] !== o.status) Db.collection("orders").update(o.id, { status: NEXT[o.status] }); }); Toast.success("Orders advanced", "All orders moved to the next stage."); render(search.value); } }, h("i", { class: "fa-solid fa-forward-step" }), " Advance All"),
    ]),
  ]);

  const panel = h("div", { class: "mn-panel glass", style: { marginTop: "16px" } }, [
    h("div", { class: "glass-header" }, [search]),
    h("div", { class: "glass-body", style: { padding: 0 } }, table),
  ]);

  return h("div", { class: "anim-fade-up" }, [header, panel]);
}

export const route = { path: "/admin/orders", title: "Orders", layout: "admin", auth: true, roles: ["admin", "super_admin"], view };

export default { view, route };
