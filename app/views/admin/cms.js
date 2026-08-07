/**
 * MediNova — View: Admin CMS (Page Content Manager).
 * Edits editable page content + landing features via ContentService.
 */

import { h } from "../../utils/html.js";
import * as Content from "../../services/ContentService.js";
import * as Toast from "../../services/ToastService.js";
import { currentUser } from "../../services/AuthService.js";

function makeField(schema, value) {
  const attrs = { class: "input", id: `cms-field-${schema.key}`, value: value ?? "" };
  if (schema.type === "textarea") {
    const ta = h("textarea", { class: "textarea", id: `cms-field-${schema.key}`, rows: 3 });
    ta.value = value ?? "";
    return ta;
  }
  return h("input", attrs);
}

export async function view() {
  const pages = Content.listPages();
  const editor = h("div", { class: "mn-panel glass" });
  const titleEl = h("h2", { style: { margin: 0, fontSize: "18px" } }, "");
  const subtitleEl = h("p", { style: { color: "var(--text-muted)", fontSize: "13px", margin: "4px 0 0" } }, "");
  const pageList = h("div", { class: "cms-page-list", style: { display: "flex", flexDirection: "column", gap: "4px" } });

  function renderEditor(key) {
    const schema = Content.pageFields(key);
    const current = Content.getPage(key);
    const fields = schema.map((s) => h("div", { class: "form-group" }, [
      h("label", { class: "form-label", for: `cms-field-${s.key}` }, s.label),
      makeField(s, current[s.key]),
    ]));

    const saveBtn = h("button", {
      class: "btn btn-primary",
      onclick: () => {
        try {
          const values = {};
          for (const s of schema) {
            const el = editor.querySelector(`#cms-field-${s.key}`);
            if (el) values[s.key] = el.value;
          }
          Content.savePage(key, values, currentUser()?.id);
          Toast.success("Page saved", `${Content.getPage(key).title || key} updated.`);
        } catch (err) {
          Toast.error("Save failed", err.message || "Please try again.");
        }
      },
    }, h("i", { class: "fa-solid fa-check" }), " Save Page");

    titleEl.textContent = current.title || key;
    subtitleEl.textContent = `Editing /${current.slug || key} · ${schema.length} editable field(s)`;
    editor.replaceChildren(
      h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [
        h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-file-lines" })),
        h("div", {}, [titleEl, subtitleEl]),
      ])]),
      h("div", { class: "glass-body" }, fields.length
        ? [h("div", { class: "form-grid" }, fields), h("div", { style: { marginTop: "16px" } }, saveBtn)]
        : h("p", { style: { color: "var(--text-muted)" } }, "This page has no editable fields.")),
    );
    pageList.querySelectorAll(".cms-page-btn").forEach((b) => b.classList.toggle("active", b.dataset.key === key));
  }

  function renderFeatures() {
    const features = Content.getFeatures();
    const items = h("div", { class: "form-grid" });

    function addRow(f) {
      const row = h("div", { class: "form-group", style: { position: "relative", border: "1px solid var(--glass-border)", borderRadius: "var(--radius-md)", padding: "12px", display: "grid", gap: "8px" } }, [
        h("input", { class: "input", value: f?.icon || "fa-stethoscope", placeholder: "Icon (fa-*)", "data-f": "icon" }),
        h("input", { class: "input", value: f?.title || "", placeholder: "Title", "data-f": "title" }),
        h("textarea", { class: "textarea", rows: 2, placeholder: "Text", "data-f": "text" }, f?.text || ""),
        h("button", { class: "btn btn-ghost-danger btn-sm", type: "button", style: { position: "absolute", top: "6px", right: "6px" }, onclick: () => { row.remove(); } }, h("i", { class: "fa-solid fa-trash" })),
      ]);
      row.querySelector("textarea").value = f?.text || "";
      items.appendChild(row);
    }

    features.forEach(addRow);

    const addBtn = h("button", { class: "btn btn-outline btn-sm", type: "button", onclick: () => addRow({}) }, h("i", { class: "fa-solid fa-plus" }), " Add feature");

    const saveBtn = h("button", {
      class: "btn btn-primary",
      onclick: () => {
        try {
          const groups = [];
          let current = null;
          for (const el of items.querySelectorAll("input[data-f], textarea[data-f]")) {
            if (el.dataset.f === "icon") { current = {}; groups.push(current); }
            current[el.dataset.f] = el.value.trim();
          }
          Content.saveFeatures(groups.filter((g) => g.title || g.text), currentUser()?.id);
          Toast.success("Features saved", "Landing page feature cards updated.");
          renderFeatures();
        } catch (err) {
          Toast.error("Save failed", err.message || "Please try again.");
        }
      },
    }, h("i", { class: "fa-solid fa-check" }), " Save Features");

    featurePanel.replaceChildren(
      h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [
        h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-wand-magic-sparkles" })),
        h("div", {}, [h("div", { class: "panel-title" }, "Landing Features"), h("div", { class: "panel-subtitle" }, "Feature cards on the home page")]),
      ])]),
      h("div", { class: "glass-body" }, [items, h("div", { style: { display: "flex", gap: "8px", marginTop: "16px" } }, [addBtn, saveBtn])]),
    );
  }

  const featurePanel = h("div", { class: "mn-panel glass", style: { marginTop: "24px" } });
  renderFeatures();

  for (const p of pages) {
    const btn = h("button", {
      class: "cms-page-btn btn btn-ghost",
      "data-key": p.key,
      type: "button",
      style: { justifyContent: "flex-start", textAlign: "left" },
      onclick: () => renderEditor(p.key),
    }, [h("span", { style: { fontWeight: 600 } }, p.title), h("span", { style: { color: "var(--text-muted)", fontSize: "12px", marginLeft: "auto" } }, `/${p.slug}`)]);
    pageList.appendChild(btn);
  }

  renderEditor("home");

  return h("div", { class: "anim-fade-up" }, [
    h("div", { style: { marginBottom: "8px" } }, [h("h1", { style: { margin: 0, fontSize: "26px" } }, "Content Management"), h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, "Edit homepage copy, landing features and static page content")]),
    h("div", { class: "grid", style: { gridTemplateColumns: "280px 1fr", gap: "24px", marginTop: "24px", alignItems: "start" } }, [
      h("div", { class: "mn-panel glass" }, [
        h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-files" })), h("div", {}, [h("div", { class: "panel-title" }, "Pages"), h("div", { class: "panel-subtitle" }, `${pages.length} editable pages`)])])]),
        h("div", { class: "glass-body", style: { padding: "8px" } }, pageList),
      ]),
      h("div", {}, [editor, featurePanel]),
    ]),
  ]);
}

export const route = { path: "/admin/cms", title: "CMS", layout: "admin", auth: true, roles: ["admin", "super_admin"], view };

export default { view, route };
