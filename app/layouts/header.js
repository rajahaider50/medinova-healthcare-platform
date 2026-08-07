/**
 * MediNova — Shared top header builder.
 * Used by both user and admin layouts.
 */

import { h } from "../utils/html.js";
import { navigate } from "../router/Router.js";
import * as Store from "../state/store.js";
import { currentUser, logout, ROLE_LABELS } from "../services/AuthService.js";
import { ThemeService } from "../services/ThemeService.js";
import { APP_NAME } from "../config/app.config.js";

/** Build the top header element. */
export function buildHeader(opts = {}) {
  const user = currentUser();
  const role = user?.role || "user";
  const roleLabel = ROLE_LABELS[role] || "User";
  const unread = Store.get("unreadNotifications") || 0;
  const cartCount = Store.get("cartCount") || 0;
  const errors = Store.get("errors") || 0;

  const menuBtn = opts.menu ? h("button", {
    class: "header-btn sidebar-collapse-btn",
    "aria-label": "Toggle sidebar",
    onclick: () => Store.set("sidebarCollapsed", !Store.get("sidebarCollapsed")),
  }, h("i", { class: "fa-solid fa-bars" })) : null;

  const search = h("div", { class: "header-search" }, [
    h("i", { class: "fa-solid fa-magnifying-glass" }),
    h("input", {
      class: "input",
      type: "search",
      placeholder: "Search doctors, medicines, reports...",
      "aria-label": "Search",
    }),
    h("kbd", {}, "Ctrl K"),
  ]);

  const sysStatus = h("button", {
    class: "sys-status ok",
    title: "System operational",
    onclick: () => navigate("/admin/error-console"),
  }, [
    h("span", { class: "dot" }),
    h("span", { class: "sys-label" }, "System OK"),
    errors > 0 ? h("span", { class: "sys-count" }, ` (${errors})`) : null,
  ]);

  const notifBtn = h("a", {
    class: "header-btn",
    href: "#/notifications",
    "aria-label": `Notifications${unread ? ` (${unread} unread)` : ""}`,
  }, [
    h("i", { class: "fa-solid fa-bell" }),
    unread > 0 ? h("span", { class: "notif-count" }, unread > 9 ? "9+" : unread) : null,
  ]);

  const cartBtn = opts.cart ? h("a", {
    class: "header-btn",
    href: "#/cart",
    "aria-label": `Cart${cartCount ? ` (${cartCount} items)` : ""}`,
  }, [
    h("i", { class: "fa-solid fa-cart-shopping" }),
    cartCount > 0 ? h("span", { class: "notif-count" }, cartCount > 9 ? "9+" : cartCount) : null,
  ]) : null;

  const themeToggle = h("button", {
    class: "header-btn theme-toggle",
    "aria-label": "Toggle theme",
    onclick: () => ThemeService.toggle(),
  }, h("i", { class: "fa-solid fa-circle-half-stroke" }));

  const userMenu = h("a", {
    class: "header-user",
    href: "#/profile",
    "aria-label": "Account",
  }, [
    h("span", {
      class: "avatar avatar-sm",
    }, h("span", {}, (user?.name || "U").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase())),
    h("span", { class: "hu-info" }, [
      h("div", { class: "hu-name" }, user?.name || "User"),
      h("div", { class: "hu-role" }, roleLabel),
    ]),
    h("i", { class: "fa-solid fa-chevron-down", style: { fontSize: "11px", color: "var(--text-muted)" } }),
  ]);

  const logoutBtn = h("button", {
    class: "header-btn",
    title: "Sign out",
    "aria-label": "Sign out",
    onclick: () => { logout(); navigate("/auth/login"); },
  }, h("i", { class: "fa-solid fa-right-from-bracket" }));

  return h("header", { class: "top-header" }, [
    h("div", { class: "header-left" }, [menuBtn, search]),
    h("div", { class: "header-right" }, [sysStatus, notifBtn, cartBtn, themeToggle, userMenu, logoutBtn]),
  ]);
}

/** Wire up Ctrl/Cmd + K global search shortcut. */
export function initHeaderShortcuts() {
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      document.querySelector(".header-search .input")?.focus();
    }
  });
}

export default { buildHeader, initHeaderShortcuts };
