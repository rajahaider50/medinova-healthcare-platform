/**
 * MediNova — View: Forgot password.
 */

import { h } from "../../utils/html.js";
import * as Auth from "../../services/AuthService.js";
import * as Toast from "../../services/ToastService.js";
import { field, formData } from "./shared.js";

export async function view() {
  const form = h("form", { class: "auth-form", novalidate: "" });

  form.replaceChildren(
    h("h2", { style: { fontSize: "20px", margin: "0 0 4px" } }, "Reset your password"),
    h("p", { style: { color: "var(--text-muted)", fontSize: "13px", margin: "0 0 20px" } }, "Enter your email and we'll send you a reset link (demo flow)."),

    field({ label: "Email", name: "email", type: "email", placeholder: "you@example.com", icon: "envelope" }),

    h("div", { class: "field-error", id: "forgot-error", style: { display: "none" } }),

    h("button", { class: "btn btn-primary btn-lg btn-block", type: "submit", id: "forgot-btn" }, [
      h("i", { class: "fa-solid fa-paper-plane" }),
      h("span", {}, "Send Reset Link"),
    ]),

    h("p", { style: { textAlign: "center", fontSize: "13px", color: "var(--text-muted)", marginTop: "18px" } }, [
      h("a", { href: "#/auth/login", style: { color: "var(--color-primary)", fontWeight: 600 } }, "Back to sign in"),
    ]),
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const { email } = formData(form);
    const errorEl = form.querySelector("#forgot-error");
    const btn = form.querySelector("#forgot-btn");

    errorEl.style.display = "none";
    btn.disabled = true;

    const result = Auth.requestPasswordReset(email);
    if (result.ok) {
      Toast.info("Reset link sent", `Check ${result.email} (demo token: ${result.token})`);
      btn.disabled = false;
    } else {
      errorEl.textContent = result.message;
      errorEl.style.display = "block";
      btn.disabled = false;
    }
  });

  return h("div", {}, form);
}

export const route = { path: "/auth/forgot", title: "Forgot Password", layout: "auth", view };

export default { view, route };
