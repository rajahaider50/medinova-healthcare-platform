/**
 * MediNova — View: Medicine detail.
 */

import { h } from "../../utils/html.js";
import { medicines } from "../../data/mock/medicines.js";
import { money } from "../../utils/format.js";
import * as Toast from "../../services/ToastService.js";
import { CartService } from "../../services/CartService.js";

export async function view(ctx) {
  const med = medicines.find((m) => m.id === ctx.params.id);

  if (!med) {
    return h("div", { class: "error-state" }, [
      h("div", { class: "error-icon" }, h("i", { class: "fa-solid fa-pills" })),
      h("h3", {}, "Medicine not found"),
      h("a", { class: "btn btn-primary mt-3", href: "#/medicines" }, "Browse medicines"),
    ]);
  }

  const infoList = (title, items) => items?.length ? h("div", {}, [
    h("h3", { style: { fontSize: "15px", margin: "0 0 8px" } }, title),
    h("ul", { style: { margin: 0, paddingLeft: "20px", color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.9 } }, items.map((i) => h("li", {}, i))),
  ]) : null;

  const price = med.price - (med.price * (med.discount || 0)) / 100;
  const onSale = med.discount > 0;

  const addBtn = h("button", {
    class: "btn btn-primary btn-lg btn-block",
    onclick: () => {
      CartService.add({ medicineId: med.id, name: med.name, price, qty: 1, prescriptionRequired: med.prescriptionRequired });
      Toast.success("Added to cart", `${med.name} added to your cart.`);
    },
  }, h("i", { class: "fa-solid fa-cart-plus" }), " Add to Cart");

  const orderBox = h("div", { class: "mn-panel glass", style: { position: "sticky", top: "88px" } }, [
    h("div", {}, [
      h("div", { style: { fontWeight: 700, fontSize: "26px", color: "var(--color-primary)" } },
        onSale ? [h("s", { style: { color: "var(--text-muted)", fontSize: "16px", marginRight: "8px" } }, money(med.price)), money(price)] : money(price)),
      h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, `incl. taxes · ${med.packSize} pack`),
    ]),
    h("div", { style: { marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" } }, [
      med.stock > 0 ? h("span", { class: "badge badge-success" }, h("i", { class: "fa-solid fa-circle-check" }), " In stock") : h("span", { class: "badge badge-danger" }, " Out of stock"),
      med.prescriptionRequired ? h("span", { class: "badge badge-warning" }, " Prescription required") : null,
      onSale ? h("span", { class: "badge badge-purple" }, `${med.discount}% off`) : null,
    ]),
    h("div", { style: { marginTop: "16px" } }, addBtn),
    h("a", { class: "btn btn-outline btn-block", style: { marginTop: "10px" }, href: "#/cart" }, h("i", { class: "fa-solid fa-arrow-right" }), " View Cart"),
  ]);

  const tabs = h("div", {}, [
    h("div", { class: "tabs" }, [
      h("button", { class: "tab active", "data-tab": "uses" }, "Uses"),
      h("button", { class: "tab", "data-tab": "info" }, "Information"),
      h("button", { class: "tab", "data-tab": "side" }, "Side Effects"),
    ]),
    h("div", { class: "tab-panel", style: { padding: "16px 0" } }, [
      h("div", { "data-tab-panel": "uses" }, infoList("Uses", med.uses) || h("p", { style: { color: "var(--text-muted)" } }, "No usage info provided.")),
      h("div", { "data-tab-panel": "info", style: { display: "none" } }, [
        infoList("Composition", med.composition ? [med.composition] : null),
        h("div", {}, [h("h3", { style: { fontSize: "15px", margin: "0 0 8px" } }, "Details"), h("p", { style: { color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.7 } }, med.description || "Please consult your pharmacist for complete information.")]),
        h("div", { style: { marginTop: "12px" } }, infoList("Storage", [med.storage])),
      ]),
      h("div", { "data-tab-panel": "side", style: { display: "none" } }, infoList("Possible side effects", med.sideEffects) || h("p", { style: { color: "var(--text-muted)" } }, "No major side effects reported.")),
    ]),
  ]);

  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab");
    if (!btn) return;
    tabs.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t === btn));
    tabs.querySelectorAll("[data-tab-panel]").forEach((p) => { p.style.display = p.dataset.tabPanel === btn.dataset.tab ? "" : "none"; });
  });

  return h("div", { class: "anim-fade-up" }, [
    h("nav", { class: "breadcrumb" }, [h("a", { href: "#/medicines" }, "Medicines"), h("span", {}, " / "), h("span", {}, med.name)]),
    h("div", { class: "grid", style: { gridTemplateColumns: "1.5fr 1fr", gap: "24px" } }, [
      h("div", { class: "mn-panel glass" }, [
        h("div", { style: { display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-start" } }, [
          h("div", { class: "icon-box icon-box-lg", style: { width: 90, height: 90, borderRadius: "var(--radius-lg)" } }, h("i", { class: "fa-solid fa-capsules", style: { fontSize: "34px" } })),
          h("div", { style: { flex: 1, minWidth: 220 } }, [
            h("h1", { style: { margin: 0, fontSize: "24px" } }, med.name),
            h("p", { style: { color: "var(--text-muted)", margin: "4px 0" } }, `${med.generic} · ${med.strength} · ${med.type}`),
            h("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap" } }, [
              h("span", { class: "badge badge-neutral" }, med.brand),
              h("span", { class: "badge badge-neutral" }, med.manufacturer),
            ]),
          ]),
        ]),
        h("div", { class: "divider", style: { margin: "20px 0" } }),
        tabs,
      ]),
      orderBox,
    ]),
  ]);
}

export const route = { path: "/medicine/:id", title: "Medicine", layout: "user", auth: true, view };

export default { view, route };
