/**
 * MediNova — User layout.
 * Patient panel shell: sidebar + header + content + bottom nav (mobile).
 */

import { h, setChildren } from "../utils/html.js";
import { buildSidebar, initSidebarSync } from "./sidebar.js";
import { buildHeader, initHeaderShortcuts } from "./header.js";
import * as Store from "../state/store.js";
import { navigate } from "../router/Router.js";
import { isAuthed } from "../services/AuthService.js";
import { APP_NAME } from "../config/app.config.js";

const NAV_GROUPS = [
  {
    label: "Main",
    items: [
      { path: "/dashboard", label: "Dashboard", icon: "gauge-high" },
      { path: "/doctors", label: "Find Doctors", icon: "user-doctor" },
      { path: "/medicines", label: "Medicines", icon: "pills" },
    ],
  },
  {
    label: "Health",
    items: [
      { path: "/appointments", label: "Appointments", icon: "calendar-check" },
      { path: "/prescriptions", label: "Prescriptions", icon: "file-prescription" },
      { path: "/records", label: "Medical Records", icon: "folder-open" },
      { path: "/reports", label: "Lab Reports", icon: "vial-circle-check" },
    ],
  },
  {
    label: "Shopping",
    items: [
      { path: "/orders", label: "My Orders", icon: "truck" },
      { path: "/cart", label: "Cart", icon: "cart-shopping", badge: Store.get("cartCount") || 0 },
    ],
  },
  {
    label: "Account",
    items: [
      { path: "/messages", label: "Messages", icon: "envelope", badge: Store.get("messages") || 0 },
      { path: "/notifications", label: "Notifications", icon: "bell", badge: Store.get("unreadNotifications") || 0 },
      { path: "/support", label: "Support", icon: "headset" },
      { path: "/settings", label: "Settings", icon: "gear" },
      { path: "/profile", label: "My Profile", icon: "user" },
    ],
  },
];

const BOTTOM_NAV = [
  { path: "/dashboard", label: "Home", icon: "house" },
  { path: "/doctors", label: "Doctors", icon: "user-doctor" },
  { path: "/appointments/book", label: "Book", icon: "plus", center: true },
  { path: "/medicines", label: "Medicines", icon: "pills" },
  { path: "/more", label: "More", icon: "ellipsis" },
];

function bottomNav() {
  const current = Store.get("route")?.path || "/";
  return h("nav", { class: "bottom-nav", "aria-label": "Mobile navigation" }, BOTTOM_NAV.map((item) => {
    const active = current === item.path;
    if (item.center) {
      return h("div", { class: "bottom-nav-item bottom-nav-center" }, [
        h("button", {
          class: "bn-center-btn",
          "aria-label": "Book appointment",
          onclick: () => navigate(item.path),
        }, h("i", { class: `fa-solid fa-${item.icon}` })),
        h("span", { class: "bn-center-label" }, item.label),
      ]);
    }
    return h("a", {
      class: ["bottom-nav-item", active ? "active" : ""].filter(Boolean).join(" "),
      href: `#${item.path}`,
    }, [
      h("i", { class: `fa-solid fa-${item.icon}` }),
      h("span", {}, item.label),
    ]);
  }));
}

/** Render the full user shell; view mounts into #view-root. */
export async function userLayout() {
  if (!isAuthed()) return null;

  const frame = h("div", { class: "app-frame" }, [
    buildSidebar(NAV_GROUPS),
    h("div", { class: "app-main" }, [
      buildHeader({ menu: true, cart: true }),
      h("main", { class: "app-content" }, h("div", { id: "view-root" })),
    ]),
    bottomNav(),
  ]);

  initSidebarSync();
  initHeaderShortcuts();
  return frame;
}

export default { userLayout, NAV_GROUPS, BOTTOM_NAV };
