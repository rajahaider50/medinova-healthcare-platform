/**
 * MediNova — View: Reset password.
 */

import { h } from "../../utils/html.js";
import * as Router from "../../router/Router.js";
import * as Auth from "../../services/AuthService.js";
import * as Toast from "../../services/ToastService.js";
import { passwordField, formData, validate } from "./shared.js";

export async function view(ctx) {
  const token = ctx.params.token || "";
  const form = h("form", { class: "auth-form", novalidate: "" });
  const errorEl = h("div", { class: "alert alert-danger", id: "reset-error", style: { display: "none" } });
  const btn = h("button", { class: "btn btn-primary btn-lg btn-block", type: "submit", id: "reset-btn" }, [
    h("span", {}, "Reset Password"),
    h("i", { class: "fa-solid fa-key", style: { marginLeft: "8px" } }),
  ]);

  form.replaceChildren(
    h("div", { class: "auth-form-head" }, [
      h("h2", { class: "auth-heading" }, "Choose a new password"),
      h("p", { class: "auth-sub" }, "Enter a new password for your account."),
    ]),
    passwordField({ label: "New password", name: "password", id: "password", placeholder: "New password", autoComplete: "new-password" }),
    passwordField({ label: "Confirm password", name: "confirm", id: "confirm", placeholder: "Repeat new password", autoComplete: "new-password" }),
    errorEl,
    btn,
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = formData(form);

    const invalid = validate(data, { password: "password", confirm: "required" }, { password: "Password", confirm: "Confirm password" });
    if (invalid) {
      errorEl.textContent = invalid;
      errorEl.style.display = "flex";
      return;
    }
    if (data.password !== data.confirm) {
      errorEl.textContent = "Passwords do not match.";
      errorEl.style.display = "flex";
      return;
    }

    try {
      Auth.resetPassword(token, data.password);
      Toast.success("Password reset", "You can now sign in with your new password.");
      Router.navigate("/auth/login");
    } catch (err) {
      errorEl.textContent = err.message || "Reset failed. Please request a new link.";
      errorEl.style.display = "flex";
    }
  });

  return h("div", { class: "auth-view" }, form);
}

export const route = { path: "/auth/reset/:token", title: "Reset Password", layout: "auth", view };

export default { view, route };
