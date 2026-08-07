/**
 * MediNova — View: Admin Error Console (global system logs).
 */

import { h } from "../../utils/html.js";
import * as Store from "../../errors/ErrorStore.js";
import * as Toast from "../../services/ToastService.js";
import { timeAgo } from "../../utils/date.js";

const LEVEL_TONE = { critical: "danger", error: "danger", warning: "warning", info: "info" };
const LEVEL_ICON = { critical: "fa-circle-exclamation", error: "fa-bug", warning: "fa-triangle-exclamation", info: "fa-circle-info" };

export async function view() {
  const container = h("div", { class: "anim-fade-up" });

  function renderList(term = "", severity = "") {
    const items = Store.search(term, { severity });
    const counts = Store.counts();

    const list = h("div", {}, items.length ? items.map((e) =>
      h("div", { class: "error-row", style: { display: "flex", gap: "12px", padding: "12px 16px", borderBottom: "1px solid var(--glass-border)", alignItems: "flex-start" } }, [
        h("div", { class: `icon-box icon-box-${LEVEL_TONE[e.level]}`, style: { minWidth: "34px" } }, h("i", { class: `fa-solid ${LEVEL_ICON[e.level]}` })),
        h("div", { style: { flex: 1, minWidth: 0 } }, [
          h("div", { style: { display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" } }, [
            h("span", { class: "badge badge-danger", style: { textTransform: "capitalize" } }, e.level),
            h("span", { class: "badge badge-neutral" }, e.type),
            e.module && h("span", { class: "badge badge-neutral" }, e.module),
          ]),
          h("div", { style: { marginTop: "6px", fontFamily: "monospace", fontSize: "13px", wordBreak: "break-word" } }, e.message),
          h("div", { style: { marginTop: "4px", color: "var(--text-muted)", fontSize: "12px" } }, [
            e.file ? `${e.file}` : "",
            e.file && e.function ? " · " : "",
            e.function ? `in ${e.function}()` : "",
            e.page ? ` · ${e.page}` : "",
            h("span", { style: { float: "right" } }, `${timeAgo(e.time)} · ${e.id}`),
          ]),
        ]),
      ])) : h("div", { style: { padding: "32px" } }, h("mn-empty", { icon: "shield-check", title: "No errors recorded", sub: "All systems operational." })));
    list.classList.add("error-list");
    return list;
  }

  const searchInput = h("input", { class: "input", placeholder: "Search by id, message, file, module…" });
  const filters = h("div", { class: "segmented", style: { display: "flex", gap: "4px" } }, [
    ...["", "critical", "error", "warning", "info"].map((lvl) =>
      h("button", { class: `segment ${lvl === "" ? "active" : ""}`, onclick: (e) => {
        filters.querySelectorAll(".segment").forEach((b) => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        body.replaceChildren(renderList(searchInput.value, lvl));
      } }, lvl === "" ? "All" : lvl.charAt(0).toUpperCase() + lvl.slice(1))),
  ]);

  const body = h("div", { style: { minHeight: "200px" } }, renderList());

  const refresh = () => body.replaceChildren(renderList(searchInput.value, ""));
  searchInput.addEventListener("input", refresh);

  function countChips(c) {
    return [
      h("mn-stat", { label: "Total", value: String(c.total), icon: "server", tone: "purple", sub: "all events" }),
      h("mn-stat", { label: "Critical", value: String(c.critical), icon: "circle-exclamation", tone: "danger", sub: "needs action" }),
      h("mn-stat", { label: "Errors", value: String(c.error), icon: "bug", tone: "warning", sub: "runtime errors" }),
      h("mn-stat", { label: "Warnings", value: String(c.warning), icon: "triangle-exclamation", tone: "info", sub: "non-fatal" }),
    ];
  }
  const countsEl = h("div", { class: "grid grid-4" }, countChips(Store.counts()));

  const header = h("div", { class: "flex items-center justify-between flex-wrap gap-3", style: { marginBottom: "24px" } }, [
    h("div", {}, [h("h1", { style: { margin: 0, fontSize: "26px" } }, "Error Console"), h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, "Global runtime error monitor — captured automatically from across the app")]),
    h("div", { style: { display: "flex", gap: "8px" } }, [
      h("button", { class: "btn btn-outline btn-sm", onclick: () => { const blob = new Blob([Store.exportJson()], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "medinova-errors.json"; a.click(); } }, h("i", { class: "fa-solid fa-file-arrow-down" }), " Export JSON"),
      h("button", { class: "btn btn-outline btn-sm", onclick: () => { const blob = new Blob([Store.exportCsv()], { type: "text/csv" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "medinova-errors.csv"; a.click(); } }, h("i", { class: "fa-solid fa-table" }), " Export CSV"),
      h("button", { class: "btn btn-danger btn-sm", onclick: () => { Store.clear(); Toast.info("Console cleared"); } }, h("i", { class: "fa-solid fa-broom" }), " Clear"),
    ]),
  ]);

  const panel = h("div", { class: "mn-panel glass", style: { marginTop: "24px" } }, [
    h("div", { class: "glass-header flex items-center justify-between flex-wrap gap-3" }, [searchInput, filters]),
    h("div", { class: "glass-body", style: { padding: 0 } }, body),
  ]);

  container.append(header, countsEl, panel);

  return container;
}

export const route = { path: "/admin/error-console", title: "Error Console", layout: "admin", auth: true, roles: ["admin", "super_admin"], view };

export default { view, route };
