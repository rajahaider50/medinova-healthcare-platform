/**
 * MediNova — View: Register.
 */

import { h } from "../../utils/html.js";
import * as Router from "../../router/Router.js";
import * as Auth from "../../services/AuthService.js";
import * as Toast from "../../services/ToastService.js";
import * as Store from "../../state/store.js";
import { field, passwordField, formData, validators, validate } from "./shared.js";

export async function view() {
  const form = h("form", { class: "auth-form", novalidate: "" });
  const errorEl = h("div", { class: "alert alert-danger", id: "register-error", style: { display: "none" } });
  const btn = h("button", { class: "btn btn-primary btn-lg btn-block", type: "submit", id: "register-btn" }, [
    h("span", {}, "Create Account"),
    h("i", { class: "fa-solid fa-arrow-right", style: { marginLeft: "8px" } }),
  ]);

  form.replaceChildren(
    h("div", { class: "auth-form-head" }, [
      h("h2", { class: "auth-heading" }, "Create your account"),
      h("p", { class: "auth-sub" }, "Join MediNova in under a minute."),
    ]),
    field({ label: "Full name", name: "name", placeholder: "e.g. Ayesha Khan", icon: "user", autoComplete: "name" }),
    field({ label: "Email", name: "email", type: "email", placeholder: "you@example.com", icon: "envelope", autoComplete: "email" }),
    field({ label: "Phone (optional)", name: "phone", type: "tel", placeholder: "+92 3xx xxxxxxx", icon: "phone", required: false, autoComplete: "tel" }),
    passwordField({ label: "Password", name: "password", id: "password", placeholder: "At least 8 characters", autoComplete: "new-password", help: "Minimum 8 characters." }),
    passwordField({ label: "Confirm password", name: "confirm", id: "confirm", placeholder: "Repeat your password", autoComplete: "new-password" }),
    errorEl,
    btn,
    h("div", { class: "auth-divider" }, h("span", {}, "or")),
    h("p", { class: "auth-alt" }, [
      "Already have an account? ",
      h("a", { class: "auth-link", href: "#/auth/login" }, "Sign in"),
    ]),
  );

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.style.display = "flex";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = formData(form);

    const invalid = validate(
      data,
      { name: "required", email: "email", password: "password", confirm: "required" },
      { name: "Full name", email: "Email", password: "Password", confirm: "Confirm password" },
    );
    if (invalid) return showError(invalid);
    if (data.password !== data.confirm) return showError("Passwords do not match.");

    btn.disabled = true;
    btn.querySelector("span").textContent = "Creating account…";

    try {
      const { user } = await Auth.register({ name: data.name, email: data.email, phone: data.phone || "", password: data.password });
      Store.setUser(user);
      Toast.success("Account created", `Welcome to MediNova, ${user.name}!`);
      Router.navigate("/dashboard");
    } catch (err) {
      showError(err.message || "Registration failed. Please try again.");
      btn.disabled = false;
      btn.querySelector("span").textContent = "Create Account";
    }
  });

  return h("div", { class: "auth-view" }, form);
}

export const route = { path: "/auth/register", title: "Create Account", layout: "auth", view };

export default { view, route };
