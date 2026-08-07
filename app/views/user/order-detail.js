/**
 * MediNova — View: Order detail with tracking timeline.
 */

import { h } from "../../utils/html.js";
import * as Db from "../../data/db.js";
import UserData from "../../services/UserDataService.js";
import { money } from "../../utils/format.js";
import { formatDateTime, timeAgo } from "../../utils/date.js";

const TONE = { pending: "warning", confirmed: "info", processing: "info", packed: "info", shipped: "purple", delivered: "success", cancelled: "danger" };

export async function view(ctx) {
  const order = UserData.myOrders().find((o) => o.id === ctx.params.id) ||
    Db.collection("orders").findOne({ id: ctx.params.id });

  if (!order) {
    return h("div", { class: "error-state" }, [
      h("div", { class: "error-icon" }, h("i", { class: "fa-solid fa-truck" })),
      h("h3", {}, "Order not found"),
      h("a", { class: "btn btn-primary mt-3", href: "#/orders" }, "Back to orders"),
    ]);
  }

  const statuses = ["pending", "confirmed", "processing", "packed", "shipped", "delivered"];
  const currentIdx = statuses.indexOf(order.status);
  const cancelled = order.status === "cancelled";

  const timeline = cancelled
    ? h("div", { style: { padding: "12px 0" } }, h("span", { class: "badge badge-danger" }, "This order was cancelled"))
    : h("div", { class: "stepper", style: { margin: "16px 0" } }, statuses.map((s, i) =>
        h("div", { class: ["step", i <= currentIdx ? "done" : ""].filter(Boolean).join(" "), style: { flex: 1, textAlign: "center" } }, [
          h("div", { class: "step-circle" }, i < currentIdx ? h("i", { class: "fa-solid fa-check" }) : i === currentIdx ? h("i", { class: "fa-solid fa-circle" }) : i + 1),
          h("div", { class: "step-label", style: { fontSize: "11px", color: i === currentIdx ? "var(--color-primary)" : "var(--text-muted)", fontWeight: i === currentIdx ? 700 : 500 } }, s),
        ])));

  return h("div", { class: "anim-fade-up" }, [
    h("nav", { class: "breadcrumb" }, [h("a", { href: "#/orders" }, "Orders"), h("span", {}, " / "), h("span", {}, order.id)]),
    h("div", { class: "grid", style: { gridTemplateColumns: "1.6fr 1fr", gap: "24px" } }, [
      h("div", { class: "mn-panel glass" }, [
        h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-truck-fast" })), h("div", {}, [h("div", { class: "panel-title" }, `Order ${order.id}`), h("div", { class: "panel-subtitle" }, `Placed ${formatDateTime(order.createdAt)}`)])])]),
        h("div", { class: "glass-body" }, [
          h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" } }, [
            h("span", { class: `badge badge-${TONE[order.status] || "neutral"}` }, order.status),
            h("span", { class: `badge ${order.paymentStatus === "paid" ? "badge-success" : "badge-warning"}` }, order.paymentStatus),
          ]),
          timeline,
        ]),
      ]),
      h("div", { class: "mn-panel glass", style: { alignSelf: "flex-start" } }, [
        h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-receipt" })), h("div", {}, [h("div", { class: "panel-title" }, "Items")])])]),
        h("div", { class: "glass-body" }, [
          ...order.items.map((i) => h("div", { style: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--glass-border)", gap: "12px" } }, [
            h("span", { style: { flex: 1 } }, `${i.qty}× ${i.name}`),
            h("span", { style: { fontWeight: 600 } }, money(i.price * i.qty)),
          ])),
          h("div", { style: { display: "flex", justifyContent: "space-between", padding: "8px 0" } }, [h("span", { style: { color: "var(--text-muted)" } }, "Subtotal"), h("span", {}, money(order.subtotal))]),
          h("div", { style: { display: "flex", justifyContent: "space-between", padding: "8px 0" } }, [h("span", { style: { color: "var(--text-muted)" } }, "Delivery"), h("span", {}, order.deliveryFee === 0 ? "Free" : money(order.deliveryFee))]),
          h("div", { style: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--glass-border)" } }, [h("span", { style: { fontWeight: 700 } }, "Total"), h("span", { style: { fontWeight: 700, color: "var(--color-primary)" } }, money(order.total))]),
        ]),
      ]),
    ]),
    h("div", { class: "mn-panel glass", style: { marginTop: "24px" } }, [
      h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-map-location-dot" })), h("div", {}, [h("div", { class: "panel-title" }, "Delivery Address")])])]),
      h("div", { class: "glass-body" }, [
        h("p", { style: { margin: 0, color: "var(--text-secondary)" } }, order.address.line),
        h("p", { style: { margin: "2px 0", color: "var(--text-secondary)" } }, order.address.city),
        h("p", { style: { margin: "2px 0 0", color: "var(--text-secondary)" } }, order.address.phone),
      ]),
    ]),
  ]);
}

export const route = { path: "/orders/:id", title: "Order", layout: "user", auth: true, view };

export default { view, route };
