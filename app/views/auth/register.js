/**
 * MediNova — View: Register.
 */

import { h } from "../../utils/html.js";
import * as Router from "../../router/Router.js";
import * as Auth from "../../services/AuthService.js";
import * as Toast from "../../services/ToastService.js";
import * as Store from "../../state/store.js";
import { field, formData } from "./shared.js";

export async function view(ctx) {
  const form = h("form", { class: "auth-form", novalidate: "" });

  const build = () => {
    form.replaceChildren(
      h("h2", { style: { fontSize: "20px", margin: "0 0 4px" } }, "Create your account"),
      h("p", { style: { color: "var(--text-muted)", fontSize: "13px", margin: "0 0 20px" } }, "Join MediNova in under a minute"),

      field({ label: "Full name", name: "name", placeholder: "e.g. Ayesha Khan", icon: "user" }),
      field({ label: "Email", name: "email", type: "email", placeholder: "you@example.com", icon: "envelope" }),
      field({ label: "Phone", name: "phone", type: "tel", placeholder: "+92 3xx xxxxxxx", icon: "phone", required: false }),
      field({ label: "Password", name: "password", type: "password", placeholder: "At least 6 characters", icon: "lock" }),
      field({ label: "Confirm password", name: "confirm", type: "password", placeholder: "Repeat your password", icon: "lock" }),

      h("div", { class: "field-error", id: "register-error", style: { display: "none" } }),

      h("button", { class: "btn btn-primary btn-lg btn-block", type: "submit", id: "register-btn" }, [
        h("i", { class: "fa-solid fa-user-plus" }),
        h("span", {}, "Create Account"),
      ]),

      h("p", { style: { textAlign: "center", fontSize: "13px", color: "var(--text-muted)", marginTop: "18px" } }, [
        "Already have an account? ",
        h("a", { href: "#/auth/login", style: { color: "var(--color-primary)", fontWeight: 600 } }, "Sign in"),
      ]),
    );
  };
  build();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = formData(form);
    const errorEl = form.querySelector("#register-error");
    const btn = form.querySelector("#register-btn");

    errorEl.style.display = "none";
    if (data.password !== data.confirm) {
      errorEl.textContent = "Passwords do not match.";
      errorEl.style.display = "block";
      return;
    }

    btn.disabled = true;
    btn.querySelector("span").textContent = "Creating account...";

    try {
      const { user } = await Auth.register(data);
      Store.setUser(user);
      Toast.success("Account created", `Welcome to MediNova, ${user.name}!`);
      Router.navigate("/dashboard");
    } catch (err) {
      errorEl.textContent = err.message || "Registration failed. Please try again.";
      errorEl.style.display = "block";
      btn.disabled = false;
      btn.querySelector("span").textContent = "Create Account";
    }
  });

  return h("div", {}, form);
}

export const route = { path: "/auth/register", title: "Create Account", layout: "auth", view };

export default { view, route };
