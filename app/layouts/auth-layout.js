/**
 * MediNova — Auth layout.
 * Professional split-screen authentication shell:
 * brand panel (desktop) + centered form card.
 */

import { h } from "../utils/html.js";
import { APP_NAME, APP_TAGLINE } from "../config/app.config.js";
import { ThemeService } from "../services/ThemeService.js";
import { getBrand } from "../services/BrandService.js";

/** Render the auth shell. */
export async function authLayout() {
  const brand = getBrand().brand || {};

  const brandPanel = h("div", { class: "auth-brand-panel" }, [
    h("div", { class: "auth-brand-inner" }, [
      h("a", { class: "auth-brand-logo", href: "#/" }, [
        h("span", { class: "brand-logo" },
          h("img", { src: "assets/logo/logo-mark.svg", alt: brand.name || APP_NAME, width: 52, height: 52 })),
      ]),
      h("h1", { class: "auth-brand-name" }, brand.name || APP_NAME),
      h("p", { class: "auth-brand-tagline" }, brand.tagline || APP_TAGLINE),
      h("div", { class: "auth-brand-badges" }, [
        ["fa-shield-halved", "Secure & private"],
        ["fa-calendar-check", "Verified doctors"],
        ["fa-truck-medical", "Medicine delivery"],
      ].map(([icon, label]) =>
        h("span", { class: "auth-badge" }, h("i", { class: `fa-solid ${icon}` }), ` ${label}`))),
    ]),
  ]);

  const frame = h("div", { class: "auth-wrap" }, [
    h("button", {
      class: "header-btn theme-toggle",
      style: { position: "fixed", top: "20px", right: "20px", zIndex: 10 },
      "aria-label": "Toggle theme",
      onclick: () => ThemeService.toggle(),
    }, h("i", { class: "fa-solid fa-circle-half-stroke" })),

    h("div", { class: "auth-shell" }, [
      brandPanel,
      h("div", { class: "auth-form-panel" }, [
        h("div", { class: "auth-card anim-fade-up" }, [
          h("div", { class: "auth-mobile-brand" }, [
            h("img", { src: "assets/logo/logo-mark.svg", alt: brand.name || APP_NAME, width: 44, height: 44 }),
            h("div", {}, [
              h("div", { class: "auth-mobile-name" }, brand.name || APP_NAME),
              h("div", { class: "auth-mobile-tagline" }, brand.tagline || APP_TAGLINE),
            ]),
          ]),
          h("div", { id: "view-root" }),
        ]),
        h("p", { class: "auth-legal" }, `${brand.fullName || APP_NAME} · Secure · Private`),
      ]),
    ]),
  ]);
  return frame;
}

export default { authLayout };
