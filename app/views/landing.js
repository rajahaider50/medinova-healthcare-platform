/**
 * MediNova — View: Landing (home).
 */

import { h } from "../utils/html.js";
import { cms, testimonials, banners } from "../data/mock/cms.js";
import { doctors } from "../data/mock/doctors.js";
import { specialties } from "../data/mock/doctors.js";
import { isAuthed } from "../services/AuthService.js";

function stripIcon(name) {
  return String(name || "").replace(/^fa-/, "");
}

export async function view() {
  const hero = cms.hero;
  const featuredDoctors = doctors.filter((d) => d.verified).slice(0, 6);

  const heroSection = h("section", { class: "hero-banner glass anim-fade-up", style: { borderRadius: "var(--radius-lg)", padding: "clamp(32px, 6vw, 64px)", margin: "24px 0" } }, [
    h("span", { class: "badge badge-purple" }, h("i", { class: "fa-solid fa-circle-check" }), ` ${hero.badge}`),
    h("h1", { style: { fontSize: "clamp(28px, 5vw, 44px)", lineHeight: 1.1, margin: "16px 0 12px", maxWidth: "640px" } }, hero.title),
    h("p", { style: { color: "var(--text-secondary)", maxWidth: "560px", fontSize: "16px" } }, hero.subtitle),
    h("div", { style: { display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" } }, [
      h("a", { class: "btn btn-primary btn-lg", href: "#/doctors" }, h("i", { class: "fa-solid fa-user-doctor" }), " Find a Doctor"),
      h("a", { class: "btn btn-outline btn-lg", href: "#/medicines" }, h("i", { class: "fa-solid fa-pills" }), " Order Medicines"),
    ]),
  ]);

  const stats = h("div", { class: "grid grid-4", style: { margin: "28px 0" } }, cms.stats.map((s) =>
    h("div", { class: "stat-card glass" }, [
      h("div", { class: "stat-icon icon-box icon-box-purple" }, h("i", { class: `fa-solid ${s.icon}` })),
      h("div", { class: "stat-value" }, s.value),
      h("div", { class: "stat-label" }, s.label),
    ])));

  const features = h("div", { class: "grid grid-auto", style: { margin: "28px 0" } }, cms.features.map((f) =>
    h("div", { class: "mn-panel glass" }, [
      h("div", { class: "icon-box icon-box-purple" }, h("i", { class: `fa-solid ${f.icon}` })),
      h("h3", { style: { margin: "12px 0 4px" } }, f.title),
      h("p", { style: { color: "var(--text-muted)", fontSize: "14px", margin: 0 } }, f.text),
    ])));

  const docGrid = h("div", { class: "grid grid-auto" }, featuredDoctors.map((d) =>
    h("a", { class: "mn-panel glass glass-hover", href: `#/doctors/${d.slug}`, style: { textDecoration: "none", color: "inherit", display: "block" } }, [
      h("div", { style: { display: "flex", alignItems: "center", gap: "12px" } }, [
        h("span", { class: "avatar avatar-lg" }, h("span", {}, d.name.replace("Dr. ", "").split(" ").map((p) => p[0]).slice(0, 2).join(""))),
        h("div", { style: { flex: 1 } }, [
          h("div", { style: { fontWeight: 600 } }, d.name),
          h("div", { style: { color: "var(--text-muted)", fontSize: "13px" } }, d.specialty),
        ]),
        h("span", { class: "rating" }, h("i", { class: "fa-solid fa-star" }), h("span", { class: "rating-value" }, d.rating)),
      ]),
      h("p", { style: { color: "var(--text-muted)", fontSize: "13px", margin: "12px 0 0" } }, h("i", { class: "fa-solid fa-location-dot" }), ` ${d.location}`),
    ])));

  const testimonialsSection = h("div", { class: "grid grid-3", style: { margin: "28px 0" } }, testimonials.map((t) =>
    h("div", { class: "mn-panel glass" }, [
      h("div", { class: "rating" }, [1, 2, 3, 4, 5].map(() => h("i", { class: "fa-solid fa-star" }))),
      h("p", { style: { color: "var(--text-secondary)", fontSize: "14px", margin: "12px 0" } }, `"${t.text}"`),
      h("div", { style: { display: "flex", alignItems: "center", gap: "10px" } }, [
        h("span", { class: "avatar avatar-sm" }, h("span", {}, t.name.split(" ").map((p) => p[0]).join(""))),
        h("div", {}, [
          h("div", { style: { fontWeight: 600, fontSize: "14px" } }, t.name),
          h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, t.role),
        ]),
      ]),
    ])));

  return h("div", {}, [
    heroSection,
    h("section", { style: { maxWidth: "1100px", margin: "0 auto" } }, [
      stats,
      h("h2", { class: "section-title", style: { marginTop: "36px" } }, "Why MediNova"),
      features,
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", margin: "36px 0 16px", flexWrap: "wrap", gap: "8px" } }, [
        h("h2", { class: "section-title", style: { margin: 0 } }, "Top Doctors"),
        h("a", { class: "btn btn-ghost", href: "#/doctors" }, "View all", h("i", { class: "fa-solid fa-arrow-right" })),
      ]),
      docGrid,
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", margin: "36px 0 16px", flexWrap: "wrap", gap: "8px" } }, [
        h("h2", { class: "section-title", style: { margin: 0 } }, "What our patients say"),
        h("span", { class: "badge badge-neutral" }, `${specialties.length} specialties`),
      ]),
      testimonialsSection,
    ]),
  ]);
}

export const route = { path: "/", title: "MediNova", layout: isAuthed() ? "user" : "public", view };

export default { view, route };
