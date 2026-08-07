/**
 * MediNova — View: Medicines catalog.
 */

import { h } from "../../utils/html.js";
import * as Store from "../../state/store.js";
import * as Db from "../../data/db.js";
import { money } from "../../utils/format.js";
import * as Toast from "../../services/ToastService.js";
import { CartService } from "../../services/CartService.js";
import { debounce } from "../../utils/debounce.js";

function medicineCard(m) {
  const onSale = (m.discount || 0) > 0;
  return h("div", { class: "mn-panel glass glass-hover", style: { position: "relative" } }, [
    onSale ? h("span", { class: "ribbon", style: { position: "absolute", top: 12, right: 12 } }, `${m.discount || 0}% OFF`) : null,
    h("a", { href: `#/medicine/${m.id}`, style: { textDecoration: "none", color: "inherit", display: "block" } }, [
      h("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", height: "90px", background: "var(--bg-surface-2)", borderRadius: "var(--radius-md)", marginBottom: "12px" } },
        h("span", { class: "icon-box icon-box-lg" }, h("i", { class: "fa-solid fa-capsules" }))),
      h("div", { style: { fontWeight: 600, fontSize: "15px" } }, m.name),
      h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, `${m.strength} · ${m.type}`),
      h("div", { style: { display: "flex", alignItems: "center", gap: "6px", margin: "6px 0" } }, [
        h("span", { class: "rating" }, h("i", { class: "fa-solid fa-star" }), h("span", { class: "rating-count" }, m.rating || 0)),
        h("span", { style: { color: "var(--text-muted)", fontSize: "12px" } }, `(${m.sold || 0} sold)`),
      ]),
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, [
        h("div", {}, [
          onSale ? h("span", { class: "price-strike", style: { textDecoration: "line-through", color: "var(--text-muted)", fontSize: "12px", marginRight: "6px" } }, money(m.price)) : null,
          h("span", { class: "price", style: { fontWeight: 700, fontSize: "16px", color: "var(--color-primary)" } }, money(m.price - (m.price * (m.discount || 0)) / 100)),
        ]),
        h("button", {
          class: "btn btn-primary btn-sm",
          onclick: (e) => {
            e.preventDefault();
            CartService.add({ medicineId: m.id, name: m.name, price: m.price - (m.price * (m.discount || 0)) / 100, qty: 1, prescriptionRequired: m.prescriptionRequired });
            Toast.success("Added to cart", `${m.name} added to your cart.`);
          },
        }, h("i", { class: "fa-solid fa-cart-plus" }), " Add"),
      ]),
      m.prescriptionRequired ? h("div", { style: { marginTop: "8px" } }, h("span", { class: "badge badge-warning" }, h("i", { class: "fa-solid fa-file-prescription" }), " Rx required")) : null,
      m.stock < 100 ? h("div", { style: { marginTop: "8px" } }, h("span", { class: "badge badge-danger" }, `${m.stock} left in stock`)) : null,
    ]),
  ]);
}

export async function view() {
  const query = Store.get("route")?.query || {};
  const activeCat = query.category || "";

  const medicines = Db.collection("medicines").all();
  const categories = Db.collection("categories").all();

  const catChips = h("div", { class: "filter-bar", style: { display: "flex", gap: "8px", flexWrap: "wrap", margin: "16px 0" } }, [
    h("a", { class: ["chip", activeCat ? "" : "chip-filter"].join(" "), href: "#/medicines" }, "All"),
    ...categories.map((c) =>
      h("a", { class: ["chip", c.id === activeCat ? "chip-filter" : ""].join(" "), href: `#/medicines?category=${c.id}` }, c.name)),
  ]);

  const searchInput = h("input", { class: "input", type: "search", placeholder: "Search medicines...", "aria-label": "Search medicines" });

  const grid = h("div", { class: "grid-auto" });

  const render = debounce(() => {
    const q = (searchInput.value || "").trim().toLowerCase();
    const filtered = medicines.filter((m) => {
      const inCat = !activeCat || m.categoryId === activeCat;
      const matches = !q || (m.name || "").toLowerCase().includes(q) || (m.generic || "").toLowerCase().includes(q) || (m.keywords || []).some((k) => (k || "").includes(q));
      return inCat && matches;
    });
    grid.replaceChildren(
      filtered.length ? filtered.map(medicineCard) :
      h("div", { class: "span-full" }, h("mn-empty", { icon: "pills", title: "No medicines found", text: "Try a different search or category." })),
    );
  }, 200);

  searchInput.addEventListener("input", render);
  render();

  return h("div", { class: "anim-fade-up" }, [
    h("div", { class: "page-header flex items-center justify-between flex-wrap gap-3" }, [
      h("div", {}, [
        h("h1", { style: { margin: 0, fontSize: "26px" } }, "Medicines"),
        h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, `${medicines.length} products · genuine & fast delivery`),
      ]),
      h("a", { class: "btn btn-outline", href: "#/cart" }, h("i", { class: "fa-solid fa-cart-shopping" }), ` Cart (${CartService.count()})`),
    ]),
    catChips,
    h("div", { class: "search-box", style: { position: "relative", marginBottom: "16px" } }, [
      h("i", { class: "fa-solid fa-magnifying-glass", style: { position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" } }),
      searchInput,
    ]),
    grid,
  ]);
}

export const route = { path: "/medicines", title: "Medicines", layout: "user", auth: true, view };

export default { view, route };
