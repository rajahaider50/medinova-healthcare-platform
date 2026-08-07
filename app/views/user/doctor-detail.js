/**
 * MediNova — View: Doctor detail.
 */

import { h } from "../../utils/html.js";
import * as Router from "../../router/Router.js";
import { doctors } from "../../data/mock/doctors.js";
import { reviews } from "../../data/mock/reviews.js";
import { money } from "../../utils/format.js";
import { timeAgo } from "../../utils/date.js";
import * as Toast from "../../services/ToastService.js";

export async function view(ctx) {
  const slug = ctx.params.slug;
  const doc = doctors.find((d) => d.slug === slug);

  if (!doc) {
    return h("div", { class: "error-state" }, [
      h("div", { class: "error-icon" }, h("i", { class: "fa-solid fa-user-doctor" })),
      h("h3", {}, "Doctor not found"),
      h("p", { class: "text-secondary" }, "This doctor may have been removed."),
      h("a", { class: "btn btn-primary mt-3", href: "#/doctors" }, "Browse doctors"),
    ]);
  }

  const docReviews = reviews.filter((r) => r.doctorId === doc.id);

  const infoRow = (icon, text) =>
    h("div", { style: { display: "flex", gap: "10px", alignItems: "flex-start", padding: "8px 0" } }, [
      h("div", { class: "icon-box icon-box-sm" }, h("i", { class: `fa-solid ${icon}` })),
      h("span", { style: { fontSize: "14px", color: "var(--text-secondary)" } }, text),
    ]);

  const bookCta = h("div", { class: "mn-panel glass", style: { position: "sticky", top: "88px" } }, [
    h("div", { class: "flex items-center justify-between" }, [
      h("div", {}, [
        h("div", { style: { fontWeight: 700, fontSize: "22px", color: "var(--color-primary)" } },
          doc.discount ? [h("s", { style: { color: "var(--text-muted)", fontSize: "15px", marginRight: "8px" } }, money(doc.fee)), money(doc.fee - doc.discount)] : money(doc.fee)),
        h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, "per consultation"),
      ]),
      h("span", { class: "badge badge-neutral" }, `${doc.experience}+ years exp.`),
    ]),
    h("a", { class: "btn btn-primary btn-lg btn-block", style: { marginTop: "16px" }, href: `#/appointments/book?doctor=${doc.id}` }, h("i", { class: "fa-solid fa-calendar-plus" }), " Book Appointment"),
    h("a", { class: "btn btn-outline btn-block", style: { marginTop: "10px" }, href: `#/messages?doctor=${doc.id}` }, h("i", { class: "fa-solid fa-comment-medical" }), " Send Message"),
    h("button", {
      class: "btn btn-ghost btn-block",
      style: { marginTop: "10px" },
      onclick: () => Toast.success("Added to favorites", `${doc.name} is now in your favorites.`),
    }, h("i", { class: "fa-solid fa-heart" }), " Save Doctor"),
    h("div", { class: "divider", style: { margin: "16px 0" } }),
    infoRow("fa-certificate", doc.qualification),
    infoRow("fa-registered", `PMC Reg: ${doc.registrationNo}`),
    infoRow("fa-language", doc.languages.join(", ")),
    infoRow("fa-location-dot", `${doc.location}`),
    infoRow("fa-hospital", doc.hospital),
  ]);

  const availability = h("div", { class: "mn-panel glass" }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-clock" })), h("div", {}, [h("div", { class: "panel-title" }, "Available Slots"), h("div", { class: "panel-subtitle" }, "Next available times")])])]),
    h("div", { class: "glass-body" }, doc.timings.slice(0, 3).map((t) =>
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--glass-border)" } }, [
        h("span", { style: { fontWeight: 600, fontSize: "14px" } }, t.day),
        h("div", { style: { display: "flex", gap: "6px", flexWrap: "wrap" } },
          t.slots.slice(0, 4).map((s) => h("span", { class: "chip chip-filter" }, s))),
      ]))),
  ]);

  const services = h("div", { class: "mn-panel glass" }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-list-check" })), h("div", {}, [h("div", { class: "panel-title" }, "Services & Procedures")])])]),
    h("div", { class: "glass-body" }, h("div", { style: { display: "flex", flexWrap: "wrap", gap: "8px" } },
      doc.services.map((s) => h("span", { class: "badge badge-purple" }, h("i", { class: "fa-solid fa-check" }), ` ${s}`)))),
  ]);

  const reviewsSection = h("div", { class: "mn-panel glass" }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-star" })), h("div", {}, [h("div", { class: "panel-title" }, `Patient Reviews (${docReviews.length})`), h("div", { class: "panel-subtitle" }, `${doc.rating} average rating`)])])]),
    h("div", { class: "glass-body", style: { padding: 0 } },
      docReviews.length ? docReviews.map((r) =>
        h("div", { style: { padding: "16px 20px", borderBottom: "1px solid var(--glass-border)" } }, [
          h("div", { style: { display: "flex", gap: "10px", alignItems: "center" } }, [
            h("span", { class: "avatar avatar-sm" }, h("span", {}, r.userName.split(" ").map((p) => p[0]).slice(0, 2).join(""))),
            h("div", { style: { flex: 1 } }, [
              h("div", { style: { fontWeight: 600, fontSize: "14px" } }, r.userName),
              h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, timeAgo(r.date)),
            ]),
            h("span", { class: "rating" }, h("i", { class: "fa-solid fa-star" }), h("span", { class: "rating-value" }, r.rating)),
          ]),
          h("p", { style: { color: "var(--text-secondary)", fontSize: "14px", margin: "10px 0 0" } }, r.comment),
        ])) :
      h("div", { style: { padding: "24px" } }, h("mn-empty", { icon: "star", title: "No reviews yet", text: "Be the first to review this doctor." })),
    ),
  ]);

  return h("div", { class: "anim-fade-up" }, [
    h("nav", { class: "breadcrumb" }, [h("a", { href: "#/doctors" }, "Doctors"), h("span", {}, " / "), h("span", {}, doc.name)]),
    h("div", { class: "grid", style: { gridTemplateColumns: "1.5fr 1fr", gap: "24px" } }, [
      h("div", { class: "mn-panel glass" }, [
        h("div", { style: { display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" } }, [
          h("span", { class: "avatar avatar-2xl" }, h("span", {}, doc.name.replace("Dr. ", "").split(" ").map((p) => p[0]).slice(0, 2).join(""))),
          h("div", { style: { flex: 1, minWidth: 220 } }, [
            h("h1", { style: { margin: 0, fontSize: "24px" } }, doc.name),
            h("p", { style: { color: "var(--color-primary)", fontWeight: 600, margin: "4px 0" } }, doc.specialty),
            h("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap" } }, [
              h("span", { class: "badge badge-success" }, h("i", { class: "fa-solid fa-circle-check" }), " Verified"),
              doc.onlineConsultation ? h("span", { class: "badge badge-info" }, h("i", { class: "fa-solid fa-video" }), " Online Consultation") : null,
            ]),
          ]),
          h("div", { style: { textAlign: "right" } }, [
            h("div", { class: "rating", style: { justifyContent: "flex-end" } }, h("i", { class: "fa-solid fa-star" }), h("span", { class: "rating-value" }, doc.rating)),
            h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, `${doc.reviews} reviews`),
          ]),
        ]),
        h("p", { style: { color: "var(--text-secondary)", lineHeight: 1.7, marginTop: "16px" } }, doc.about),
      ]),
      bookCta,
      h("div", { class: "span-full", style: { display: "grid", gap: "24px" } }, [availability, services, reviewsSection]),
    ]),
  ]);
}

export const route = { path: "/doctors/:slug", title: "Doctor", layout: "user", auth: true, view };

export default { view, route };
