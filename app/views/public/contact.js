/**
 * MediNova — View: Contact.
 */

import { h } from "../../utils/html.js";
import * as Toast from "../../services/ToastService.js";
import * as Brand from "../../services/BrandService.js";
import { prosePage } from "./static.js";
import { field, formData } from "../auth/shared.js";

export async function view() {
  const brand = Brand.getBrand();
  const form = h("form", { class: "form-grid", novalidate: "" }, [
    field({ label: "Your name", name: "name", placeholder: "Full name", icon: "user" }),
    field({ label: "Email", name: "email", type: "email", placeholder: "you@example.com", icon: "envelope" }),
    h("div", { class: "span-full" }, [
      h("label", { class: "form-label", for: "message" }, "Message"),
      h("textarea", { class: "textarea", name: "message", id: "message", rows: 5, placeholder: "How can we help?" }),
    ]),
    h("div", { class: "span-full" }, [
      h("button", { class: "btn btn-primary", type: "submit" }, h("i", { class: "fa-solid fa-paper-plane" }), " Send Message"),
    ]),
  ]);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = formData(form);
    Toast.success("Message sent", `Thanks ${data.name || "there"}! We'll reply to ${data.email || "your email"} soon.`);
    form.reset();
  });

  const page = prosePage({
    title: "Contact us",
    lead: "We're here to help. Reach us through the form or the channels below.",
    sections: [],
  });

  const contactCard = h("div", { class: "mn-panel glass", style: { marginTop: "16px" } }, [
    h("h2", { style: { fontSize: "18px", margin: "0 0 16px" } }, "Send a message"),
    form,
  ]);

  const channels = h("div", { class: "grid grid-auto", style: { marginTop: "16px" } }, [
    h("div", { class: "mn-panel glass" }, [h("div", { class: "icon-box icon-box-purple" }, h("i", { class: "fa-solid fa-envelope" })), h("h3", { style: { margin: "10px 0 4px" } }, "Email"), h("p", { style: { color: "var(--text-muted)", margin: 0 } }, brand.supportEmail)]),
    h("div", { class: "mn-panel glass" }, [h("div", { class: "icon-box icon-box-teal" }, h("i", { class: "fa-solid fa-phone" })), h("h3", { style: { margin: "10px 0 4px" } }, "Phone"), h("p", { style: { color: "var(--text-muted)", margin: 0 } }, brand.supportPhone)]),
    h("div", { class: "mn-panel glass" }, [h("div", { class: "icon-box icon-box-warning" }, h("i", { class: "fa-solid fa-location-dot" })), h("h3", { style: { margin: "10px 0 4px" } }, "Visit"), h("p", { style: { color: "var(--text-muted)", margin: 0 } }, brand.address)]),
  ]);

  return h("div", {}, [page, contactCard, channels]);
}

export const route = { path: "/contact", title: "Contact", layout: "public", view };

export default { view, route };
