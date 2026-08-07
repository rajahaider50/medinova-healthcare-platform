/**
 * MediNova — View: Appointment detail.
 */

import { h } from "../../utils/html.js";
import * as Router from "../../router/Router.js";
import * as Db from "../../data/db.js";
import * as Toast from "../../services/ToastService.js";
import UserData from "../../services/UserDataService.js";
import { money } from "../../utils/format.js";
import { formatDate, formatTime } from "../../utils/date.js";

const TONE = { confirmed: "success", pending: "warning", completed: "info", cancelled: "danger", "no-show": "neutral" };

export async function view(ctx) {
  const appt = UserData.myAppointments().find((a) => a.id === ctx.params.id);

  if (!appt) {
    return h("div", { class: "error-state" }, [
      h("div", { class: "error-icon" }, h("i", { class: "fa-solid fa-calendar-xmark" })),
      h("h3", {}, "Appointment not found"),
      h("a", { class: "btn btn-primary mt-3", href: "#/appointments" }, "Back to appointments"),
    ]);
  }

  const detailRow = (label, value) =>
    h("div", { style: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--glass-border)", gap: "16px" } }, [
      h("span", { style: { color: "var(--text-muted)" } }, label),
      h("span", { style: { fontWeight: 600, textAlign: "right" } }, value),
    ]);

  const cancelBtn = h("button", {
    class: "btn btn-outline",
    onclick: () => {
      Db.collection("appointments").update(appt.id, { status: "cancelled" });
      Toast.warning("Appointment cancelled", "Your appointment has been cancelled.");
      setTimeout(() => Router.reload(), 600);
    },
  }, h("i", { class: "fa-solid fa-ban" }), " Cancel Appointment");

  return h("div", { class: "anim-fade-up" }, [
    h("nav", { class: "breadcrumb" }, [h("a", { href: "#/appointments" }, "Appointments"), h("span", {}, " / "), h("span", {}, appt.id)]),
    h("div", { class: "grid", style: { gridTemplateColumns: "1.5fr 1fr", gap: "24px" } }, [
      h("div", { class: "mn-panel glass" }, [
        h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-file-invoice" })), h("div", {}, [h("div", { class: "panel-title" }, "Appointment Details"), h("div", { class: "panel-subtitle" }, `Reference: ${appt.id}`)])])]),
        h("div", { class: "glass-body" }, [
          detailRow("Doctor", appt.doctorName),
          detailRow("Type", appt.type === "online" ? "Online Consultation" : "In-person Visit"),
          detailRow("Date", formatDate(appt.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })),
          detailRow("Time", appt.time),
          detailRow("Status", h("span", { class: `badge badge-${TONE[appt.status] || "neutral"}` }, appt.status)),
          detailRow("Fee", money(appt.fee)),
          detailRow("Payment", h("span", { class: `badge ${appt.paymentStatus === "paid" ? "badge-success" : "badge-warning"}` }, appt.paymentStatus)),
          detailRow("Reason", appt.reason || "—"),
        ]),
      ]),
      h("div", { class: "mn-panel glass", style: { alignSelf: "flex-start" } }, [
        h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-gears" })), h("div", {}, [h("div", { class: "panel-title" }, "Actions")])])]),
        h("div", { class: "glass-body", style: { display: "flex", flexDirection: "column", gap: "10px" } }, [
          appt.status !== "cancelled" ? cancelBtn : null,
          h("a", { class: "btn btn-ghost", href: `#/messages?doctor=${appt.doctorId}` }, h("i", { class: "fa-solid fa-comment-medical" }), " Message Doctor"),
          h("button", {
            class: "btn btn-ghost",
            onclick: () => Toast.info("Reminder set", "We'll remind you 2 hours before this appointment."),
          }, h("i", { class: "fa-solid fa-bell" }), " Set Reminder"),
        ]),
      ]),
    ]),
  ]);
}

export const route = { path: "/appointments/:id", title: "Appointment", layout: "user", auth: true, view };

export default { view, route };
