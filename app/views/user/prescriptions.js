/**
 * MediNova — View: Prescriptions list.
 */

import { h } from "../../utils/html.js";
import UserData from "../../services/UserDataService.js";
import { formatDate } from "../../utils/date.js";

export async function view() {
  const list = UserData.myPrescriptions().sort((a, b) => b.date.localeCompare(a.date));

  const items = h("div", { class: "grid-auto" });

  function render() {
    items.replaceChildren(
      list.length ? list.map((rx) =>
        h("div", { class: "mn-panel glass" }, [
          h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", flexWrap: "wrap" } }, [
            h("div", {}, [
              h("div", { style: { fontWeight: 700 } }, rx.doctorName),
              h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, rx.specialty),
            ]),
            h("span", { class: `badge ${rx.status === "active" ? "badge-success" : "badge-neutral"}` }, rx.status),
          ]),
          h("div", { style: { display: "flex", gap: "8px", margin: "12px 0", flexWrap: "wrap" } },
            rx.medicines.slice(0, 3).map((m) => h("span", { class: "chip chip-filter", style: { pointerEvents: "none" } }, m.name))),
          h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--glass-border)", paddingTop: "12px" } }, [
            h("span", { style: { color: "var(--text-muted)", fontSize: "12px" } }, formatDate(rx.date)),
            h("div", { style: { display: "flex", gap: "8px" } }, [
              h("a", { class: "btn btn-ghost btn-sm", href: `#/prescriptions/${rx.id}` }, h("i", { class: "fa-solid fa-eye" }), " View"),
              h("button", { class: "btn btn-ghost btn-sm", onclick: () => window.print() }, h("i", { class: "fa-solid fa-print" }), " Print"),
            ]),
          ]),
        ])) :
      h("div", { class: "span-full" }, h("mn-empty", { icon: "file-prescription", title: "No prescriptions yet", text: "Your prescriptions will appear here after consultations." }, h("a", { class: "btn btn-primary btn-sm", href: "#/doctors" }, "Consult a doctor"))),
    );
  }
  render();

  return h("div", { class: "anim-fade-up" }, [
    h("div", { class: "page-header" }, [
      h("h1", { style: { margin: 0, fontSize: "26px" } }, "My Prescriptions"),
      h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, `${list.length} prescription(s) issued to you`),
    ]),
    h("div", { style: { marginTop: "16px" } }, items),
  ]);
}

export const route = { path: "/prescriptions", title: "Prescriptions", layout: "user", auth: true, view };

export default { view, route };
