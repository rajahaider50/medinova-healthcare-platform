/**
 * MediNova — View: Prescription detail (print-friendly).
 */

import { h } from "../../utils/html.js";
import UserData from "../../services/UserDataService.js";
import { formatDate } from "../../utils/date.js";

export async function view(ctx) {
  const rx = UserData.myPrescriptions().find((p) => p.id === ctx.params.id);

  if (!rx) {
    return h("div", { class: "error-state" }, [
      h("div", { class: "error-icon" }, h("i", { class: "fa-solid fa-file-prescription" })),
      h("h3", {}, "Prescription not found"),
      h("a", { class: "btn btn-primary mt-3", href: "#/prescriptions" }, "Back to prescriptions"),
    ]);
  }

  const rxDoc = h("div", { class: "mn-panel glass", id: "print-area", style: { maxWidth: "680px", margin: "0 auto" } }, [
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", borderBottom: "2px solid var(--color-primary)", flexWrap: "wrap", gap: "8px" } }, [
      h("div", {}, [
        h("div", { style: { fontWeight: 800, fontSize: "20px", color: "var(--color-primary)" } }, "MediNova"),
        h("div", { style: { fontSize: "12px", color: "var(--text-muted)" } }, "Smart Healthcare. Simple. Secure."),
      ]),
      h("div", { style: { textAlign: "right" } }, [
        h("div", { style: { fontWeight: 600 } }, "Prescription"),
        h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, rx.id),
      ]),
    ]),
    h("div", { class: "glass-body" }, [
      h("div", { style: { display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", padding: "8px 0" } }, [
        h("div", {}, [
          h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, "Prescribed by"),
          h("div", { style: { fontWeight: 600 } }, rx.doctorName),
          h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, rx.specialty),
        ]),
        h("div", { style: { textAlign: "right" } }, [
          h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, "Patient"),
          h("div", { style: { fontWeight: 600 } }, rx.patientName),
          h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, `Issued: ${formatDate(rx.date, { year: "numeric", month: "long", day: "numeric" })}`),
        ]),
      ]),
      h("div", { class: "divider", style: { margin: "12px 0" } }),
      h("h3", { style: { fontSize: "15px", margin: "0 0 10px" } }, `Diagnosis: ${rx.diagnosis}`),
      h("div", { class: "table-wrap" }, h("table", { class: "table" }, [
        h("thead", {}, h("tr", {}, [h("th", {}, "Medicine"), h("th", {}, "Dosage"), h("th", {}, "Frequency"), h("th", {}, "Duration"), h("th", {}, "Instructions")])),
        h("tbody", {}, rx.medicines.map((m) =>
          h("tr", {}, [h("td", {}, m.name), h("td", {}, m.dosage), h("td", {}, m.frequency), h("td", {}, m.duration), h("td", {}, m.instructions)]))),
      ])),
      h("div", { style: { marginTop: "14px" } }, [
        h("h3", { style: { fontSize: "14px", margin: "0 0 6px" } }, "Doctor's advice"),
        h("p", { style: { color: "var(--text-secondary)", fontSize: "14px", margin: 0 } }, rx.advice || "—"),
      ]),
      rx.refillable ? h("div", { style: { marginTop: "12px" } }, h("span", { class: "badge badge-success" }, h("i", { class: "fa-solid fa-rotate" }), " Refillable")) : null,
    ]),
  ]);

  return h("div", { class: "anim-fade-up" }, [
    h("div", { style: { display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", marginBottom: "16px" } }, [
      h("a", { class: "btn btn-ghost", href: "#/prescriptions" }, h("i", { class: "fa-solid fa-arrow-left" }), " Back"),
      h("div", { style: { display: "flex", gap: "8px" } }, [
        h("button", { class: "btn btn-outline", onclick: () => window.print() }, h("i", { class: "fa-solid fa-print" }), " Print / Save PDF"),
        h("button", { class: "btn btn-primary", onclick: () => navigator.clipboard?.writeText(`MediNova Rx ${rx.id}`) }, h("i", { class: "fa-solid fa-share" }), " Share"),
      ]),
    ]),
    rxDoc,
  ]);
}

export const route = { path: "/prescriptions/:id", title: "Prescription", layout: "user", auth: true, view };

export default { view, route };
