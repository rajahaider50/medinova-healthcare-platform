/**
 * MediNova — View: Checkout.
 */

import { h } from "../../utils/html.js";
import * as Router from "../../router/Router.js";
import * as Db from "../../data/db.js";
import * as Toast from "../../services/ToastService.js";
import { CartService } from "../../services/CartService.js";
import { currentUser } from "../../services/AuthService.js";
import { uid } from "../../utils/id.js";
import { money } from "../../utils/format.js";
import * as Brand from "../../services/BrandService.js";

export async function view() {
  const items = CartService.cart();
  const user = currentUser();
  const settings = Brand.getSettings();
  const subtotal = CartService.subtotal();
  const deliveryFee = subtotal >= settings.pharmacy.freeDeliveryAbove ? 0 : settings.pharmacy.deliveryFee;
  const total = subtotal + deliveryFee;

  if (!items.length) {
    return h("div", { class: "empty-state", style: { padding: "80px 24px" } }, [
      h("div", { class: "icon-box icon-box-lg" }, h("i", { class: "fa-solid fa-cart-shopping" })),
      h("h3", {}, "Your cart is empty"),
      h("a", { class: "btn btn-primary mt-3", href: "#/medicines" }, "Browse medicines"),
    ]);
  }

  const fields = (placeholder, icon) =>
    h("div", { class: "field-wrap", style: { position: "relative" } }, [
      h("i", { class: `fa-solid fa-${icon} field-icon` }),
      placeholder,
    ]);

  const addressInput = h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Delivery address"), fields(h("input", { class: "input", name: "address", placeholder: "House, street, area", value: user?.address || "" }), "location-dot")]);
  const cityInput = h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "City"), fields(h("input", { class: "input", name: "city", placeholder: "City", value: user?.city || "" }), "city")]);
  const phoneInput = h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Phone"), fields(h("input", { class: "input", name: "phone", placeholder: "+92 3xx xxxxxxx", value: user?.phone || "" }), "phone")]);

  const paymentSelect = h("select", { class: "select", name: "paymentMethod" }, [
    h("option", { value: "cod" }, "Cash on Delivery"),
    h("option", { value: "card" }, "Credit / Debit Card"),
  ]);

  const couponInput = h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Coupon code"), fields(h("input", { class: "input", name: "coupon", placeholder: "e.g. NOVA10" }), "ticket")]);

  const rxUpload = h("div", { class: "upload-zone", style: { padding: "20px", textAlign: "center", border: "1px dashed var(--glass-border-strong)", borderRadius: "var(--radius-md)", marginTop: "8px", cursor: "pointer" } }, [
    h("i", { class: "fa-solid fa-cloud-arrow-up", style: { fontSize: "22px", color: "var(--color-primary)" } }),
    h("div", { style: { fontSize: "13px", marginTop: "6px" } }, "Upload prescription (optional)"),
    h("div", { style: { fontSize: "11px", color: "var(--text-muted)" } }, "JPG, PNG or PDF up to 5MB"),
  ]);

  const placeBtn = h("button", { class: "btn btn-primary btn-lg btn-block", id: "place-order" }, h("i", { class: "fa-solid fa-lock" }), ` Place Order · ${money(total)}`);

  placeBtn.addEventListener("click", () => {
    const getVal = (name) => (form.querySelector(`[name="${name}"]`) || {}).value || "";
    const address = getVal("address");
    const city = getVal("city");
    const phone = getVal("phone");
    const paymentMethod = getVal("paymentMethod") || "cod";

    if (!address.trim() || !city.trim() || !phone.trim()) {
      Toast.warning("Missing details", "Please fill in address, city and phone.");
      return;
    }

    const order = Db.collection("orders").insert({
      id: uid("ORD-"),
      userId: user.id,
      userName: user.name,
      items: items.map((i) => ({ medicineId: i.medicineId, name: i.name, price: i.price, qty: i.qty })),
      subtotal,
      discount: 0,
      deliveryFee,
      coupon: getVal("coupon"),
      total,
      prescriptionRequired: CartService.hasPrescriptionRequired(),
      prescriptionId: null,
      status: "pending",
      paymentMethod,
      paymentStatus: paymentMethod === "card" ? "unpaid" : "pending",
      address: { line: address, city, phone },
      tracking: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    CartService.clear();
    Toast.success("Order placed", `Order ${order.id} has been placed successfully.`);
    Router.navigate(`/orders/${order.id}`);
  });

  const form = h("form", { class: "form-grid" }, [addressInput, cityInput, phoneInput, couponInput]);

  return h("div", { class: "anim-fade-up", style: { maxWidth: "1000px", margin: "0 auto" } }, [
    h("div", { class: "page-header" }, [h("h1", { style: { margin: 0, fontSize: "26px" } }, "Checkout")]),
    h("div", { class: "grid", style: { gridTemplateColumns: "1.5fr 1fr", gap: "24px", marginTop: "16px" } }, [
      h("div", {}, [
        h("div", { class: "mn-panel glass" }, [
          h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-location-dot" })), h("div", {}, [h("div", { class: "panel-title" }, "Delivery Details")])])]),
          h("div", { class: "glass-body" }, form),
        ]),
        h("div", { class: "mn-panel glass", style: { marginTop: "16px" } }, [
          h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-file-prescription" })), h("div", {}, [h("div", { class: "panel-title" }, "Prescription")])])]),
          h("div", { class: "glass-body" }, [h("p", { style: { color: "var(--text-muted)", fontSize: "13px", margin: "0 0 8px" } }, CartService.hasPrescriptionRequired() ? "Some items in your order require a prescription." : "No prescription needed for this order."), rxUpload]),
        ]),
        h("div", { class: "mn-panel glass", style: { marginTop: "16px" } }, [
          h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-credit-card" })), h("div", {}, [h("div", { class: "panel-title" }, "Payment Method")])])]),
          h("div", { class: "glass-body" }, h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Select method"), paymentSelect])),
        ]),
      ]),
      h("div", { class: "mn-panel glass", style: { alignSelf: "flex-start", position: "sticky", top: "88px" } }, [
        h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-receipt" })), h("div", {}, [h("div", { class: "panel-title" }, "Summary")])])]),
        h("div", { class: "glass-body" }, [
          ...items.map((i) => h("div", { style: { display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "13px" } }, [h("span", { style: { color: "var(--text-muted)" } }, `${i.qty}× ${i.name}`), h("span", {}, money(i.price * i.qty))])),
          h("div", { class: "divider", style: { margin: "8px 0" } }),
          h("div", { style: { display: "flex", justifyContent: "space-between", padding: "6px 0" } }, [h("span", { style: { color: "var(--text-muted)" } }, "Subtotal"), h("span", {}, money(subtotal))]),
          h("div", { style: { display: "flex", justifyContent: "space-between", padding: "6px 0" } }, [h("span", { style: { color: "var(--text-muted)" } }, "Delivery"), h("span", {}, deliveryFee === 0 ? "Free" : money(deliveryFee))]),
          h("div", { style: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--glass-border)" } }, [h("span", { style: { fontWeight: 700 } }, "Total"), h("span", { style: { fontWeight: 700, color: "var(--color-primary)", fontSize: "20px" } }, money(total))]),
          h("div", { style: { marginTop: "16px" } }, placeBtn),
        ]),
      ]),
    ]),
  ]);
}

export const route = { path: "/checkout", title: "Checkout", layout: "user", auth: true, view };

export default { view, route };
