/**
 * MediNova — View: Landing (home).
 * Renders editable CMS content + live (empty-by-default) data.
 */

import { h } from "../utils/html.js";
import * as Db from "../data/db.js";
import * as Content from "../services/ContentService.js";
import { compactNumber } from "../utils/format.js";
import { isAuthed } from "../services/AuthService.js";

export async function view() {
  const page = Content.getPage("home");
  const features = Content.getFeatures();
  const doctors = Db.collection("doctors").all().filter((d) => d.verified).slice(0, 6);
  const testimonials = Db.collection("reviews").all().slice(0, 3);

  const heroSection = h("section", { class: "hero-banner glass anim-fade-up", style: { borderRadius: "var(--radius-lg)", padding: "clamp(32px, 6vw, 64px)", margin: "24px 0" } }, [
    h("span", { class: "badge badge-purple" }, h("i", { class: "fa-solid fa-circle-check" }), ` ${page.badge || "Trusted healthcare platform"}`),
    h("h1", { style: { fontSize: "clamp(28px, 5vw, 44px)", lineHeight: 1.1, margin: "16px 0 12px", maxWidth: "640px" } }, page.heading || "Your health, our priority"),
    h("p", { style: { color: "var(--text-secondary)", maxWidth: "560px", fontSize: "16px" } }, page.subtitle || ""),
    h("div", { style: { display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" } }, [
      h("a", { class: "btn btn-primary btn-lg", href: page.primaryCtaLink || "#/doctors" }, h("i", { class: "fa-solid fa-user-doctor" }), ` ${page.primaryCta || "Find a Doctor"}`),
      h("a", { class: "btn btn-outline btn-lg", href: page.secondaryCtaLink || "#/medicines" }, h("i", { class: "fa-solid fa-pills" }), ` ${page.secondaryCta || "Order Medicines"}`),
    ]),
  ]);

  const stats = [
    { label: "Registered Users", value: compactNumber(Db.collection("users").count()), icon: "fa-user-group" },
    { label: "Verified Doctors", value: compactNumber(Db.collection("doctors").count()), icon: "fa-user-doctor" },
    { label: "Medicines", value: compactNumber(Db.collection("medicines").count()), icon: "fa-pills" },
    { label: "Orders Delivered", value: compactNumber(Db.collection("orders").count()), icon: "fa-truck-fast" },
  ];

  const statsRow = h("div", { class: "grid grid-4", style: { margin: "28px 0" } }, stats.map((s) =>
    h("div", { class: "stat-card glass" }, [
      h("div", { class: "stat-icon icon-box icon-box-purple" }, h("i", { class: `fa-solid ${s.icon}` })),
      h("div", { class: "stat-value" }, s.value),
      h("div", { class: "stat-label" }, s.label),
    ])));

  const featuresRow = h("div", { class: "grid grid-auto", style: { margin: "28px 0" } }, features.map((f) =>
    h("div", { class: "mn-panel glass" }, [
      h("div", { class: "icon-box icon-box-purple" }, h("i", { class: `fa-solid ${f.icon}` })),
      h("h3", { style: { margin: "12px 0 4px" } }, f.title),
      h("p", { style: { color: "var(--text-muted)", fontSize: "14px", margin: 0 } }, f.text),
    ])));

  const docGrid = doctors.length
    ? h("div", { class: "grid grid-auto" }, doctors.map((d) =>
        h("a", { class: "mn-panel glass glass-hover", href: `#/doctors/${d.slug}`, style: { textDecoration: "none", color: "inherit", display: "block" } }, [
          h("div", { style: { display: "flex", alignItems: "center", gap: "12px" } }, [
            h("span", { class: "avatar avatar-lg" }, h("span", {}, d.name.replace("Dr. ", "").split(" ").map((p) => p[0]).slice(0, 2).join(""))),
            h("div", { style: { flex: 1 } }, [
              h("div", { style: { fontWeight: 600 } }, d.name),
              h("div", { style: { color: "var(--text-muted)", fontSize: "13px" } }, d.specialty),
            ]),
            h("span", { class: "rating" }, h("i", { class: "fa-solid fa-star" }), h("span", { class: "rating-value" }, d.rating || 0)),
          ]),
          h("p", { style: { color: "var(--text-muted)", fontSize: "13px", margin: "12px 0 0" } }, h("i", { class: "fa-solid fa-location-dot" }), ` ${d.location || ""}`),
        ])))
    : h("div", { class: "mn-panel glass" }, h("mn-empty", { icon: "user-doctor", title: "Doctors will appear here soon", text: "Verified specialists show up on the landing page once added by the admin." }, h("a", { class: "btn btn-primary btn-sm", href: "#/doctors" }, "Browse doctors")));

  const testimonialsSection = testimonials.length
    ? h("div", { class: "grid grid-3", style: { margin: "28px 0" } }, testimonials.map((t) =>
        h("div", { class: "mn-panel glass" }, [
          h("div", { class: "rating" }, [1, 2, 3, 4, 5].map(() => h("i", { class: "fa-solid fa-star" }))),
          h("p", { style: { color: "var(--text-secondary)", fontSize: "14px", margin: "12px 0" } }, `"${t.comment}"`),
          h("div", { style: { display: "flex", alignItems: "center", gap: "10px" } }, [
            h("span", { class: "avatar avatar-sm" }, h("span", {}, (t.userName || "U").split(" ").map((p) => p[0]).join(""))),
            h("div", {}, [
              h("div", { style: { fontWeight: 600, fontSize: "14px" } }, t.userName),
              h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, t.doctorName || "Verified patient"),
            ]),
          ]),
        ])))
    : h("div", { class: "mn-panel glass", style: { margin: "28px 0" } }, h("mn-empty", { icon: "star", title: "No patient reviews yet", text: "Reviews left by patients will appear here." }));

  return h("div", {}, [
    heroSection,
    h("section", { style: { maxWidth: "1100px", margin: "0 auto" } }, [
      statsRow,
      h("h2", { class: "section-title", style: { marginTop: "36px" } }, page.featuresTitle || "Why MediNova"),
      featuresRow,
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", margin: "36px 0 16px", flexWrap: "wrap", gap: "8px" } }, [
        h("h2", { class: "section-title", style: { margin: 0 } }, page.doctorsTitle || "Top Doctors"),
        h("a", { class: "btn btn-ghost", href: "#/doctors" }, "View all", h("i", { class: "fa-solid fa-arrow-right" })),
      ]),
      docGrid,
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", margin: "36px 0 16px", flexWrap: "wrap", gap: "8px" } }, [
        h("h2", { class: "section-title", style: { margin: 0 } }, page.testimonialsTitle || "What our patients say"),
        h("span", { class: "badge badge-neutral" }, `${Db.collection("reviews").count()} reviews`),
      ]),
      testimonialsSection,
    ]),
  ]);
}

export const route = { path: "/", title: "MediNova", layout: isAuthed() ? "user" : "public", view };

export default { view, route };
