/**
 * MediNova — View: Forgot password.
 */

import { h } from "../../utils/html.js";
import * as Auth from "../../services/AuthService.js";
import * as Toast from "../../services/ToastService.js";
import { field, formData, validate } from "./shared.js";

export async function view() {
  const form = h("form", { class: "auth-form", novalidate: "" });
  const errorEl = h("div", { class: "alert alert-danger", id: "forgot-error", style: { display: "none" } });
  const successEl = h("div", { class: "alert alert-success", id: "forgot-success", style: { display: "none" } });
  const btn = h("button", { class: "btn btn-primary btn-lg btn-block", type: "submit", id: "forgot-btn" }, [
    h("span", {}, "Send Reset Link"),
    h("i", { class: "fa-solid fa-paper-plane", style: { marginLeft: "8px" } }),
  ]);

  form.replaceChildren(
    h("div", { class: "auth-form-head" }, [
      h("h2", { class: "auth-heading" }, "Reset your password"),
      h("p", { class: "auth-sub" }, "Enter your email and we'll send you a secure reset link."),
    ]),
    field({ label: "Email address", name: "email", type: "email", placeholder: "you@example.com", icon: "envelope", autoComplete: "email" }),
    errorEl,
    successEl,
    btn,
    h("div", { class: "auth-divider" }, h("span", {}, "or")),
    h("p", { class: "auth-alt" }, [
      h("a", { class: "auth-link", href: "#/auth/login" }, h("i", { class: "fa-solid fa-arrow-left", style: { marginRight: "6px" } }), "Back to sign in"),
    ]),
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = formData(form);

    const invalid = validate(data, { email: "email" }, { email: "Email address" });
    if (invalid) {
      errorEl.textContent = invalid;
      errorEl.style.display = "flex";
      return;
    }

    errorEl.style.display = "none";
    successEl.style.display = "none";
    btn.disabled = true;
    btn.querySelector("span").textContent = "Sending…";

    const result = Auth.requestPasswordReset(data.email);
    setTimeout(() => {
      btn.disabled = false;
      btn.querySelector("span").textContent = "Send Reset Link";
      if (result.ok) {
        successEl.textContent = "If this email exists, a reset link has been sent. Check your inbox.";
        successEl.style.display = "flex";
      } else {
        errorEl.textContent = result.message || "Something went wrong. Please try again.";
        errorEl.style.display = "flex";
      }
    }, 400);
  });

  return h("div", { class: "auth-view" }, form);
}

export const route = { path: "/auth/forgot", title: "Forgot Password", layout: "auth", view };

export default { view, route };
