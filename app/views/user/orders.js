/**
 * MediNova — View: Orders list.
 */

import { h } from "../../utils/html.js";
import UserData from "../../services/UserDataService.js";
import { money } from "../../utils/format.js";
import { formatDate } from "../../utils/date.js";

const TONE = { pending: "warning", confirmed: "info", processing: "info", packed: "info", shipped: "purple", delivered: "success", cancelled: "danger" };

export async function view() {
  const orders = UserData.myOrders().sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

  return h("div", { class: "anim-fade-up" }, [
    h("div", { class: "page-header" }, [
      h("h1", { style: { margin: 0, fontSize: "26px" } }, "My Orders"),
      h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, `${orders.length} order(s)`),
    ]),
    h("div", { class: "grid", style: { marginTop: "16px", gap: "16px" } },
      orders.length ? orders.map((o) =>
        h("a", { class: "mn-panel glass glass-hover", href: `#/orders/${o.id}`, style: { textDecoration: "none", color: "inherit", display: "block" } }, [
          h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", flexWrap: "wrap" } }, [
            h("div", {}, [
              h("div", { style: { fontWeight: 700 } }, o.id),
              h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, formatDate(o.createdAt)),
            ]),
            h("span", { class: `badge badge-${TONE[o.status] || "neutral"}` }, o.status),
          ]),
          h("div", { style: { display: "flex", gap: "6px", flexWrap: "wrap", margin: "12px 0" } },
            o.items.map((i) => h("span", { class: "chip chip-filter", style: { pointerEvents: "none" } }, `${i.qty}× ${i.name}`))),
          h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--glass-border)", paddingTop: "12px" } }, [
            h("span", { class: "badge badge-neutral" }, o.paymentStatus),
            h("div", { style: { fontWeight: 700, color: "var(--color-primary)" } }, money(o.total)),
          ]),
        ])) :
      h("div", {}, h("mn-empty", { icon: "truck", title: "No orders yet", text: "Your pharmacy orders will appear here." }, h("a", { class: "btn btn-primary btn-sm", href: "#/medicines" }, "Shop medicines"))),
    ),
  ]);
}

export const route = { path: "/orders", title: "My Orders", layout: "user", auth: true, view };

export default { view, route };
