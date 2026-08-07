/**
 * MediNova — View: Settings.
 */

import { h } from "../../utils/html.js";
import * as Db from "../../data/db.js";
import * as Toast from "../../services/ToastService.js";
import * as Store from "../../state/store.js";
import { currentUser, changePassword, logout } from "../../services/AuthService.js";
import * as Router from "../../router/Router.js";
import { ThemeService } from "../../services/ThemeService.js";
import { seedDatabase } from "../../data/seed.js";

export async function view() {
  const user = currentUser();

  function settingRow(label, sub, control) {
    return h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", padding: "14px 0", borderBottom: "1px solid var(--glass-border)" } }, [
      h("div", {}, [h("div", { style: { fontWeight: 600, fontSize: "14px" } }, label), sub ? h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, sub) : null]),
      control,
    ]);
  }

  const themeSwitch = h("mn-switch", { label: "Dark mode", checked: ThemeService.isDark() ? "checked" : null });
  themeSwitch.addEventListener("change", (e) => ThemeService.set(e.detail ? "dark" : "light"));

  const emailNotif = h("mn-switch", { label: "Email notifications", checked: "checked" });
  const pushNotif = h("mn-switch", { label: "Push notifications", checked: "checked" });
  const smsNotif = h("mn-switch", { label: "SMS notifications" });

  const preferences = h("div", { class: "mn-panel glass" }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-sliders" })), h("div", {}, [h("div", { class: "panel-title" }, "Preferences")])])]),
    h("div", { class: "glass-body" }, [settingRow("Theme", "Switch between light and dark mode", themeSwitch)]),
  ]);

  const notifications = h("div", { class: "mn-panel glass", style: { marginTop: "24px" } }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-bell" })), h("div", {}, [h("div", { class: "panel-title" }, "Notifications")])])]),
    h("div", { class: "glass-body" }, [settingRow("Email", "Appointment & order updates", emailNotif), settingRow("Push", "Real-time alerts on this device", pushNotif), settingRow("SMS", "Text message reminders", smsNotif)]),
  ]);

  const pwForm = h("form", { class: "mn-panel glass", style: { marginTop: "24px" } }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-lock" })), h("div", {}, [h("div", { class: "panel-title" }, "Change Password")])])]),
    h("div", { class: "glass-body" }, [
      h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Current password"), h("input", { class: "input", type: "password", name: "current" })]),
      h("div", { class: "form-grid" }, [
        h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "New password"), h("input", { class: "input", type: "password", name: "next" })]),
        h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Confirm new password"), h("input", { class: "input", type: "password", name: "confirm" })]),
      ]),
      h("button", { class: "btn btn-primary", type: "submit", style: { marginTop: "8px" } }, h("i", { class: "fa-solid fa-key" }), " Update Password"),
    ]),
  ]);

  pwForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(pwForm).entries());
    if (data.next !== data.confirm) { Toast.error("Password mismatch", "New passwords don't match."); return; }
    try {
      changePassword(data.current, data.next);
      Toast.success("Password changed", "Your password has been updated.");
      pwForm.reset();
    } catch (err) {
      Toast.error("Failed", err.message || "Could not change password.");
    }
  });

  const danger = h("div", { class: "mn-panel glass", style: { marginTop: "24px", borderColor: "var(--danger-soft)" } }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-triangle-exclamation" })), h("div", {}, [h("div", { class: "panel-title", style: { color: "var(--danger)" } }, "Danger Zone")])])]),
    h("div", { class: "glass-body" }, [
      settingRow("Reset demo data", "Re-seed the local database with fresh demo content", h("button", { class: "btn btn-outline btn-sm", onclick: () => { seedDatabase(); Toast.info("Data reset", "Demo data re-seeded."); Router.reload(); } }, h("i", { class: "fa-solid fa-rotate" }), " Reset")),
      settingRow("Sign out", "End your current session", h("button", { class: "btn btn-outline btn-sm", onclick: () => { logout(); Router.navigate("/auth/login"); } }, h("i", { class: "fa-solid fa-right-from-bracket" }), " Sign out")),
    ]),
  ]);

  return h("div", { class: "anim-fade-up", style: { maxWidth: "760px", margin: "0 auto" } }, [
    h("div", { class: "page-header" }, [h("h1", { style: { margin: 0, fontSize: "26px" } }, "Settings")]),
    h("div", { style: { marginTop: "16px" } }, [preferences, notifications, pwForm, danger]),
  ]);
}

export const route = { path: "/settings", title: "Settings", layout: "user", auth: true, view };

export default { view, route };
