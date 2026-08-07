/**
 * MediNova — View: Admin CMS content management.
 */

import { h } from "../../utils/html.js";
import { banners, testimonials, cms, pages } from "../../data/mock/cms.js";
import * as Toast from "../../services/ToastService.js";

export async function view() {
  const bannerRows = banners.map((b) =>
    h("tr", {}, [
      h("td", {}, h("div", { style: { fontWeight: 600, fontSize: "14px" } }, b.title)),
      h("td", {}, h("div", { style: { color: "var(--text-muted)", fontSize: "13px" } }, b.subtitle)),
      h("td", {}, h("span", { class: `badge ${b.active ? "badge-success" : "badge-neutral"}` }, b.active ? "Live" : "Hidden")),
      h("td", {}, h("div", {}, `#${b.sort}`)),
      h("td", { style: { textAlign: "right" } }, h("button", { class: "btn btn-ghost btn-sm icon-btn", onclick: () => Toast.info(b.title, "Toggle the banner's live status in the full release.") }, h("i", { class: "fa-solid fa-pen" }))),
    ]));

  const testimonialRows = testimonials.map((t) =>
    h("tr", {}, [
      h("td", {}, h("div", { style: { display: "flex", alignItems: "center", gap: "10px" } }, [
        h("span", { class: "avatar avatar-sm" }, t.name.split(" ").map((w) => w[0]).slice(0, 2).join("")),
        h("div", {}, [h("div", { style: { fontWeight: 600, fontSize: "14px" } }, t.name), h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, t.role)]),
      ])),
      h("td", {}, h("div", { style: { color: "var(--text-muted)", fontSize: "13px", maxWidth: "360px" } }, t.text)),
      h("td", { style: { textAlign: "right" } }, h("button", { class: "btn btn-ghost btn-sm icon-btn", onclick: () => Toast.info(t.name, "Edit testimonial in the full release.") }, h("i", { class: "fa-solid fa-pen" }))),
    ]));

  const pageRows = pages.map((p) =>
    h("tr", {}, [
      h("td", {}, h("div", { style: { fontWeight: 600, fontSize: "14px" } }, p.title)),
      h("td", {}, h("code", { style: { color: "var(--purple)", fontSize: "12px" } }, `/${p.slug}`)),
      h("td", {}, h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, p.id)),
      h("td", { style: { textAlign: "right" } }, h("button", { class: "btn btn-ghost btn-sm icon-btn", onclick: () => Toast.info(p.title, "Open the content editor in the full release.") }, h("i", { class: "fa-solid fa-pen" }))),
    ]));

  function panel(title, subtitle, icon, rows) {
    return h("div", { class: "mn-panel glass", style: { marginTop: "24px" } }, [
      h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: `fa-solid ${icon}` })), h("div", {}, [h("div", { class: "panel-title" }, title), h("div", { class: "panel-subtitle" }, subtitle)])])]),
      h("div", { class: "glass-body", style: { padding: 0 } },
        rows.length ? h("table", { class: "table" }, [h("thead", {}, h("tr", {}, [h("th", {}, "Item"), h("th", {}, "Details"), h("th", {}, "Status"), h("th", {}, "Order"), h("th", { style: { width: "48px" } }, "")])), h("tbody", {}, rows)])
          : h("div", { style: { padding: "32px" } }, h("mn-empty", { icon: "file-lines", title: "Nothing here" }))),
    ]);
  }

  const hero = h("div", { class: "mn-panel glass", style: { marginTop: "24px" } }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-house-signal" })), h("div", {}, [h("div", { class: "panel-title" }, "Homepage Hero"), h("div", { class: "panel-subtitle" }, "Landing page headline content")])])]),
    h("div", { class: "glass-body" }, [
      h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Badge"), h("input", { class: "input", value: cms.hero.badge, readonly: "" })]),
      h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Title"), h("input", { class: "input", value: cms.hero.title, readonly: "" })]),
      h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Subtitle"), h("textarea", { class: "input", rows: "2", readonly: "" }, cms.hero.subtitle)]),
      h("p", { style: { color: "var(--text-muted)", fontSize: "12px" } }, h("i", { class: "fa-solid fa-lock" }), " Content editing is available in the full CMS release."),
    ]),
  ]);

  return h("div", { class: "anim-fade-up" }, [
    h("div", { style: { marginBottom: "8px" } }, [h("h1", { style: { margin: 0, fontSize: "26px" } }, "Content Management"), h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, "Homepage banners, testimonials and static pages")]),
    hero,
    h("div", { class: "mn-panel glass", style: { marginTop: "24px" } }, [
      h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-image" })), h("div", {}, [h("div", { class: "panel-title" }, "Banners"), h("div", { class: "panel-subtitle" }, "Homepage promotional banners")])])]),
      h("div", { class: "glass-body", style: { padding: 0 } },
        bannerRows.length ? h("table", { class: "table" }, [h("thead", {}, h("tr", {}, [h("th", {}, "Title"), h("th", {}, "Subtitle"), h("th", {}, "Status"), h("th", {}, "Sort"), h("th", { style: { width: "48px" } }, "")])), h("tbody", {}, bannerRows)])
          : h("div", { style: { padding: "32px" } }, h("mn-empty", { icon: "image", title: "No banners" }))),
    ]),
    panel("Testimonials", "Patient testimonials on the landing page", "fa-quote-left", testimonialRows),
    panel("Pages", "Static pages rendered via the CMS", "fa-files", pageRows),
  ]);
}

export const route = { path: "/admin/cms", title: "CMS", layout: "admin", auth: true, roles: ["admin", "super_admin"], view };

export default { view, route };
