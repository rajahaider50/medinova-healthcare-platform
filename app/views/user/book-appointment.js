/**
 * MediNova — View: Book appointment.
 */

import { h } from "../../utils/html.js";
import * as Router from "../../router/Router.js";
import * as Db from "../../data/db.js";
import * as Toast from "../../services/ToastService.js";
import { doctors, timeSlots } from "../../data/mock/doctors.js";
import { currentUser } from "../../services/AuthService.js";
import { money } from "../../utils/format.js";
import { uid } from "../../utils/id.js";
import { nextDays, weekday } from "../../utils/date.js";
import * as ErrorManager from "../../errors/ErrorManager.js";

export async function view(ctx) {
  const preSelected = ctx.query.doctor || "";
  const user = currentUser();

  const doctorSelect = h("select", { class: "select", id: "book-doctor" }, [
    h("option", { value: "" }, "Select a doctor"),
    ...doctors.map((d) => h("option", { value: d.id, selected: d.id === preSelected ? "selected" : null }, `${d.name} — ${d.specialty}`)),
  ]);

  const days = nextDays(7);
  const dateRadios = h("div", { class: "form-grid", style: { gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" } },
    days.map((d) => {
      const iso = d.toISOString().slice(0, 10);
      return h("label", { class: "date-option", style: { cursor: "pointer", textAlign: "center" } }, [
        h("input", { type: "radio", name: "book-date", value: iso, style: { display: "none" } }),
        h("div", { class: "date-opt-box", style: { padding: "10px 4px", borderRadius: "var(--radius-md)", border: "1px solid var(--glass-border)", background: "var(--bg-surface)" } }, [
          h("div", { style: { fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" } }, weekday(d).slice(0, 3)),
          h("div", { style: { fontSize: "18px", fontWeight: 700 } }, d.getDate()),
          h("div", { style: { fontSize: "10px", color: "var(--text-muted)" } }, d.toLocaleDateString("en", { month: "short" })),
        ]),
      ]);
    }));

  const slotSelect = h("select", { class: "select", id: "book-slot" }, [
    h("option", { value: "" }, "Select a time slot"),
    ...timeSlots.map((s) => h("option", { value: s }, s)),
  ]);

  const typeSelect = h("select", { class: "select", id: "book-type" }, [
    h("option", { value: "physical" }, "In-person visit"),
    h("option", { value: "online" }, "Online consultation"),
  ]);

  const reasonInput = h("textarea", { class: "textarea", id: "book-reason", rows: 3, placeholder: "Briefly describe your symptoms or reason for visit (optional)" });

  const feeBox = h("div", { class: "mn-panel glass", style: { marginTop: "16px" } }, [
    h("div", { class: "flex items-center justify-between" }, [
      h("span", { style: { color: "var(--text-muted)" } }, "Consultation fee"),
      h("span", { id: "fee-value", style: { fontWeight: 700, color: "var(--color-primary)", fontSize: "18px" } }, "—"),
    ]),
    h("button", { class: "btn btn-primary btn-lg btn-block", style: { marginTop: "16px" }, id: "book-submit" }, h("i", { class: "fa-solid fa-calendar-check" }), " Confirm Booking"),
  ]);

  const submitBtn = feeBox.querySelector("#book-submit");
  submitBtn.addEventListener("click", () => {
    const doctorId = doctorSelect.value;
    const date = document.querySelector('input[name="book-date"]:checked')?.value;
    const time = slotSelect.value;
    const type = typeSelect.value;

    if (!doctorId || !date || !time) {
      Toast.warning("Incomplete details", "Please choose a doctor, date, and time slot.");
      return;
    }

    const doc = doctors.find((d) => d.id === doctorId);
    try {
      const appt = Db.collection("appointments").insert({
        id: uid("apt"),
        patientId: user.id,
        patientName: user.name,
        doctorId,
        doctorName: doc.name,
        type,
        date,
        time,
        slot: time,
        reason: reasonInput.value.trim() || "General consultation",
        symptoms: [],
        status: "pending",
        notes: "",
        document: null,
        fee: doc.fee - (doc.discount || 0),
        paymentStatus: "unpaid",
      });
      Toast.success("Appointment booked", `Your appointment with ${doc.name} is pending confirmation.`);
      Router.navigate(`/appointments/${appt.id}`);
    } catch (err) {
      ErrorManager.report(err, { module: "book-appointment" });
      Toast.error("Booking failed", err.message || "Please try again.");
    }
  });

  doctorSelect.addEventListener("change", () => {
    const doc = doctors.find((d) => d.id === doctorSelect.value);
    feeBox.querySelector("#fee-value").textContent = doc ? money(doc.fee - (doc.discount || 0)) : "—";
  });

  return h("div", { class: "anim-fade-up", style: { maxWidth: "820px", margin: "0 auto" } }, [
    h("div", { class: "page-header" }, [
      h("h1", { style: { margin: 0, fontSize: "26px" } }, "Book an Appointment"),
      h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, "Choose a specialist and reserve your slot"),
    ]),
    h("div", { class: "mn-panel glass", style: { marginTop: "16px" } }, [
      h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-user-doctor" })), h("div", {}, [h("div", { class: "panel-title" }, "Step 1 · Doctor")])])]),
      h("div", { class: "glass-body" }, [
        h("label", { class: "form-label" }, "Select doctor"),
        doctorSelect,
      ]),
    ]),
    h("div", { class: "mn-panel glass", style: { marginTop: "16px" } }, [
      h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-calendar-days" })), h("div", {}, [h("div", { class: "panel-title" }, "Step 2 · Date & Time")])])]),
      h("div", { class: "glass-body" }, [
        h("label", { class: "form-label" }, "Choose date"),
        dateRadios,
        h("div", { class: "form-grid-3", style: { marginTop: "16px" } }, [
          h("div", {}, [h("label", { class: "form-label", for: "book-slot" }, "Time slot"), slotSelect]),
          h("div", {}, [h("label", { class: "form-label", for: "book-type" }, "Visit type"), typeSelect]),
        ]),
      ]),
    ]),
    h("div", { class: "mn-panel glass", style: { marginTop: "16px" } }, [
      h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-notes-medical" })), h("div", {}, [h("div", { class: "panel-title" }, "Step 3 · Details")])])]),
      h("div", { class: "glass-body" }, [
        h("label", { class: "form-label", for: "book-reason" }, "Reason for visit"),
        reasonInput,
      ]),
    ]),
    feeBox,
  ]);
}

export const route = { path: "/appointments/book", title: "Book Appointment", layout: "user", auth: true, view };

export default { view, route };
