/**
 * MediNova — View: Admin dashboard.
 */

import { h } from "../../utils/html.js";
import { currentUser } from "../../services/AuthService.js";
import Admin from "../../services/AdminDataService.js";
import { money } from "../../utils/format.js";
import { timeAgo } from "../../utils/date.js";
import { analytics } from "../../data/mock/reviews.js";

const TONE = { confirmed: "success", pending: "warning", completed: "info", cancelled: "danger", "no-show": "neutral" };

export async function view() {
  const user = currentUser();
  const c = Admin.counts();
  const recent = Admin.recentAppointments(6);
  const statusBy = Admin.appointmentsByStatus();

  const header = h("div", { class: "flex items-center justify-between flex-wrap gap-3", style: { marginBottom: "24px" } }, [
    h("div", {}, [
      h("h1", { style: { margin: 0, fontSize: "26px" } }, "Admin Dashboard"),
      h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, `Welcome back, ${user?.name?.split(" ").slice(0, 2).join(" ") || "Admin"}`),
    ]),
    h("div", { style: { display: "flex", gap: "8px" } }, [
      h("a", { class: "btn btn-outline", href: "#/admin/analytics" }, h("i", { class: "fa-solid fa-chart-line" }), " Analytics"),
      h("a", { class: "btn btn-primary", href: "#/admin/users" }, h("i", { class: "fa-solid fa-user-plus" }), " Manage Users"),
    ]),
  ]);

  const stats = h("div", { class: "grid grid-4", style: { marginBottom: "24px" } }, [
    h("mn-stat", { label: "Total Users", value: String(c.users), icon: "users", tone: "purple", sub: "across all roles" }),
    h("mn-stat", { label: "Doctors", value: String(c.doctors), icon: "user-doctor", tone: "info", sub: "verified specialists" }),
    h("mn-stat", { label: "Medicines", value: String(c.medicines), icon: "pills", tone: "success", sub: "in catalog" }),
    h("mn-stat", { label: "Appointments", value: String(c.appointments), icon: "calendar-check", tone: "warning", sub: `${statusBy.pending || 0} pending` }),
  ]);

  const revenue = h("div", { class: "mn-panel glass" }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-chart-line" })), h("div", {}, [h("div", { class: "panel-title" }, "Revenue Trend"), h("div", { class: "panel-subtitle" }, "Monthly earnings (demo)")])])]),
    h("div", { class: "glass-body" }, h("mn-chart", {
      type: "line",
      labels: analytics.revenue.map((r) => r.label).join(","),
      data: JSON.stringify(analytics.revenue.map((r) => r.value)),
      height: "220",
    })),
  ]);

  const statusChart = h("div", { class: "mn-panel glass" }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-chart-pie" })), h("div", {}, [h("div", { class: "panel-title" }, "Appointments by Status")])])]),
    h("div", { class: "glass-body" }, [
      h("mn-chart", {
        type: "donut",
        data: JSON.stringify(Object.values(statusBy)),
        labels: Object.keys(statusBy).join(","),
        donutTitle: String(c.appointments),
        height: "200",
      }),
      h("div", { class: "chart-legend" }, Object.entries(statusBy).map(([k, v], i) =>
        h("div", { class: "legend-item" }, [h("span", { class: `legend-dot` }), h("span", {}, `${k} — ${v}`)]))),
    ]),
  ]);

  const recentPanel = h("div", { class: "mn-panel glass" }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-clock-rotate-left" })), h("div", {}, [h("div", { class: "panel-title" }, "Recent Appointments"), h("div", { class: "panel-subtitle" }, "Latest bookings")])]), h("a", { class: "btn btn-ghost btn-sm", href: "#/admin/appointments" }, "View all")]),
    h("div", { class: "glass-body", style: { padding: 0 } },
      recent.length ? recent.map((a) =>
        h("div", { style: { display: "flex", gap: "12px", padding: "12px 20px", borderBottom: "1px solid var(--glass-border)", alignItems: "center" } }, [
          h("span", { class: "avatar avatar-sm" }, h("span", {}, a.patientName.split(" ").map((p) => p[0]).slice(0, 2).join(""))),
          h("div", { style: { flex: 1, minWidth: 0 } }, [
            h("div", { style: { fontWeight: 600, fontSize: "14px" } }, a.patientName),
            h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, `${a.doctorName} · ${a.date} ${a.time}`),
          ]),
          h("span", { class: `badge badge-${TONE[a.status] || "neutral"}` }, a.status),
          h("span", { style: { color: "var(--text-muted)", fontSize: "11px", whiteSpace: "nowrap" } }, timeAgo(a.createdAt)),
        ])) :
      h("div", { style: { padding: "24px" } }, h("mn-empty", { icon: "calendar-xmark", title: "No appointments" }))),
  ]);

  const orderStats = h("div", { class: "grid grid-3", style: { marginBottom: "24px" } }, [
    h("mn-stat", { label: "Orders", value: String(c.orders), icon: "truck", tone: "info", sub: "pharmacy orders" }),
    h("mn-stat", { label: "Tickets", value: String(c.tickets), icon: "headset", tone: "purple", sub: "support tickets" }),
    h("mn-stat", { label: "Categories", value: String(c.categories), icon: "tags", tone: "success", sub: "product categories" }),
  ]);

  return h("div", { class: "anim-fade-up" }, [
    header,
    stats,
    orderStats,
    h("div", { class: "grid", style: { gridTemplateColumns: "1.5fr 1fr", marginBottom: "24px" } }, [revenue, statusChart]),
    recentPanel,
  ]);
}

export const route = { path: "/admin/dashboard", title: "Admin Dashboard", layout: "admin", auth: true, roles: ["admin", "super_admin"], view };

export default { view, route };
