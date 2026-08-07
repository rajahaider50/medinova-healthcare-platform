/**
 * MediNova — Admin layout.
 * Enterprise admin shell: sidebar + header + content (no bottom nav).
 */

import { h } from "../utils/html.js";
import { buildSidebar, initSidebarSync } from "./sidebar.js";
import { buildHeader, initHeaderShortcuts } from "./header.js";
import * as Store from "../state/store.js";
import { isAuthed } from "../services/AuthService.js";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { path: "/admin/dashboard", label: "Dashboard", icon: "gauge-high" },
      { path: "/admin/analytics", label: "Analytics", icon: "chart-line" },
      { path: "/admin/error-console", label: "Error Console", icon: "bug", badge: Store.get("errors") || 0 },
    ],
  },
  {
    label: "Management",
    items: [
      { path: "/admin/users", label: "Users", icon: "users" },
      { path: "/admin/doctors", label: "Doctors", icon: "user-doctor" },
      { path: "/admin/medicines", label: "Medicines", icon: "pills" },
      { path: "/admin/categories", label: "Categories", icon: "tags" },
      { path: "/admin/inventory", label: "Inventory", icon: "warehouse" },
    ],
  },
  {
    label: "Operations",
    items: [
      { path: "/admin/appointments", label: "Appointments", icon: "calendar-check" },
      { path: "/admin/prescriptions", label: "Prescriptions", icon: "file-prescription" },
      { path: "/admin/orders", label: "Orders", icon: "truck" },
      { path: "/admin/payments", label: "Payments", icon: "credit-card" },
      { path: "/admin/tickets", label: "Support Tickets", icon: "headset" },
    ],
  },
  {
    label: "System",
    items: [
      { path: "/admin/cms", label: "CMS", icon: "newspaper" },
      { path: "/admin/logs", label: "Logs", icon: "list" },
      { path: "/admin/security", label: "Security", icon: "shield-halved" },
      { path: "/admin/settings", label: "Settings", icon: "gear" },
    ],
  },
];

/** Render the admin shell. */
export async function adminLayout() {
  if (!isAuthed()) return null;

  return h("div", { class: "app-frame" }, [
    buildSidebar(NAV_GROUPS),
    h("div", { class: "app-main" }, [
      buildHeader({ menu: true, cart: false }),
      h("main", { class: "app-content wide" }, h("div", { id: "view-root" })),
    ]),
  ]);
}

export function initAdminLayout() {
  initSidebarSync();
  initHeaderShortcuts();
}

export default { adminLayout, NAV_GROUPS, initAdminLayout };
