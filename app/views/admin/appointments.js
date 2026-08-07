/**
 * MediNova — View: Admin appointments.
 */

import { h } from "../../utils/html.js";
import * as Db from "../../data/db.js";
import * as Toast from "../../services/ToastService.js";
import { timeAgo } from "../../utils/date.js";

const TONE = { confirmed: "success", pending: "warning", completed: "info", cancelled: "danger", "no-show": "neutral" };
const NEXT = { pending: "confirmed", confirmed: "completed", completed: "completed" };

export async function view() {
  const table = h("div", {});

  function render(status = "", term = "") {
    let list = Db.collection("appointments").all();
    if (status) list = list.filter((a) => a.status === status);
    if (term) list = list.filter((a) => `${a.patientName} ${a.doctorName} ${a.id}`.toLowerCase().includes(term.toLowerCase()));
    list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

    const rows = list.map((a) =>
      h("tr", {}, [
        h("td", {}, h("div", { style: { fontWeight: 600, fontSize: "14px" } }, a.patientName)),
        h("td", {}, h("div", {}, `Dr. ${a.doctorName}`)),
        h("td", {}, h("div", { style: { fontSize: "13px" } }, `${a.date} · ${a.time}`)),
        h("td", {}, h("span", { class: `badge badge-${TONE[a.status] || "neutral"}` }, a.status)),
        h("td", {}, h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, timeAgo(a.createdAt))),
        h("td", { style: { textAlign: "right" } }, NEXT[a.status] && NEXT[a.status] !== a.status
          ? h("button", { class: "btn btn-ghost btn-sm", onclick: () => { Db.collection("appointments").update(a.id, { status: NEXT[a.status] }); Toast.success("Updated", `Appointment ${a.id} marked ${NEXT[a.status]}.`); render(status, term); } }, `Mark ${NEXT[a.status]}`)
          : null),
      ]));
    table.replaceChildren(
      rows.length
        ? h("table", { class: "table" }, [h("thead", {}, h("tr", {}, [h("th", {}, "Patient"), h("th", {}, "Doctor"), h("th", {}, "Date · Time"), h("th", {}, "Status"), h("th", {}, "Created"), h("th", { style: { width: "110px" } }, "")])), h("tbody", {}, rows)])
        : h("div", { style: { padding: "32px" } }, h("mn-empty", { icon: "calendar-xmark", title: "No appointments", sub: "No bookings match the current filter." }))
    );
  }

  const statusFilter = h("select", { class: "input", style: { maxWidth: "160px" } }, [
    h("option", { value: "" }, "All statuses"),
    ...["pending", "confirmed", "completed", "cancelled", "no-show"].map((s) => h("option", { value: s }, s)),
  ]);
  const search = h("input", { class: "input", placeholder: "Search patient or doctor…" });
  statusFilter.addEventListener("change", () => render(statusFilter.value, search.value));
  search.addEventListener("input", () => render(statusFilter.value, search.value));
  render();

  const counts = Db.collection("appointments").all().reduce((acc, a) => ((acc[a.status] = (acc[a.status] || 0) + 1), acc), {});

  const header = h("div", { style: { marginBottom: "24px" } }, [
    h("div", { class: "flex items-center justify-between flex-wrap gap-3" }, [
      h("div", {}, [h("h1", { style: { margin: 0, fontSize: "26px" } }, "Appointments"), h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, "All patient bookings across the platform")]),
      h("button", { class: "btn btn-primary", onclick: () => Toast.info("Coming soon", "Manual booking form coming in the full release.") }, h("i", { class: "fa-solid fa-plus" }), " New Booking"),
    ]),
    h("div", { class: "grid grid-5", style: { marginTop: "16px" } }, ["pending", "confirmed", "completed", "cancelled", "no-show"].map((s) =>
      h("mn-stat", { label: s, value: String(counts[s] || 0), icon: "calendar", tone: "purple", sub: "" }))),
  ]);

  const panel = h("div", { class: "mn-panel glass", style: { marginTop: "24px" } }, [
    h("div", { class: "glass-header flex items-center justify-between flex-wrap gap-3" }, [search, statusFilter]),
    h("div", { class: "glass-body", style: { padding: 0 } }, table),
  ]);

  return h("div", { class: "anim-fade-up" }, [header, panel]);
}

export const route = { path: "/admin/appointments", title: "Appointments", layout: "admin", auth: true, roles: ["admin", "super_admin"], view };

export default { view, route };
