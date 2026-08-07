/**
 * MediNova — Public layout.
 * Marketing shell for landing / about / contact / legal pages.
 */

import { h } from "../utils/html.js";
import { navigate } from "../router/Router.js";
import { APP_NAME, APP_TAGLINE } from "../config/app.config.js";
import { isAuthed } from "../services/AuthService.js";

function publicHeader() {
  return h("header", { class: "top-header" }, [
    h("div", { class: "header-left" }, [
      h("a", { class: "sidebar-brand", href: "#/", style: { padding: 0, border: 0, minHeight: "auto" } }, [
        h("span", { class: "brand-logo", style: { width: 34, height: 34, borderRadius: 10, overflow: "hidden", display: "inline-flex" } },
          h("img", { src: "assets/logo/logo-mark.svg", alt: APP_NAME, width: 34, height: 34 })),
        h("span", { class: "brand-text", style: { fontSize: "17px" } }, APP_NAME),
      ]),
    ]),
    h("div", { class: "header-right" }, [
      h("a", { class: "btn btn-ghost", href: "#/auth/login" }, "Log in"),
      h("a", { class: "btn btn-primary", href: "#/auth/register" }, "Get Started"),
    ]),
  ]);
}

function publicFooter() {
  return h("footer", { class: "app-footer" }, [
    h("div", { style: { display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between" } }, [
      h("div", {}, [
        h("div", { class: "footer-brand" }, [
          h("span", { class: "brand-logo", style: { width: 28, height: 28, borderRadius: 8, overflow: "hidden", display: "inline-flex" } },
            h("img", { src: "assets/logo/logo-mark.svg", alt: APP_NAME, width: 28, height: 28 })),
          h("span", { style: { fontWeight: 700 } }, APP_NAME),
        ]),
        h("p", { style: { color: "var(--text-muted)", fontSize: "12px", margin: "6px 0 0" } }, APP_TAGLINE),
      ]),
      h("nav", { style: { display: "flex", gap: "16px", flexWrap: "wrap" } }, [
        h("a", { href: "#/about", style: { color: "var(--text-muted)", fontSize: "13px" } }, "About"),
        h("a", { href: "#/contact", style: { color: "var(--text-muted)", fontSize: "13px" } }, "Contact"),
        h("a", { href: "#/privacy", style: { color: "var(--text-muted)", fontSize: "13px" } }, "Privacy"),
        h("a", { href: "#/terms", style: { color: "var(--text-muted)", fontSize: "13px" } }, "Terms"),
      ]),
    ]),
    h("p", { style: { color: "var(--text-muted)", fontSize: "12px", marginTop: "16px", textAlign: "center" } }, `© ${new Date().getFullYear()} ${APP_NAME} Healthcare. All rights reserved.`),
  ]);
}

/** Render the public shell. */
export async function publicLayout() {
  const frame = h("div", { class: "app-root" }, [
    publicHeader(),
    h("main", { class: "app-content wide", style: { maxWidth: "1100px" } }, h("div", { id: "view-root" })),
    publicFooter(),
  ]);
  return frame;
}

export default { publicLayout };
