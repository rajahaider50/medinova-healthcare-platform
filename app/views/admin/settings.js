/**
 * MediNova — View: Admin platform settings.
 */

import { h } from "../../utils/html.js";
import { platformSettings } from "../../data/mock/settings.js";
import * as Toast from "../../services/ToastService.js";

export async function view() {
  const brand = platformSettings.brand;
  const appt = platformSettings.appointments;
  const pharm = platformSettings.pharmacy;

  function settingRow(label, sub, control) {
    return h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", padding: "14px 0", borderBottom: "1px solid var(--glass-border)" } }, [
      h("div", {}, [h("div", { style: { fontWeight: 600, fontSize: "14px" } }, label), sub ? h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, sub) : null]),
      control,
    ]);
  }

  const onlineSwitch = h("mn-switch", { label: "Online consultations", checked: appt.enableOnline ? "checked" : null });
  const inPersonSwitch = h("mn-switch", { label: "In-person appointments", checked: appt.enableInPerson ? "checked" : null });
  const uploadSwitch = h("mn-switch", { label: "Prescription upload", checked: pharm.enablePrescriptionUpload ? "checked" : null });
  const couponSwitch = h("mn-switch", { label: "Enable coupons", checked: pharm.enableCoupons ? "checked" : null });

  const brandPanel = h("div", { class: "mn-panel glass" }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-building" })), h("div", {}, [h("div", { class: "panel-title" }, "Brand & Contact"), h("div", { class: "panel-subtitle" }, "Platform identity shown across the app")])])]),
    h("div", { class: "glass-body" }, [
      h("div", { class: "form-grid" }, [
        h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Platform name"), h("input", { class: "input", value: brand.name, readonly: "" })]),
        h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Tagline"), h("input", { class: "input", value: brand.tagline, readonly: "" })]),
        h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Support email"), h("input", { class: "input", value: brand.supportEmail, readonly: "" })]),
        h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Support phone"), h("input", { class: "input", value: brand.supportPhone, readonly: "" })]),
      ]),
      h("p", { style: { color: "var(--text-muted)", fontSize: "12px" } }, h("i", { class: "fa-solid fa-lock" }), " Brand settings are read-only in this demo build."),
    ]),
  ]);

  const appointmentsPanel = h("div", { class: "mn-panel glass", style: { marginTop: "24px" } }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-calendar-days" })), h("div", {}, [h("div", { class: "panel-title" }, "Appointments"), h("div", { class: "panel-subtitle" }, "Booking behaviour")])])]),
    h("div", { class: "glass-body" }, [
      settingRow("Online consultations", "Allow booking online video appointments", onlineSwitch),
      settingRow("In-person appointments", "Allow clinic visit bookings", inPersonSwitch),
      settingRow("Slot duration", "Default minutes per slot", h("div", { style: { display: "flex", alignItems: "center", gap: "10px" } }, [h("input", { class: "input", type: "number", value: String(appt.slotDuration), style: { width: "90px" } }), h("span", { style: { color: "var(--text-muted)", fontSize: "12px" } }, "min")])),
      settingRow("Working hours", "Available booking window", h("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, [h("input", { class: "input", type: "time", value: appt.workingStart, style: { width: "110px" } }), h("span", {}, "—"), h("input", { class: "input", type: "time", value: appt.workingEnd, style: { width: "110px" } })])),
    ]),
  ]);

  const pharmacyPanel = h("div", { class: "mn-panel glass", style: { marginTop: "24px" } }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-cart-shopping" })), h("div", {}, [h("div", { class: "panel-title" }, "Pharmacy"), h("div", { class: "panel-subtitle" }, "Store & delivery policies")])])]),
    h("div", { class: "glass-body" }, [
      settingRow("Prescription upload", "Require upload for Rx medicines", uploadSwitch),
      settingRow("Enable coupons", "Allow discount coupon codes", couponSwitch),
      settingRow("Delivery fee", "Flat fee in Rs", h("div", { style: { display: "flex", alignItems: "center", gap: "10px" } }, [h("input", { class: "input", type: "number", value: String(pharm.deliveryFee), style: { width: "90px" } }), h("span", { style: { color: "var(--text-muted)", fontSize: "12px" } }, "Rs")])),
      settingRow("Free delivery above", "Threshold order total", h("div", { style: { display: "flex", alignItems: "center", gap: "10px" } }, [h("input", { class: "input", type: "number", value: String(pharm.freeDeliveryAbove), style: { width: "90px" } }), h("span", { style: { color: "var(--text-muted)", fontSize: "12px" } }, "Rs")])),
    ]),
  ]);

  const saveBtn = h("button", { class: "btn btn-primary", onclick: () => Toast.success("Saved", "Platform settings updated (demo).") }, h("i", { class: "fa-solid fa-check" }), " Save Changes");

  const header = h("div", { style: { marginBottom: "24px" } }, [
    h("h1", { style: { margin: 0, fontSize: "26px" } }, "Platform Settings"),
    h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, "Configure brand, appointments and pharmacy defaults"),
  ]);

  return h("div", { class: "anim-fade-up" }, [
    header,
    brandPanel,
    appointmentsPanel,
    pharmacyPanel,
    h("div", { style: { marginTop: "24px" } }, saveBtn),
  ]);
}

export const route = { path: "/admin/settings", title: "Platform Settings", layout: "admin", auth: true, roles: ["admin", "super_admin"], view };

export default { view, route };
