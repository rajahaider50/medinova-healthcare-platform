/**
 * MediNova — View: Admin platform settings.
 * Editable brand, appointments and pharmacy settings persisted via BrandService.
 */

import { h } from "../../utils/html.js";
import * as Brand from "../../services/BrandService.js";
import * as Toast from "../../services/ToastService.js";
import { currentUser } from "../../services/AuthService.js";

export async function view() {
  const settings = Brand.getSettings();
  const brand = settings.brand;
  const appt = settings.appointments;
  const pharm = settings.pharmacy;

  function settingRow(label, sub, control) {
    return h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", padding: "14px 0", borderBottom: "1px solid var(--glass-border)" } }, [
      h("div", {}, [h("div", { style: { fontWeight: 600, fontSize: "14px" } }, label), sub ? h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, sub) : null]),
      control,
    ]);
  }

  function mkSwitch(label, on) {
    const sw = h("mn-switch", { label });
    if (on) sw.setAttribute("checked", "");
    return sw;
  }

  const brandName = h("input", { class: "input", id: "set-brand-name", value: brand.name || "" });
  const brandTagline = h("input", { class: "input", id: "set-brand-tagline", value: brand.tagline || "" });
  const supportEmail = h("input", { class: "input", id: "set-support-email", type: "email", value: brand.supportEmail || "" });
  const supportPhone = h("input", { class: "input", id: "set-support-phone", value: brand.supportPhone || "" });
  const supportAddress = h("input", { class: "input", id: "set-support-address", value: brand.address || "" });
  const accentColor = h("input", { class: "input", id: "set-accent-color", type: "color", value: /^#[0-9a-f]{6}$/i.test(brand.accentColor || "") ? brand.accentColor : "#8b5cf6", style: { width: "64px", height: "40px", padding: "2px" } });
  const footerText = h("input", { class: "input", id: "set-footer-text", value: brand.footerText || "" });

  const onlineSwitch = mkSwitch("Online consultations", !!appt.enableOnline);
  const inPersonSwitch = mkSwitch("In-person appointments", !!appt.enableInPerson);
  const slotDuration = h("input", { class: "input", type: "number", value: String(appt.slotDuration), style: { width: "90px" } });
  const workingStart = h("input", { class: "input", type: "time", value: appt.workingStart || "09:00", style: { width: "110px" } });
  const workingEnd = h("input", { class: "input", type: "time", value: appt.workingEnd || "18:00", style: { width: "110px" } });

  const uploadSwitch = mkSwitch("Prescription upload", !!pharm.enablePrescriptionUpload);
  const couponSwitch = mkSwitch("Enable coupons", !!pharm.enableCoupons);
  const deliveryFee = h("input", { class: "input", type: "number", value: String(pharm.deliveryFee), style: { width: "90px" } });
  const freeDeliveryAbove = h("input", { class: "input", type: "number", value: String(pharm.freeDeliveryAbove), style: { width: "90px" } });

  const brandPanel = h("div", { class: "mn-panel glass" }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-building" })), h("div", {}, [h("div", { class: "panel-title" }, "Brand & Contact"), h("div", { class: "panel-subtitle" }, "Platform identity shown across the app")])])]),
    h("div", { class: "glass-body" }, [
      h("div", { class: "form-grid" }, [
        h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Platform name"), brandName]),
        h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Tagline"), brandTagline]),
        h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Support email"), supportEmail]),
        h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Support phone"), supportPhone]),
        h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Support address"), supportAddress]),
        h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Accent color"), accentColor]),
        h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Footer text"), footerText]),
      ]),
    ]),
  ]);

  const appointmentsPanel = h("div", { class: "mn-panel glass", style: { marginTop: "24px" } }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-calendar-days" })), h("div", {}, [h("div", { class: "panel-title" }, "Appointments"), h("div", { class: "panel-subtitle" }, "Booking behaviour")])])]),
    h("div", { class: "glass-body" }, [
      settingRow("Online consultations", "Allow booking online video appointments", onlineSwitch),
      settingRow("In-person appointments", "Allow clinic visit bookings", inPersonSwitch),
      settingRow("Slot duration", "Default minutes per slot", h("div", { style: { display: "flex", alignItems: "center", gap: "10px" } }, [slotDuration, h("span", { style: { color: "var(--text-muted)", fontSize: "12px" } }, "min")])),
      settingRow("Working hours", "Available booking window", h("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, [workingStart, h("span", {}, "—"), workingEnd])),
    ]),
  ]);

  const pharmacyPanel = h("div", { class: "mn-panel glass", style: { marginTop: "24px" } }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-cart-shopping" })), h("div", {}, [h("div", { class: "panel-title" }, "Pharmacy"), h("div", { class: "panel-subtitle" }, "Store & delivery policies")])])]),
    h("div", { class: "glass-body" }, [
      settingRow("Prescription upload", "Require upload for Rx medicines", uploadSwitch),
      settingRow("Enable coupons", "Allow discount coupon codes", couponSwitch),
      settingRow("Delivery fee", "Flat fee in Rs", h("div", { style: { display: "flex", alignItems: "center", gap: "10px" } }, [deliveryFee, h("span", { style: { color: "var(--text-muted)", fontSize: "12px" } }, "Rs")])),
      settingRow("Free delivery above", "Threshold order total", h("div", { style: { display: "flex", alignItems: "center", gap: "10px" } }, [freeDeliveryAbove, h("span", { style: { color: "var(--text-muted)", fontSize: "12px" } }, "Rs")])),
    ]),
  ]);

  const saveBtn = h("button", {
    class: "btn btn-primary",
    onclick: () => {
      try {
        Brand.saveSettings({
          brand: {
            name: brandName.value.trim(),
            tagline: brandTagline.value.trim(),
            supportEmail: supportEmail.value.trim(),
            supportPhone: supportPhone.value.trim(),
            address: supportAddress.value.trim(),
            accentColor: accentColor.value,
            footerText: footerText.value.trim(),
          },
          appointments: {
            enableOnline: onlineSwitch.hasAttribute("checked"),
            enableInPerson: inPersonSwitch.hasAttribute("checked"),
            slotDuration: Number(slotDuration.value) || 30,
            workingStart: workingStart.value,
            workingEnd: workingEnd.value,
          },
          pharmacy: {
            enablePrescriptionUpload: uploadSwitch.hasAttribute("checked"),
            enableCoupons: couponSwitch.hasAttribute("checked"),
            deliveryFee: Number(deliveryFee.value) || 0,
            freeDeliveryAbove: Number(freeDeliveryAbove.value) || 0,
          },
        }, currentUser()?.id);
        Toast.success("Settings saved", "Platform settings updated across the app.");
      } catch (err) {
        Toast.error("Save failed", err.message || "Please try again.");
      }
    },
  }, h("i", { class: "fa-solid fa-check" }), " Save Changes");

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
