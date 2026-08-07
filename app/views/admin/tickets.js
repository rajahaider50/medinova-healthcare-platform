/**
 * MediNova — View: Admin support tickets.
 */

import { h } from "../../utils/html.js";
import * as Db from "../../data/db.js";
import * as Toast from "../../services/ToastService.js";
import { timeAgo } from "../../utils/date.js";

const TONE = { open: "warning", pending: "info", "in-progress": "info", resolved: "success", closed: "neutral" };
const PRIORITY = { high: "danger", medium: "warning", low: "neutral" };

export async function view() {
  const table = h("div", {});

  function render(status = "") {
    let list = Db.collection("tickets").all();
    if (status) list = list.filter((t) => t.status === status);
    list.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));

    const rows = list.map((t) =>
      h("tr", {}, [
        h("td", {}, h("div", { style: { fontWeight: 600, fontSize: "14px" } }, t.subject)),
        h("td", {}, h("div", { style: { color: "var(--text-muted)", fontSize: "13px" } }, t.userName)),
        h("td", {}, h("span", { class: "badge badge-neutral" }, t.category)),
        h("td", {}, h("span", { class: `badge badge-${PRIORITY[t.priority] || "neutral"}` }, t.priority)),
        h("td", {}, h("span", { class: `badge badge-${TONE[t.status] || "neutral"}` }, t.status)),
        h("td", {}, h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, timeAgo(t.updatedAt))),
        h("td", { style: { textAlign: "right" } }, h("button", { class: "btn btn-ghost btn-sm", onclick: () => { if (t.status !== "resolved") { Db.collection("tickets").update(t.id, { status: "resolved" }); Toast.success("Resolved", `Ticket ${t.id} marked resolved.`); render(statusFilter.value); } } }, h("i", { class: "fa-solid fa-circle-check" }), " Resolve")),
      ]));
    table.replaceChildren(
      rows.length
        ? h("table", { class: "table" }, [h("thead", {}, h("tr", {}, [h("th", {}, "Subject"), h("th", {}, "User"), h("th", {}, "Category"), h("th", {}, "Priority"), h("th", {}, "Status"), h("th", {}, "Updated"), h("th", { style: { width: "90px" } }, "")])), h("tbody", {}, rows)])
        : h("div", { style: { padding: "32px" } }, h("mn-empty", { icon: "headset", title: "No tickets", sub: "No support tickets match the filter." }))
    );
  }

  const statusFilter = h("select", { class: "input", style: { maxWidth: "160px" } }, [
    h("option", { value: "" }, "All statuses"),
    ...["open", "pending", "in-progress", "resolved", "closed"].map((s) => h("option", { value: s }, s)),
  ]);
  statusFilter.addEventListener("change", () => render(statusFilter.value));
  render();

  const open = Db.collection("tickets").all().filter((t) => t.status === "open" || t.status === "in-progress" || t.status === "pending").length;

  const header = h("div", { style: { marginBottom: "24px" } }, [
    h("div", { class: "flex items-center justify-between flex-wrap gap-3" }, [
      h("div", {}, [h("h1", { style: { margin: 0, fontSize: "26px" } }, "Support Tickets"), h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, "Customer support queue")]),
      h("span", { class: `badge ${open ? "badge-warning" : "badge-success"}` }, open ? `${open} open tickets` : "Queue clear"),
    ]),
  ]);

  const panel = h("div", { class: "mn-panel glass", style: { marginTop: "16px" } }, [
    h("div", { class: "glass-header" }, [statusFilter]),
    h("div", { class: "glass-body", style: { padding: 0 } }, table),
  ]);

  return h("div", { class: "anim-fade-up" }, [header, panel]);
}

export const route = { path: "/admin/tickets", title: "Tickets", layout: "admin", auth: true, roles: ["admin", "super_admin"], view };

export default { view, route };
