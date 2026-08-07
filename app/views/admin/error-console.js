/**
 * MediNova — View: Admin Error Console (global system logs).
 */

import { h } from "../../utils/html.js";
import * as Store from "../../errors/ErrorStore.js";
import * as Toast from "../../services/ToastService.js";
import { timeAgo } from "../../utils/date.js";

const LEVEL_TONE = { critical: "error", error: "error", warning: "warning", info: "info" };
const LEVEL_ICON = { critical: "fa-circle-exclamation", error: "fa-bug", warning: "fa-triangle-exclamation", info: "fa-circle-info" };

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    return true;
  } catch {
    return false;
  }
}

export async function view() {
  const container = h("div", { class: "anim-fade-up" });

  function renderRow(e) {
    const sev = h("span", { class: `ec-sev ${e.level}` });
    const body = h("div", { class: "ec-body" }, [
      h("div", { class: "ec-msg" }, `${e.message} ${e.type ? `[${e.type}]` : ""}`),
      h("div", { class: "ec-meta" }, [
        h("span", { class: "ec-id" }, e.id),
        e.module && h("span", {}, e.module),
        e.page && h("span", {}, e.page),
        h("span", { class: "ec-time" }, timeAgo(e.time)),
        e.file && h("span", { class: "ec-file" }, e.function ? `${e.file} → ${e.function}()` : e.file),
      ]),
    ]);
    const actions = h("div", { class: "flex", style: { gap: "6px", flexShrink: 0 } }, [
      h("button", { class: "btn btn-ghost btn-icon ec-action-copy", title: "Copy message", "aria-label": "Copy message", onclick: async (ev) => {
        ev.stopPropagation();
        const ok = await copyText(`${e.level.toUpperCase()} [${e.type}] ${e.message}\n${e.file || ""}\n${e.stack || ""}`);
        if (ok) Toast.success("Copied to clipboard");
        else Toast.error("Copy failed");
      } }, h("i", { class: "fa-solid fa-copy" })),
      h("button", { class: "btn btn-ghost btn-icon", title: "Dismiss", "aria-label": "Dismiss", onclick: (ev) => {
        ev.stopPropagation();
        Store.remove(e.id);
        Toast.info("Entry dismissed");
      } }, h("i", { class: "fa-solid fa-xmark" })),
    ]);

    const detail = h("div", { class: "ec-detail", style: { display: "none" } }, [
      h("h4", {}, "Details"),
      h("dl", { class: "ec-kv" }, [
        e.level && h("dt", {}, "Level"), e.level && h("dd", {}, e.level),
        e.type && h("dt", {}, "Type"), e.type && h("dd", {}, e.type),
        e.module && h("dt", {}, "Module"), e.module && h("dd", {}, e.module),
        e.page && h("dt", {}, "Page"), e.page && h("dd", {}, e.page),
        e.function && h("dt", {}, "Function"), e.function && h("dd", {}, `${e.function}()`),
        e.id && h("dt", {}, "ID"), e.id && h("dd", {}, e.id),
        e.time && h("dt", {}, "Time"), e.time && h("dd", {}, new Date(e.time).toLocaleString()),
      ]),
      e.stack ? h("div", { class: "ec-stack" }, e.stack) : h("div", { class: "ec-stack" }, "No stack trace captured."),
      h("div", { class: "ec-actions" }, [
        h("button", { class: "btn btn-outline btn-sm", onclick: async (ev) => {
          ev.stopPropagation();
          const ok = await copyText(Store.exportJson());
          if (ok) Toast.success("Full log copied");
        } }, h("i", { class: "fa-solid fa-copy" }), " Copy log"),
        h("button", { class: "btn btn-ghost btn-sm", onclick: (ev) => {
          ev.stopPropagation();
          Store.update(e.id, { level: e.level === "warning" ? "error" : e.level === "error" ? "critical" : e.level });
          Toast.info("Severity escalated");
        } }, h("i", { class: "fa-solid fa-arrow-up" }), " Escalate"),
      ]),
    ]);

    const row = h("div", { class: "ec-row" }, [sev, body, actions]);
    row.addEventListener("click", () => {
      const open = detail.style.display !== "none";
      detail.style.display = open ? "none" : "block";
      row.classList.toggle("selected", !open);
    });
    return h("div", {}, [row, detail]);
  }

  function renderList(term = "", severity = "") {
    const items = Store.search(term, { severity });
    const counts = Store.counts();

    const list = h("div", { class: "ec-list" },
      items.length ? items.map(renderRow) : [h("div", { class: "error-boundary-fallback" }, h("mn-empty", { icon: "shield-check", title: "No errors recorded", sub: "All systems operational." }))]);
    return list;
  }

  const searchInput = h("input", { class: "input", placeholder: "Search by id, message, file, module…" });
  const filters = h("div", { class: "ec-filters" }, [
    h("div", { class: "ec-search" }, [
      h("i", { class: "fa-solid fa-magnifying-glass" }),
      searchInput,
    ]),
    h("div", { class: "ec-sev-tabs" }, [
      ...["", "critical", "error", "warning", "info"].map((lvl) =>
        h("button", { class: `ec-sev-tab ${lvl === "" ? "active" : ""} ${lvl || ""}`, onclick: (e) => {
          filters.querySelectorAll(".ec-sev-tab").forEach((b) => b.classList.remove("active"));
          e.currentTarget.classList.add("active");
          body.replaceChildren(renderList(searchInput.value, lvl));
        } }, lvl === "" ? "All" : lvl.charAt(0).toUpperCase() + lvl.slice(1))),
    ]),
  ]);

  const body = h("div", { style: { minHeight: "200px" } }, renderList());

  const refresh = () => body.replaceChildren(renderList(searchInput.value, ""));
  searchInput.addEventListener("input", refresh);
  Store.subscribe(() => refresh());

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
    h("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap" } }, [
      h("button", { class: "btn btn-outline btn-sm", onclick: () => { const blob = new Blob([Store.exportJson()], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "medinova-errors.json"; a.click(); } }, h("i", { class: "fa-solid fa-file-arrow-down" }), " Export JSON"),
      h("button", { class: "btn btn-outline btn-sm", onclick: () => { const blob = new Blob([Store.exportCsv()], { type: "text/csv" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "medinova-errors.csv"; a.click(); } }, h("i", { class: "fa-solid fa-table" }), " Export CSV"),
      h("button", { class: "btn btn-danger btn-sm", onclick: () => { Store.clear(); Toast.info("Console cleared"); } }, h("i", { class: "fa-solid fa-broom" }), " Clear"),
    ]),
  ]);

  const panel = h("div", { class: "mn-panel glass", style: { marginTop: "24px" } }, [
    filters,
    h("div", { class: "glass-body", style: { padding: 0 } }, body),
  ]);

  container.append(header, countsEl, panel);

  return container;
}

export const route = { path: "/admin/error-console", title: "Error Console", layout: "admin", auth: true, roles: ["admin", "super_admin"], view };

export default { view, route };
