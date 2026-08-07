/**
 * MediNova — View: My Profile.
 */

import { h } from "../../utils/html.js";
import * as Db from "../../data/db.js";
import * as Toast from "../../services/ToastService.js";
import * as Store from "../../state/store.js";
import { currentUser } from "../../services/AuthService.js";
import UserData from "../../services/UserDataService.js";

export async function view() {
  const user = currentUser();

  const infoRow = (label, value) =>
    h("div", { style: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--glass-border)", gap: "16px" } }, [
      h("span", { style: { color: "var(--text-muted)" } }, label),
      h("span", { style: { fontWeight: 600, textAlign: "right" } }, value || "—"),
    ]);

  const profileCard = h("div", { class: "mn-panel glass" }, [
    h("div", { class: "glass-body", style: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "28px 24px" } }, [
      h("span", { class: "avatar avatar-2xl" }, h("span", {}, user.name.split(" ").map((p) => p[0]).slice(0, 2).join(""))),
      h("h2", { style: { margin: "14px 0 2px", fontSize: "20px" } }, user.name),
      h("p", { style: { color: "var(--text-muted)", margin: 0 } }, user.email),
      h("div", { style: { marginTop: "10px" } }, h("span", { class: "badge badge-purple" }, user.role)),
    ]),
  ]);

  const detailsCard = h("div", { class: "mn-panel glass" }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-id-card" })), h("div", {}, [h("div", { class: "panel-title" }, "Personal Details")])])]),
    h("div", { class: "glass-body" }, [
      infoRow("Full name", user.name),
      infoRow("Email", user.email),
      infoRow("Phone", user.phone),
      infoRow("Date of birth", user.dob),
      infoRow("Gender", user.gender),
      infoRow("Blood group", user.bloodGroup),
      infoRow("City", user.city),
      infoRow("Address", user.address),
      infoRow("Emergency contact", user.emergencyContact ? `${user.emergencyName} · ${user.emergencyContact}` : null),
    ]),
  ]);

  const medicalCard = h("div", { class: "mn-panel glass" }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-stethoscope" })), h("div", {}, [h("div", { class: "panel-title" }, "Medical Profile")])])]),
    h("div", { class: "glass-body" }, [
      infoRow("Allergies", user.allergies?.length ? user.allergies.join(", ") : "None"),
      infoRow("Medical history", user.medicalHistory?.length ? user.medicalHistory.join(", ") : "None"),
      infoRow("Current medications", user.currentMedications?.length ? user.currentMedications.join(", ") : "None"),
    ]),
  ]);

  const form = h("form", { class: "mn-panel glass", style: { marginTop: "24px" } }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-pen" })), h("div", {}, [h("div", { class: "panel-title" }, "Edit Profile")])])]),
    h("div", { class: "glass-body" }, [
      h("div", { class: "form-grid" }, [
        h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Full name"), h("input", { class: "input", name: "name", value: user.name }) ]),
        h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Phone"), h("input", { class: "input", name: "phone", value: user.phone }) ]),
        h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "City"), h("input", { class: "input", name: "city", value: user.city }) ]),
        h("div", { class: "form-group" }, [h("label", { class: "form-label" }, "Address"), h("input", { class: "input", name: "address", value: user.address }) ]),
      ]),
      h("button", { class: "btn btn-primary", type: "submit", style: { marginTop: "16px" } }, h("i", { class: "fa-solid fa-floppy-disk" }), " Save Changes"),
    ]),
  ]);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    Db.collection("users").update(user.id, data);
    const updated = Db.collection("users").get(user.id);
    Store.setUser(updated);
    Toast.success("Profile updated", "Your profile has been saved.");
  });

  return h("div", { class: "anim-fade-up" }, [
    h("div", { class: "page-header" }, [h("h1", { style: { margin: 0, fontSize: "26px" } }, "My Profile")]),
    h("div", { class: "grid", style: { gridTemplateColumns: "340px 1fr", gap: "24px", marginTop: "16px" } }, [
      profileCard,
      h("div", {}, [detailsCard, h("div", { style: { marginTop: "24px" } }, medicalCard)]),
    ]),
    form,
  ]);
}

export const route = { path: "/profile", title: "My Profile", layout: "user", auth: true, view };

export default { view, route };
