/**
 * MediNova — View: Reset password.
 */

import { h } from "../../utils/html.js";
import * as Router from "../../router/Router.js";
import * as Auth from "../../services/AuthService.js";
import * as Toast from "../../services/ToastService.js";
import { field, formData } from "./shared.js";

export async function view(ctx) {
  const token = ctx.params.token || "";
  const form = h("form", { class: "auth-form", novalidate: "" });

  form.replaceChildren(
    h("h2", { style: { fontSize: "20px", margin: "0 0 4px" } }, "Choose a new password"),
    h("p", { style: { color: "var(--text-muted)", fontSize: "13px", margin: "0 0 20px" } }, "Enter a new password for your account."),

    field({ label: "New password", name: "password", type: "password", placeholder: "New password", icon: "lock" }),
    field({ label: "Confirm password", name: "confirm", type: "password", placeholder: "Repeat new password", icon: "lock" }),

    h("div", { class: "field-error", id: "reset-error", style: { display: "none" } }),

    h("button", { class: "btn btn-primary btn-lg btn-block", type: "submit", id: "reset-btn" }, [
      h("i", { class: "fa-solid fa-key" }),
      h("span", {}, "Reset Password"),
    ]),
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = formData(form);
    const errorEl = form.querySelector("#reset-error");

    errorEl.style.display = "none";
    if (data.password !== data.confirm) {
      errorEl.textContent = "Passwords do not match.";
      errorEl.style.display = "block";
      return;
    }

    try {
      Auth.resetPassword(token, data.password);
      Toast.success("Password reset", "You can now sign in with your new password.");
      Router.navigate("/auth/login");
    } catch (err) {
      errorEl.textContent = err.message || "Reset failed. Please request a new link.";
      errorEl.style.display = "block";
    }
  });

  return h("div", {}, form);
}

export const route = { path: "/auth/reset/:token", title: "Reset Password", layout: "auth", view };

export default { view, route };
