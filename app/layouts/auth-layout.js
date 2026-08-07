/**
 * MediNova — Auth layout.
 * Centered card shell for login / register / forgot / reset.
 */

import { h } from "../utils/html.js";
import { APP_NAME, APP_TAGLINE } from "../config/app.config.js";
import { ThemeService } from "../services/ThemeService.js";

/** Render the auth shell. */
export async function authLayout() {
  const frame = h("div", { class: "auth-wrap" }, [
    h("button", {
      class: "header-btn theme-toggle",
      style: { position: "fixed", top: "20px", right: "20px", zIndex: 10 },
      "aria-label": "Toggle theme",
      onclick: () => ThemeService.toggle(),
    }, h("i", { class: "fa-solid fa-circle-half-stroke" })),

    h("div", { class: "auth-card glass anim-fade-up" }, [
      h("a", { class: "auth-logo", href: "#/", style: { display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "4px" } }, [
        h("span", { class: "brand-logo", style: { width: 44, height: 44, borderRadius: 12, overflow: "hidden", display: "inline-flex" } },
          h("img", { src: "assets/logo/logo-mark.svg", alt: APP_NAME, width: 44, height: 44 })),
      ]),
      h("h1", { style: { textAlign: "center", fontFamily: "var(--font-heading)", fontSize: "22px", margin: "10px 0 2px" } }, APP_NAME),
      h("p", { style: { textAlign: "center", color: "var(--text-muted)", fontSize: "13px", margin: "0 0 24px" } }, APP_TAGLINE),
      h("div", { id: "view-root" }),
    ]),
  ]);
  return frame;
}

export default { authLayout };
