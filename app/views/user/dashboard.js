/**
 * MediNova — View: User dashboard.
 */

import { h } from "../../utils/html.js";
import * as Router from "../../router/Router.js";
import * as Store from "../../state/store.js";
import { currentUser } from "../../services/AuthService.js";
import UserData from "../../services/UserDataService.js";
import { doctors } from "../../data/mock/doctors.js";
import { formatDate, timeAgo } from "../../utils/date.js";
import { money } from "../../utils/format.js";

function statusTone(status) {
  return { confirmed: "success", pending: "warning", completed: "info", cancelled: "danger", "no-show": "neutral" }[status] || "neutral";
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export async function view() {
  const user = currentUser();
  const appointments = UserData.myAppointments();
  const prescriptions = UserData.myPrescriptions();
  const orders = UserData.myOrders();
  const records = UserData.myRecords();
  const upcoming = UserData.upcomingAppointments(3);
  const unread = UserData.unreadNotifications();

  Store.set("unreadNotifications", unread);

  const welcome = h("div", { class: "flex items-center justify-between flex-wrap gap-3", style: { marginBottom: "24px" } }, [
    h("div", {}, [
      h("h1", { style: { margin: 0, fontSize: "26px" } }, `${greeting()}, ${(user?.name || "there").split(" ")[0]}`),
      h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, formatDate(new Date(), { weekday: "long", day: "numeric", month: "long", year: "numeric" })),
    ]),
    h("a", { class: "btn btn-primary", href: "#/appointments/book" }, h("i", { class: "fa-solid fa-calendar-plus" }), " Book Appointment"),
  ]);

  const stats = h("div", { class: "grid grid-4", style: { marginBottom: "24px" } }, [
    h("mn-stat", { label: "Appointments", value: String(appointments.length), icon: "calendar-check", tone: "purple", sub: `${upcoming.length} upcoming` }),
    h("mn-stat", { label: "Prescriptions", value: String(prescriptions.length), icon: "file-prescription", tone: "success", sub: `${prescriptions.filter((p) => p.status === "active").length} active` }),
    h("mn-stat", { label: "Orders", value: String(orders.length), icon: "truck", tone: "info", sub: `${orders.filter((o) => o.status === "delivered").length} delivered` }),
    h("mn-stat", { label: "Records", value: String(records.length), icon: "folder-open", tone: "warning", sub: `${unread} unread notifications` }),
  ]);

  const upcomingPanel = h("div", { class: "mn-panel glass" }, [
    h("div", { class: "glass-header" }, [
      h("div", { class: "panel-heading" }, [
        h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-calendar-days" })),
        h("div", {}, [h("div", { class: "panel-title" }, "Upcoming Appointments"), h("div", { class: "panel-subtitle" }, "Your confirmed & pending visits")]),
      ]),
      h("a", { class: "btn btn-ghost btn-sm", href: "#/appointments" }, "View all"),
    ]),
    h("div", { class: "glass-body", style: { padding: 0 } },
      upcoming.length ? upcoming.map((a) =>
        h("a", { class: "appt-row", href: `#/appointments/${a.id}`, style: { display: "flex", gap: "12px", padding: "14px 20px", borderBottom: "1px solid var(--glass-border)", textDecoration: "none", color: "inherit" } }, [
          h("div", { class: "appt-date", style: { textAlign: "center", minWidth: "52px", borderRadius: "var(--radius-md)", background: "var(--bg-surface-2)", border: "1px solid var(--glass-border)", padding: "8px" } }, [
            h("div", { style: { fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)" } }, new Date(a.date).toLocaleDateString("en", { month: "short" })),
            h("div", { style: { fontSize: "20px", fontWeight: 700 } }, new Date(a.date).getDate()),
          ]),
          h("div", { style: { flex: 1, minWidth: 0 } }, [
            h("div", { style: { fontWeight: 600 } }, a.doctorName),
            h("div", { style: { color: "var(--text-muted)", fontSize: "13px" } }, h("i", { class: "fa-solid fa-clock" }), ` ${a.time} · ${a.type === "online" ? "Online" : "In-person"}`),
          ]),
          h("span", { class: `badge badge-${statusTone(a.status)}`, style: { alignSelf: "center" } }, a.status),
        ])) :
      h("div", { style: { padding: "24px" } },
        h("mn-empty", { icon: "calendar-xmark", title: "No upcoming appointments", text: "Book a visit with one of our specialists." }, h("a", { class: "btn btn-primary btn-sm", href: "#/appointments/book" }, "Book now"))),
    ),
  ]);

  const quickActions = h("div", { class: "mn-panel glass" }, [
    h("div", { class: "glass-header" }, [
      h("div", { class: "panel-heading" }, [
        h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-bolt" })),
        h("div", {}, [h("div", { class: "panel-title" }, "Quick Actions"), h("div", { class: "panel-subtitle" }, "Common tasks")]),
      ]),
    ]),
    h("div", { class: "quick-actions" }, [
      h("a", { class: "quick-action", href: "#/doctors" }, h("i", { class: "fa-solid fa-user-doctor" }), h("span", {}, "Find Doctor")),
      h("a", { class: "quick-action", href: "#/medicines" }, h("i", { class: "fa-solid fa-pills" }), h("span", {}, "Medicines")),
      h("a", { class: "quick-action", href: "#/orders" }, h("i", { class: "fa-solid fa-truck" }), h("span", {}, "Track Order")),
      h("a", { class: "quick-action", href: "#/reports" }, h("i", { class: "fa-solid fa-vial-circle-check" }), h("span", {}, "Lab Reports")),
      h("a", { class: "quick-action", href: "#/messages" }, h("i", { class: "fa-solid fa-comment-medical" }), h("span", {}, "Messages")),
      h("a", { class: "quick-action", href: "#/support" }, h("i", { class: "fa-solid fa-headset" }), h("span", {}, "Support")),
    ]),
  ]);

  const topDoctors = h("div", { class: "mn-panel glass" }, [
    h("div", { class: "glass-header" }, [
      h("div", { class: "panel-heading" }, [
        h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-user-doctor" })),
        h("div", {}, [h("div", { class: "panel-title" }, "Top Doctors"), h("div", { class: "panel-subtitle" }, "Highly rated specialists")]),
      ]),
      h("a", { class: "btn btn-ghost btn-sm", href: "#/doctors" }, "View all"),
    ]),
    h("div", { class: "glass-body", style: { padding: 0 } }, doctors.slice(0, 4).map((d) =>
      h("a", { class: "doc-row", href: `#/doctors/${d.slug}`, style: { display: "flex", gap: "12px", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid var(--glass-border)", textDecoration: "none", color: "inherit" } }, [
        h("span", { class: "avatar avatar-md" }, h("span", {}, d.name.replace("Dr. ", "").split(" ").map((p) => p[0]).slice(0, 2).join(""))),
        h("div", { style: { flex: 1, minWidth: 0 } }, [
          h("div", { style: { fontWeight: 600, fontSize: "14px" } }, d.name),
          h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, d.specialty),
        ]),
        h("div", { style: { textAlign: "right" } }, [
          h("div", { style: { fontWeight: 600, fontSize: "13px" } }, money(d.fee)),
          h("div", { class: "rating", style: { justifyContent: "flex-end" } }, h("i", { class: "fa-solid fa-star" }), h("span", { class: "rating-count" }, d.rating)),
        ]),
      ]))),
  ]);

  const recent = h("div", { class: "mn-panel glass" }, [
    h("div", { class: "glass-header" }, [
      h("div", { class: "panel-heading" }, [
        h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-bell" })),
        h("div", {}, [h("div", { class: "panel-title" }, "Recent Activity"), h("div", { class: "panel-subtitle" }, "Latest updates")]),
      ]),
      h("a", { class: "btn btn-ghost btn-sm", href: "#/notifications" }, "View all"),
    ]),
    h("div", { class: "glass-body", style: { padding: 0 } },
      UserData.myNotifications().slice(0, 5).map((n) =>
        h("div", { style: { display: "flex", gap: "12px", padding: "12px 20px", borderBottom: "1px solid var(--glass-border)", alignItems: "flex-start" } }, [
          h("div", { class: "icon-box icon-box-sm", style: { opacity: n.read ? 0.5 : 1 } }, h("i", { class: `fa-solid ${n.icon}` })),
          h("div", { style: { flex: 1, minWidth: 0 } }, [
            h("div", { style: { fontSize: "14px", fontWeight: n.read ? 500 : 600 } }, n.title),
            h("div", { style: { color: "var(--text-muted)", fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, n.message),
          ]),
          h("span", { style: { color: "var(--text-muted)", fontSize: "11px", whiteSpace: "nowrap" } }, timeAgo(n.createdAt)),
        ]))),
  ]);

  return h("div", { class: "anim-fade-up" }, [
    welcome,
    stats,
    h("div", { class: "grid", style: { gridTemplateColumns: "1.4fr 1fr" } }, [
      upcomingPanel,
      quickActions,
    ]),
    h("div", { class: "grid grid-2", style: { marginTop: "24px" } }, [topDoctors, recent]),
  ]);
}

export const route = { path: "/dashboard", title: "Dashboard", layout: "user", auth: true, view };

export default { view, route };
