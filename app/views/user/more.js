/**
 * MediNova — View: More (mobile menu).
 */

import { h } from "../../utils/html.js";
import { navigate } from "../../router/Router.js";

const ITEMS = [
  { path: "/profile", label: "My Profile", icon: "fa-user" },
  { path: "/appointments", label: "Appointments", icon: "fa-calendar-check" },
  { path: "/prescriptions", label: "Prescriptions", icon: "fa-file-prescription" },
  { path: "/records", label: "Medical Records", icon: "fa-folder-open" },
  { path: "/reports", label: "Lab Reports", icon: "fa-vial-circle-check" },
  { path: "/orders", label: "My Orders", icon: "fa-truck" },
  { path: "/messages", label: "Messages", icon: "fa-envelope" },
  { path: "/notifications", label: "Notifications", icon: "fa-bell" },
  { path: "/support", label: "Support", icon: "fa-headset" },
  { path: "/settings", label: "Settings", icon: "fa-gear" },
  { path: "/cart", label: "Cart", icon: "fa-cart-shopping" },
  { path: "/medicines", label: "Medicines", icon: "fa-pills" },
];

export async function view() {
  return h("div", { class: "anim-fade-up" }, [
    h("div", { class: "page-header" }, [h("h1", { style: { margin: 0, fontSize: "26px" } }, "More")]),
    h("div", { class: "more-grid", style: { marginTop: "16px" } }, ITEMS.map((i) =>
      h("a", { class: "more-item", href: `#${i.path}`, onclick: (e) => { e.preventDefault(); navigate(i.path); } }, [
        h("i", { class: `fa-solid ${i.icon}` }),
        h("span", {}, i.label),
      ]))),
  ]);
}

export const route = { path: "/more", title: "More", layout: "user", auth: true, view };

export default { view, route };
