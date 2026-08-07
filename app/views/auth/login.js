/**
 * MediNova — View: Login.
 * Professional authentication screen. No demo shortcuts.
 */

import { h } from "../../utils/html.js";
import * as Router from "../../router/Router.js";
import * as Auth from "../../services/AuthService.js";
import { homeRoute } from "../../services/UiService.js";
import * as Toast from "../../services/ToastService.js";
import * as Store from "../../state/store.js";
import { field, passwordField, formData, validators, validate } from "./shared.js";

export async function view(ctx) {
  const redirect = ctx.query.redirect || "";

  const form = h("form", { class: "auth-form", novalidate: "" });
  const errorEl = h("div", { class: "alert alert-danger", id: "login-error", style: { display: "none" } });
  const btn = h("button", { class: "btn btn-primary btn-lg btn-block", type: "submit", id: "login-btn" }, [
    h("span", {}, "Sign In"),
    h("i", { class: "fa-solid fa-arrow-right", style: { marginLeft: "8px" } }),
  ]);

  const rememberWrap = h("label", { class: "check-line" }, [
    h("input", { type: "checkbox", name: "remember", checked: true }),
    h("span", {}, "Remember me"),
  ]);

  const emailInput = field({ label: "Email address", name: "email", type: "email", placeholder: "you@example.com", icon: "envelope", autoComplete: "email" });
  const pwInput = passwordField({ label: "Password", name: "password", placeholder: "Enter your password" });

  form.replaceChildren(
    h("div", { class: "auth-form-head" }, [
      h("h2", { class: "auth-heading" }, "Welcome back"),
      h("p", { class: "auth-sub" }, "Sign in to your MediNova account to continue."),
    ]),
    emailInput,
    pwInput,
    h("div", { class: "auth-options" }, [
      rememberWrap,
      h("a", { class: "auth-link", href: "#/auth/forgot" }, "Forgot password?"),
    ]),
    errorEl,
    btn,
    h("div", { class: "auth-divider" }, h("span", {}, "or")),
    h("p", { class: "auth-alt" }, [
      "New to MediNova? ",
      h("a", { class: "auth-link", href: "#/auth/register" }, "Create an account"),
    ]),
  );

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.style.display = "flex";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = formData(form);

    const invalid = validate(data, { email: "email", password: "required" }, { email: "Email address", password: "Password" });
    if (invalid) {
      showError(invalid);
      return;
    }

    errorEl.style.display = "none";
    btn.disabled = true;
    btn.querySelector("span").textContent = "Signing in…";

    try {
      const { user } = await Auth.login(data.email, data.password);
      Auth.createSession(user, !!data.remember);
      Store.setUser(user);
      Toast.success("Welcome back", `Signed in as ${user.name}`);
      Router.navigate(redirect || homeRoute());
    } catch (err) {
      showError(err.message || "Sign in failed. Please try again.");
      btn.disabled = false;
      btn.querySelector("span").textContent = "Sign In";
    }
  });

  return h("div", { class: "auth-view" }, form);
}

export const route = { path: "/auth/login", title: "Sign In", layout: "auth", view };

export default { view, route };
