/**
 * MediNova — View: Admin security.
 */

import { h } from "../../utils/html.js";
import { platformSettings } from "../../data/mock/settings.js";
import * as Toast from "../../services/ToastService.js";
import * as Store from "../../errors/ErrorStore.js";

export async function view() {
  const sec = platformSettings.security;

  function settingRow(label, sub, control) {
    return h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", padding: "14px 0", borderBottom: "1px solid var(--glass-border)" } }, [
      h("div", {}, [h("div", { style: { fontWeight: 600, fontSize: "14px" } }, label), sub ? h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, sub) : null]),
      control,
    ]);
  }

  const verifySwitch = h("mn-switch", { label: "Email verification", checked: sec.requireEmailVerification ? "checked" : null });
  const twoFaSwitch = h("mn-switch", { label: "Two-factor auth", checked: sec.enable2fa ? "checked" : null });
  const sessionRow = h("div", { style: { display: "flex", alignItems: "center", gap: "10px" } }, [
    h("input", { class: "input", type: "number", value: String(sec.sessionTimeoutMin), style: { width: "90px" } }),
    h("span", { style: { color: "var(--text-muted)", fontSize: "12px" } }, "minutes"),
  ]);
  const attemptsRow = h("div", { style: { display: "flex", alignItems: "center", gap: "10px" } }, [
    h("input", { class: "input", type: "number", value: String(sec.maxLoginAttempts), style: { width: "90px" } }),
    h("span", { style: { color: "var(--text-muted)", fontSize: "12px" } }, "attempts"),
  ]);

  const securityPanel = h("div", { class: "mn-panel glass" }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-shield-halved" })), h("div", {}, [h("div", { class: "panel-title" }, "Security Policies"), h("div", { class: "panel-subtitle" }, "Platform-wide security settings")])])]),
    h("div", { class: "glass-body" }, [
      settingRow("Require email verification", "Users must verify email before full access", verifySwitch),
      settingRow("Session timeout", "Auto sign-out after inactivity", sessionRow),
      settingRow("Max login attempts", "Lock after repeated failed logins", attemptsRow),
      settingRow("Two-factor authentication", "Extra layer for admin accounts", twoFaSwitch),
      h("div", { style: { marginTop: "16px" } }, h("button", { class: "btn btn-primary", onclick: () => Toast.success("Saved", "Security settings updated (demo).") }, h("i", { class: "fa-solid fa-check" }), " Save Changes")),
    ]),
  ]);

  const errorCount = Store.counts().total;

  const statusPanel = h("div", { class: "mn-panel glass", style: { marginTop: "24px" } }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-shield-check" })), h("div", {}, [h("div", { class: "panel-title" }, "Security Status"), h("div", { class: "panel-subtitle" }, "Live protection health")])])]),
    h("div", { class: "glass-body" }, [
      h("div", { class: "status-item", style: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--glass-border)" } }, [h("span", {}, h("i", { class: "fa-solid fa-user-shield" }), " Session management"), h("span", { class: "badge badge-success" }, "Active")]),
      h("div", { style: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--glass-border)" } }, [h("span", {}, h("i", { class: "fa-solid fa-credit-card" }), " Payment handling"), h("span", { class: "badge badge-success" }, "Secured")]),
      h("div", { style: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--glass-border)" } }, [h("span", {}, h("i", { class: "fa-solid fa-lock" }), " Data encryption"), h("span", { class: "badge badge-success" }, "AES-256")]),
      h("div", { style: { display: "flex", justifyContent: "space-between", padding: "10px 0" } }, [h("span", {}, h("i", { class: "fa-solid fa-shield-halved" }), " Error console"), h("span", { class: `badge ${errorCount ? "badge-warning" : "badge-success"}` }, errorCount ? `${errorCount} events` : "Clear")]),
    ]),
  ]);

  return h("div", { class: "anim-fade-up" }, [
    h("div", { style: { marginBottom: "24px" } }, [h("h1", { style: { margin: 0, fontSize: "26px" } }, "Security"), h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, "Authentication, policies and platform protection")]),
    securityPanel,
    statusPanel,
  ]);
}

export const route = { path: "/admin/security", title: "Security", layout: "admin", auth: true, roles: ["admin", "super_admin"], view };

export default { view, route };
