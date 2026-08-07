/**
 * MediNova — View: Admin activity logs.
 */

import { h } from "../../utils/html.js";
import * as Store from "../../errors/ErrorStore.js";
import { timeAgo } from "../../utils/date.js";

export async function view() {
  const errors = Store.getAll();
  const logCount = errors.length;

  const errorRows = errors.map((e) =>
    h("tr", {}, [
      h("td", {}, h("span", { class: "badge", style: { textTransform: "capitalize" } }, e.level)),
      h("td", {}, h("code", { style: { fontSize: "12px" } }, e.type)),
      h("td", {}, h("div", { style: { fontSize: "13px", maxWidth: "420px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, e.message)),
      h("td", {}, h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, e.module || "—")),
      h("td", {}, h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, e.page || "—")),
      h("td", {}, h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, timeAgo(e.time))),
    ]));

  return h("div", { class: "anim-fade-up" }, [
    h("div", { style: { marginBottom: "24px" } }, [h("h1", { style: { margin: 0, fontSize: "26px" } }, "System Logs"), h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, "Captured runtime events and application logs")]),
    h("div", { class: "mn-panel glass" }, [
      h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-scroll" })), h("div", {}, [h("div", { class: "panel-title" }, "Activity Log"), h("div", { class: "panel-subtitle" }, `${logCount} events recorded`)])])]),
      h("div", { class: "glass-body", style: { padding: 0 } },
        errorRows.length ? h("table", { class: "table" }, [h("thead", {}, h("tr", {}, [h("th", {}, "Level"), h("th", {}, "Type"), h("th", {}, "Message"), h("th", {}, "Module"), h("th", {}, "Page"), h("th", {}, "Time")])), h("tbody", {}, errorRows)])
          : h("div", { style: { padding: "32px" } }, h("mn-empty", { icon: "scroll", title: "No log entries", sub: "Errors and warnings captured automatically will appear here." }))),
    ]),
  ]);
}

export const route = { path: "/admin/logs", title: "System Logs", layout: "admin", auth: true, roles: ["admin", "super_admin"], view };

export default { view, route };
