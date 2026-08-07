/**
 * MediNova — Shared sidebar builder.
 * User and admin navigation groups with active-link highlighting.
 * Logo always navigates home/dashboard — never logs out.
 */

import { h } from "../utils/html.js";
import * as Store from "../state/store.js";
import { currentUser, ROLE_LABELS, logout } from "../services/AuthService.js";
import { navigate } from "../router/Router.js";
import { APP_NAME } from "../config/app.config.js";
import * as Ui from "../services/UiService.js";
import { getBrand } from "../services/BrandService.js";

export function sidebarLink({ path, label, icon, badge = 0, danger = false }) {
  const active = Store.get("route")?.path === path;
  return h("a", {
    class: ["sidebar-link", active ? "active" : "", danger ? "danger" : ""].filter(Boolean).join(" "),
    href: `#${path}`,
    "data-path": path,
    "data-tip": label,
  }, [
    h("i", { class: `fa-solid fa-${icon}` }),
    h("span", { class: "sb-label" }, label),
    badge > 0 ? h("span", { class: "sb-badge" }, badge > 99 ? "99+" : badge) : null,
  ]);
}

export function sidebarSection(label) {
  return h("div", { class: "sidebar-section-label" }, label);
}

export function buildSidebar(navGroups) {
  const user = currentUser();
  const roleLabel = ROLE_LABELS[user?.role] || "User";
  const brandName = getBrand().brand?.name || APP_NAME;

  const nav = h("nav", { class: "sidebar-nav", "aria-label": "Primary navigation" }, navGroups.map((group) => [
    sidebarSection(group.label),
    group.items.map((item) => sidebarLink(item)),
  ]));

  const footer = h("div", { class: "sidebar-footer" }, [
    h("a", {
      class: "sidebar-user",
      href: "#/profile",
      onclick: (e) => { e.preventDefault(); Ui.closeDrawer(); navigate("/profile"); },
    }, [
      h("span", { class: "avatar avatar-sm" }, h("span", {}, (user?.name || "U").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase())),
      h("span", { class: "sb-label", style: { textAlign: "left" } }, [
        h("div", { style: { fontSize: "13px", fontWeight: 600 } }, user?.name || "User"),
        h("div", { style: { fontSize: "11px", color: "var(--text-muted)" } }, roleLabel),
      ]),
      h("i", { class: "fa-solid fa-chevron-right", style: { fontSize: "10px", color: "var(--text-muted)" } }),
    ]),
    h("button", {
      class: "sidebar-link danger",
      onclick: () => { logout(); navigate("/auth/login"); },
    }, [
      h("i", { class: "fa-solid fa-right-from-bracket" }),
      h("span", { class: "sb-label" }, "Sign out"),
    ]),
  ]);

  const brand = h("a", {
    class: "sidebar-brand",
    href: Ui.logoHref(),
    onclick: Ui.handleLogoClick,
    "aria-label": `${brandName} home`,
  }, [
    h("span", { class: "brand-logo" }, h("img", { src: "assets/logo/logo-mark.svg", alt: brandName, width: 40, height: 40 })),
    h("span", { class: "brand-text" }, brandName),
    h("span", { class: "brand-tag" }, "Healthcare"),
  ]);

  return h("aside", { class: "sidebar", "data-sidebar": "" }, [brand, nav, footer]);
}

/** Track active link on navigation. */
export function initSidebarSync() {
  Store.subscribe("route", () => {
    const path = Store.get("route")?.path;
    document.querySelectorAll(".sidebar-link").forEach((link) => {
      link.classList.toggle("active", link.dataset.path === path);
    });
  });
}

export default { sidebarLink, sidebarSection, buildSidebar, initSidebarSync };
