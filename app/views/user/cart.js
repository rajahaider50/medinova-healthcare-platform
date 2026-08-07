/**
 * MediNova — View: Cart.
 */

import { h } from "../../utils/html.js";
import * as Router from "../../router/Router.js";
import * as Toast from "../../services/ToastService.js";
import { CartService } from "../../services/CartService.js";
import * as Brand from "../../services/BrandService.js";
import { money } from "../../utils/format.js";

export async function view() {
  const items = CartService.cart();
  const subtotal = CartService.subtotal();
  const settings = Brand.getSettings();
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= settings.pharmacy.freeDeliveryAbove ? 0 : settings.pharmacy.deliveryFee;
  const total = subtotal + deliveryFee;

  const list = h("div", { class: "mn-panel glass" }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-cart-shopping" })), h("div", {}, [h("div", { class: "panel-title" }, "Your Cart"), h("div", { class: "panel-subtitle" }, `${items.length} item(s)`)])])]),
    h("div", { class: "glass-body", style: { padding: 0 } },
      items.length ? items.map((i) =>
        h("div", { style: { display: "flex", gap: "14px", padding: "16px 20px", borderBottom: "1px solid var(--glass-border)", alignItems: "center", flexWrap: "wrap" } }, [
          h("div", { class: "icon-box", style: { width: 52, height: 52, borderRadius: "var(--radius-md)" } }, h("i", { class: "fa-solid fa-capsules" })),
          h("div", { style: { flex: 1, minWidth: 160 } }, [
            h("div", { style: { fontWeight: 600 } }, i.name),
            h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, i.prescriptionRequired ? "Prescription required" : "OTC"),
          ]),
          h("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, [
            h("button", { class: "btn btn-ghost btn-icon btn-sm", onclick: () => { CartService.setQty(i.medicineId, i.qty - 1); render(); } }, h("i", { class: "fa-solid fa-minus" })),
            h("span", { style: { fontWeight: 700, minWidth: "24px", textAlign: "center" } }, i.qty),
            h("button", { class: "btn btn-ghost btn-icon btn-sm", onclick: () => { CartService.setQty(i.medicineId, i.qty + 1); render(); } }, h("i", { class: "fa-solid fa-plus" })),
          ]),
          h("div", { style: { fontWeight: 700, minWidth: "80px", textAlign: "right" } }, money(i.price * i.qty)),
          h("button", { class: "btn btn-ghost-danger btn-icon btn-sm", onclick: () => { CartService.remove(i.medicineId); render(); }, "aria-label": "Remove" }, h("i", { class: "fa-solid fa-trash" })),
        ])) :
      h("div", { style: { padding: "32px 24px" } },
        h("mn-empty", { icon: "cart-shopping", title: "Your cart is empty", text: "Browse medicines and add what you need." }, h("a", { class: "btn btn-primary btn-sm", href: "#/medicines" }, "Browse medicines"))),
    ),
  ]);

  const summary = h("div", { class: "mn-panel glass", style: { alignSelf: "flex-start", position: "sticky", top: "88px" } }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-receipt" })), h("div", {}, [h("div", { class: "panel-title" }, "Order Summary")])])]),
    h("div", { class: "glass-body" }, [
      h("div", { style: { display: "flex", justifyContent: "space-between", padding: "8px 0" } }, [h("span", { style: { color: "var(--text-muted)" } }, "Subtotal"), h("span", { style: { fontWeight: 600 } }, money(subtotal))]),
      h("div", { style: { display: "flex", justifyContent: "space-between", padding: "8px 0" } }, [h("span", { style: { color: "var(--text-muted)" } }, "Delivery"), h("span", { style: { fontWeight: 600 } }, deliveryFee === 0 ? "Free" : money(deliveryFee))]),
      subtotal >= settings.pharmacy.freeDeliveryAbove ? h("div", { style: { padding: "8px 0" } }, h("span", { class: "badge badge-success" }, h("i", { class: "fa-solid fa-truck-fast" }), " Free delivery unlocked")) : null,
      h("div", { class: "divider", style: { margin: "8px 0" } }),
      h("div", { style: { display: "flex", justifyContent: "space-between", padding: "8px 0" } }, [h("span", { style: { fontWeight: 700 } }, "Total"), h("span", { style: { fontWeight: 700, color: "var(--color-primary)", fontSize: "20px" } }, money(total))]),
      h("button", {
        class: "btn btn-primary btn-lg btn-block",
        style: { marginTop: "16px" },
        disabled: items.length === 0,
        onclick: () => {
          if (CartService.hasPrescriptionRequired()) {
            Toast.info("Prescription needed", "Some items require a prescription. You'll be asked to upload one at checkout.");
          }
          Router.navigate("/checkout");
        },
      }, h("i", { class: "fa-solid fa-lock" }), " Checkout"),
      h("p", { style: { textAlign: "center", color: "var(--text-muted)", fontSize: "12px", marginTop: "12px" } }, h("i", { class: "fa-solid fa-shield-halved" }), " Secure checkout · Cash on Delivery or Card"),
    ]),
  ]);

  function render() {
    Router.reload();
  }

  return h("div", { class: "anim-fade-up", style: { maxWidth: "1100px", margin: "0 auto" } }, [
    h("div", { class: "page-header" }, [h("h1", { style: { margin: 0, fontSize: "26px" } }, "Shopping Cart")]),
    h("div", { class: "grid", style: { gridTemplateColumns: "1.6fr 1fr", gap: "24px", marginTop: "16px" } }, [list, summary]),
  ]);
}

export const route = { path: "/cart", title: "Cart", layout: "user", auth: true, view };

export default { view, route };
