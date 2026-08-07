/**
 * MediNova — View: Support (tickets + FAQs).
 */

import { h } from "../../utils/html.js";
import * as Db from "../../data/db.js";
import * as Toast from "../../services/ToastService.js";
import { currentUser } from "../../services/AuthService.js";
import { tickets, faqs, ticketCategories } from "../../data/mock/tickets.js";
import { uid } from "../../utils/id.js";
import { timeAgo } from "../../utils/date.js";

const TONE = { open: "warning", pending: "info", "in-progress": "purple", resolved: "success", closed: "neutral" };

export async function view() {
  const user = currentUser();
  const myTickets = tickets.filter((t) => t.userId === user.id);

  const subjectInput = h("input", { class: "input", id: "tkt-subject", placeholder: "Subject", style: { marginBottom: "10px" } });
  const categorySelect = h("select", { class: "select", id: "tkt-category", style: { marginBottom: "10px" } },
    ticketCategories.map((c) => h("option", { value: c }, c)));
  const msgInput = h("textarea", { class: "textarea", id: "tkt-msg", rows: 3, placeholder: "Describe your issue...", style: { marginBottom: "10px" } });

  const ticketsPanel = h("div", { class: "mn-panel glass" }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-headset" })), h("div", {}, [h("div", { class: "panel-title" }, "My Support Tickets"), h("div", { class: "panel-subtitle" }, `${myTickets.length} ticket(s)`)])])]),
    h("div", { class: "glass-body", style: { padding: 0 } },
      myTickets.length ? myTickets.map((t) =>
        h("div", { style: { padding: "14px 20px", borderBottom: "1px solid var(--glass-border)" } }, [
          h("div", { style: { display: "flex", justifyContent: "space-between", gap: "8px", flexWrap: "wrap", alignItems: "center" } }, [
            h("div", { style: { fontWeight: 600, fontSize: "14px" } }, t.subject),
            h("span", { class: `badge badge-${TONE[t.status] || "neutral"}` }, t.status),
          ]),
          h("p", { style: { color: "var(--text-muted)", fontSize: "13px", margin: "6px 0 0" } }, t.message),
          h("div", { style: { display: "flex", justifyContent: "space-between", marginTop: "8px" } }, [
            h("span", { style: { color: "var(--text-muted)", fontSize: "11px" } }, `#${t.id} · ${timeAgo(t.createdAt)}`),
            h("span", { class: "badge badge-neutral" }, t.category),
          ]),
        ])) :
      h("div", { style: { padding: "24px" } }, h("mn-empty", { icon: "ticket", title: "No tickets yet", text: "Create a ticket and we'll get back to you." })),
    ),
  ]);

  const formPanel = h("div", { class: "mn-panel glass", style: { alignSelf: "flex-start" } }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-circle-plus" })), h("div", {}, [h("div", { class: "panel-title" }, "New Ticket")])])]),
    h("div", { class: "glass-body" }, [
      subjectInput,
      categorySelect,
      msgInput,
      h("button", {
        class: "btn btn-primary btn-block",
        onclick: () => {
          if (!subjectInput.value.trim() || !msgInput.value.trim()) {
            Toast.warning("Incomplete", "Please fill in subject and message.");
            return;
          }
          Db.collection("tickets").insert({
            id: uid("tkt"),
            userId: user.id,
            userName: user.name,
            subject: subjectInput.value.trim(),
            category: categorySelect.value,
            priority: "medium",
            status: "open",
            message: msgInput.value.trim(),
            attachments: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            replies: [],
          });
          Toast.success("Ticket created", "Our support team will respond shortly.");
          subjectInput.value = "";
          msgInput.value = "";
        },
      }, h("i", { class: "fa-solid fa-paper-plane" }), " Submit Ticket"),
    ]),
  ]);

  const faqPanel = h("div", { class: "mn-panel glass", style: { marginTop: "24px" } }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-circle-question" })), h("div", {}, [h("div", { class: "panel-title" }, "Frequently Asked Questions"), h("div", { class: "panel-subtitle" }, `${faqs.length} answers`)])])]),
    h("div", { class: "glass-body" },
      faqs.map((f) =>
        h("div", { class: "qa-item", style: { padding: "12px 0", borderBottom: "1px solid var(--glass-border)" } }, [
          h("h3", { style: { fontSize: "14px", margin: "0 0 4px" } }, f.question),
          h("p", { style: { color: "var(--text-muted)", fontSize: "13px", margin: 0 } }, f.answer),
        ]))),
  ]);

  return h("div", { class: "anim-fade-up" }, [
    h("div", { class: "page-header" }, [h("h1", { style: { margin: 0, fontSize: "26px" } }, "Support")]),
    h("div", { class: "grid", style: { gridTemplateColumns: "1.6fr 1fr", gap: "24px", marginTop: "16px" } }, [ticketsPanel, formPanel]),
    faqPanel,
  ]);
}

export const route = { path: "/support", title: "Support", layout: "user", auth: true, view };

export default { view, route };
