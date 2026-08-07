/**
 * MediNova — View: Admin analytics.
 * Live metrics derived from the database (empty-by-default friendly).
 */

import { h } from "../../utils/html.js";
import Admin from "../../services/AdminDataService.js";
import { compactNumber } from "../../utils/format.js";

export async function view() {
  const c = Admin.counts();
  const growth = Admin.userGrowth();
  const appts = Admin.appointmentSeries();
  const revenue = Admin.revenueSeries();
  const weekly = Admin.weeklyActivity();
  const popular = Admin.popularMedicines();

  const last = (arr) => (arr.length ? arr[arr.length - 1] : null);

  const header = h("div", { style: { marginBottom: "24px" } }, [
    h("h1", { style: { margin: 0, fontSize: "26px" } }, "Analytics"),
    h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, "Growth, revenue and platform engagement overview"),
  ]);

  const stats = h("div", { class: "grid grid-4", style: { marginBottom: "24px" } }, [
    h("mn-stat", { label: "Total Users", value: compactNumber(last(growth)?.users || 0), icon: "users", tone: "purple", sub: "registered accounts" }),
    h("mn-stat", { label: "Doctors", value: String(c.doctors), icon: "user-doctor", tone: "info", sub: "verified specialists" }),
    h("mn-stat", { label: "Revenue", value: compactNumber(last(revenue)?.value || 0), icon: "coins", tone: "success", sub: "latest month (Rs)" }),
    h("mn-stat", { label: "Appointments", value: compactNumber(last(appts)?.value || 0), icon: "calendar-check", tone: "warning", sub: "this month" }),
  ]);

  const growthPanel = h("div", { class: "mn-panel glass" }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-user-plus" })), h("div", {}, [h("div", { class: "panel-title" }, "User Growth"), h("div", { class: "panel-subtitle" }, "Cumulative users per month")])])]),
    h("div", { class: "glass-body" }, h("mn-chart", { type: "line", labels: growth.map((m) => m.label).join(","), data: JSON.stringify(growth.map((m) => m.users)), height: "220" })),
  ]);

  const weeklyPanel = h("div", { class: "mn-panel glass" }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-bolt" })), h("div", {}, [h("div", { class: "panel-title" }, "Weekly Activity"), h("div", { class: "panel-subtitle" }, "Actions this week")])])]),
    h("div", { class: "glass-body" }, h("mn-chart", { type: "bar", labels: weekly.map((w) => w.label).join(","), data: JSON.stringify(weekly.map((w) => w.value)), height: "220" })),
  ]);

  const popularPanel = h("div", { class: "mn-panel glass", style: { marginTop: "24px" } }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-pills" })), h("div", {}, [h("div", { class: "panel-title" }, "Popular Medicines"), h("div", { class: "panel-subtitle" }, "Top selling products")])])]),
    h("div", { class: "glass-body", style: { padding: 0 } },
      popular.length ? popular.map((m, i) =>
        h("div", { style: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 20px", borderBottom: "1px solid var(--glass-border)" } }, [
          h("span", { class: "rank", style: { width: "24px", color: "var(--text-muted)", fontWeight: 700 } }, `${i + 1}`),
          h("div", { style: { flex: 1 } }, [
            h("div", { style: { fontWeight: 600, fontSize: "14px" } }, m.name),
            h("div", { class: "progress", style: { marginTop: "6px" } }, h("div", { class: "progress-fill", style: { width: `${(m.sales / popular[0].sales) * 100}%` } })),
          ]),
          h("span", { class: "badge badge-success" }, compactNumber(m.sales)),
        ])) :
      h("div", { style: { padding: "32px" } }, h("mn-empty", { icon: "pills", title: "No sales data yet", text: "Popular medicines appear once orders are delivered." })),
    ),
  ]);

  const revenuePanel = h("div", { class: "mn-panel glass", style: { marginTop: "24px" } }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-chart-line" })), h("div", {}, [h("div", { class: "panel-title" }, "Revenue"), h("div", { class: "panel-subtitle" }, "Monthly revenue in Rs")])])]),
    h("div", { class: "glass-body" }, h("mn-chart", { type: "line", labels: revenue.map((r) => r.label).join(","), data: JSON.stringify(revenue.map((r) => r.value)), height: "220" })),
  ]);

  return h("div", { class: "anim-fade-up" }, [
    header, stats,
    h("div", { class: "grid", style: { gridTemplateColumns: "1.5fr 1fr", marginBottom: "24px" } }, [growthPanel, weeklyPanel]),
    popularPanel, revenuePanel,
  ]);
}

export const route = { path: "/admin/analytics", title: "Analytics", layout: "admin", auth: true, roles: ["admin", "super_admin"], view };

export default { view, route };
