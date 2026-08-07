/**
 * MediNova — View: Admin payments & coupons.
 */

import { h } from "../../utils/html.js";
import * as Db from "../../data/db.js";
import { money } from "../../utils/format.js";
import { timeAgo } from "../../utils/date.js";

export async function view() {
  const orders = Db.collection("orders").all();
  const coupons = Db.collection("coupons").all();
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const paid = orders.filter((o) => o.payment?.status === "paid" || o.status === "delivered").length;

  const stats = h("div", { class: "grid grid-3", style: { marginBottom: "24px" } }, [
    h("mn-stat", { label: "Total Revenue", value: money(totalRevenue), icon: "coins", tone: "success", sub: "across all orders" }),
    h("mn-stat", { label: "Orders Paid", value: String(paid), icon: "credit-card", tone: "purple", sub: `of ${orders.length} orders` }),
    h("mn-stat", { label: "Active Coupons", value: String(coupons.length), icon: "ticket", tone: "warning", sub: "in the platform" }),
  ]);

  const orderRows = orders.map((o) =>
    h("tr", {}, [
      h("td", {}, h("div", { style: { fontWeight: 600, fontSize: "13px", fontFamily: "monospace" } }, o.id)),
      h("td", {}, h("div", {}, o.customerName)),
      h("td", {}, h("div", {}, money(o.total))),
      h("td", {}, h("span", { class: `badge ${o.payment?.status === "paid" ? "badge-success" : "badge-warning"}` }, o.payment?.status || "pending")),
      h("td", {}, h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, timeAgo(o.createdAt))),
    ]));

  const couponRows = coupons.map((c) =>
    h("tr", {}, [
      h("td", {}, h("span", { class: "badge badge-purple", style: { fontFamily: "monospace" } }, c.code)),
      h("td", {}, h("div", {}, `${c.type === "percent" ? c.value + "% off" : money(c.value)}`)),
      h("td", {}, h("div", {}, `${c.minOrder ? money(c.minOrder) + " minimum" : "No minimum"}`)),
      h("td", {}, h("span", { class: `badge ${c.active !== false ? "badge-success" : "badge-neutral"}` }, c.active !== false ? "Active" : "Disabled")),
      h("td", {}, h("div", {}, c.expires ? `until ${c.expires}` : "No expiry")),
    ]));

  return h("div", { class: "anim-fade-up" }, [
    h("div", { style: { marginBottom: "24px" } }, [h("h1", { style: { margin: 0, fontSize: "26px" } }, "Payments"), h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, "Revenue, transactions and coupons")]),
    stats,
    h("div", { class: "mn-panel glass", style: { marginTop: "24px" } }, [
      h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-receipt" })), h("div", {}, [h("div", { class: "panel-title" }, "Transactions")])])]),
      h("div", { class: "glass-body", style: { padding: 0 } },
        orderRows.length ? h("table", { class: "table" }, [h("thead", {}, h("tr", {}, [h("th", {}, "Order"), h("th", {}, "Customer"), h("th", {}, "Amount"), h("th", {}, "Status"), h("th", {}, "Date")])), h("tbody", {}, orderRows)])
          : h("div", { style: { padding: "32px" } }, h("mn-empty", { icon: "receipt", title: "No transactions" }))),
    ]),
    h("div", { class: "mn-panel glass", style: { marginTop: "24px" } }, [
      h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-ticket" })), h("div", {}, [h("div", { class: "panel-title" }, "Coupons")])])]),
      h("div", { class: "glass-body", style: { padding: 0 } },
        couponRows.length ? h("table", { class: "table" }, [h("thead", {}, h("tr", {}, [h("th", {}, "Code"), h("th", {}, "Value"), h("th", {}, "Min Order"), h("th", {}, "Status"), h("th", {}, "Expiry")])), h("tbody", {}, couponRows)])
          : h("div", { style: { padding: "32px" } }, h("mn-empty", { icon: "ticket", title: "No coupons" }))),
    ]),
  ]);
}

export const route = { path: "/admin/payments", title: "Payments", layout: "admin", auth: true, roles: ["admin", "super_admin"], view };

export default { view, route };
