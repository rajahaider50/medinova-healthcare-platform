/**
 * MediNova — View: Appointments list.
 */

import { h } from "../../utils/html.js";
import UserData from "../../services/UserDataService.js";
import { money } from "../../utils/format.js";
import { formatDate } from "../../utils/date.js";

const TONE = { confirmed: "success", pending: "warning", completed: "info", cancelled: "danger", "no-show": "neutral" };

function statusBadge(status) {
  return h("span", { class: `badge badge-${TONE[status] || "neutral"}` }, status.replace("-", " "));
}

export async function view() {
  const all = UserData.myAppointments();
  const upcoming = all.filter((a) => a.status === "confirmed" || a.status === "pending");
  const past = all.filter((a) => a.status === "completed" || a.status === "cancelled" || a.status === "no-show");

  const listSection = (label, items) =>
    h("div", { class: "mn-panel glass", style: { marginTop: "24px" } }, [
      h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-calendar-days" })), h("div", {}, [h("div", { class: "panel-title" }, label), h("div", { class: "panel-subtitle" }, `${items.length} appointment(s)`)])])]),
      h("div", { class: "glass-body", style: { padding: 0 } },
        items.length ? items.map((a) =>
          h("a", { class: "appt-row", href: `#/appointments/${a.id}`, style: { display: "flex", gap: "14px", padding: "16px 20px", borderBottom: "1px solid var(--glass-border)", textDecoration: "none", color: "inherit", flexWrap: "wrap", alignItems: "center" } }, [
            h("div", { style: { minWidth: "56px", textAlign: "center", borderRadius: "var(--radius-md)", background: "var(--bg-surface-2)", border: "1px solid var(--glass-border)", padding: "8px" } }, [
              h("div", { style: { fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)" } }, formatDate(a.date, { month: "short" })),
              h("div", { style: { fontSize: "20px", fontWeight: 700 } }, formatDate(a.date, { day: "2-digit" })),
            ]),
            h("div", { style: { flex: 1, minWidth: 180 } }, [
              h("div", { style: { fontWeight: 600 } }, a.doctorName),
              h("div", { style: { color: "var(--text-muted)", fontSize: "13px" } }, h("i", { class: "fa-solid fa-clock" }), ` ${a.time} · ${a.type === "online" ? "Online" : "In-person"}`),
              h("div", { style: { color: "var(--text-muted)", fontSize: "12px", marginTop: "2px" } }, a.reason),
            ]),
            h("div", { style: { textAlign: "right" } }, [
              statusBadge(a.status),
              h("div", { style: { color: "var(--text-muted)", fontSize: "12px", marginTop: "4px" } }, money(a.fee)),
            ]),
          ])) :
        h("div", { style: { padding: "24px" } }, h("mn-empty", { icon: "calendar-xmark", title: "No appointments here", text: "Book your first appointment today." }, h("a", { class: "btn btn-primary btn-sm", href: "#/appointments/book" }, "Book now")))),
    ]);

  return h("div", { class: "anim-fade-up" }, [
    h("div", { class: "page-header flex items-center justify-between flex-wrap gap-3" }, [
      h("div", {}, [
        h("h1", { style: { margin: 0, fontSize: "26px" } }, "My Appointments"),
        h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, "Manage your visits and consultations"),
      ]),
      h("a", { class: "btn btn-primary", href: "#/appointments/book" }, h("i", { class: "fa-solid fa-calendar-plus" }), " Book Appointment"),
    ]),
    listSection("Upcoming", upcoming),
    listSection("Past", past),
  ]);
}

export const route = { path: "/appointments", title: "My Appointments", layout: "user", auth: true, view };

export default { view, route };
