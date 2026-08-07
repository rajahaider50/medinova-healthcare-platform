/**
 * MediNova — View: Login.
 */

import { h } from "../../utils/html.js";
import * as Router from "../../router/Router.js";
import * as Auth from "../../services/AuthService.js";
import * as Toast from "../../services/ToastService.js";
import * as Store from "../../state/store.js";
import { field, demoChips, formData } from "./shared.js";

export async function view(ctx) {
  const redirect = ctx.query.redirect || "/dashboard";

  const form = h("form", { class: "auth-form", novalidate: "" });

  const build = () => {
    form.replaceChildren(
      h("h2", { style: { fontSize: "20px", margin: "0 0 4px" } }, "Welcome back"),
      h("p", { style: { color: "var(--text-muted)", fontSize: "13px", margin: "0 0 20px" } }, "Sign in to your MediNova account"),

      field({ label: "Email", name: "email", type: "email", placeholder: "you@example.com", icon: "envelope" }),
      h("div", { class: "form-group" }, [
        h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, [
          h("label", { class: "form-label", for: "password" }, "Password"),
          h("a", { href: "#/auth/forgot", style: { fontSize: "12px", color: "var(--color-primary)" } }, "Forgot password?"),
        ]),
        h("div", { class: "field-wrap" }, [
          h("i", { class: "fa-solid fa-lock field-icon" }),
          h("input", { class: "input", type: "password", name: "password", id: "password", placeholder: "Enter password", required: true }),
        ]),
      ]),

      h("div", { class: "field-error", id: "login-error", style: { display: "none" } }),

      h("button", { class: "btn btn-primary btn-lg btn-block", type: "submit", id: "login-btn" }, [
        h("i", { class: "fa-solid fa-right-to-bracket" }),
        h("span", {}, "Sign In"),
      ]),

      demoChips((key, acc) => {
        form.email.value = acc.email;
        form.password.value = acc.password;
        form.querySelector("#login-error").style.display = "none";
      }),

      h("p", { style: { textAlign: "center", fontSize: "13px", color: "var(--text-muted)", marginTop: "18px" } }, [
        "New to MediNova? ",
        h("a", { href: "#/auth/register", style: { color: "var(--color-primary)", fontWeight: 600 } }, "Create an account"),
      ]),
    );
  };
  build();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = formData(form);
    const errorEl = form.querySelector("#login-error");
    const btn = form.querySelector("#login-btn");

    errorEl.style.display = "none";
    btn.disabled = true;
    btn.querySelector("span").textContent = "Signing in...";

    try {
      const { user } = await Auth.login(data.email, data.password);
      Store.setUser(user);
      Toast.success("Welcome back", `Signed in as ${user.name}`);
      Router.navigate(redirect);
    } catch (err) {
      errorEl.textContent = err.message || "Sign in failed. Please try again.";
      errorEl.style.display = "block";
      btn.disabled = false;
      btn.querySelector("span").textContent = "Sign In";
    }
  });

  return h("div", {}, form);
}

export const route = { path: "/auth/login", title: "Sign In", layout: "auth", view };

export default { view, route };
