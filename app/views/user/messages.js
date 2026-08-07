/**
 * MediNova — View: Messages.
 */

import { h } from "../../utils/html.js";
import * as Router from "../../router/Router.js";
import * as Db from "../../data/db.js";
import * as Store from "../../state/store.js";
import UserData from "../../services/UserDataService.js";
import { messages } from "../../data/mock/messages.js";
import { timeAgo } from "../../utils/date.js";
import { uid } from "../../utils/id.js";
import * as Toast from "../../services/ToastService.js";

export async function view(ctx) {
  const doctorId = ctx.query.doctor || "";
  const conversations = UserData.myConversations();
  const user = UserData.myId();

  const activeConv = doctorId
    ? conversations.find((c) => c.doctorId === doctorId) || { id: "new", doctorId, doctorName: "Doctor", lastMessage: "", lastTime: "", unread: 0 }
    : conversations[0];

  const convList = h("div", { class: "mn-panel glass", style: { height: "calc(100vh - 240px)", display: "flex", flexDirection: "column" } }, [
    h("div", { class: "glass-header" }, [h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-comment-medical" })), h("div", {}, [h("div", { class: "panel-title" }, "Messages"), h("div", { class: "panel-subtitle" }, "Chat with your doctors")])])]),
    h("div", { class: "glass-body", style: { padding: 0, overflowY: "auto", flex: 1 } },
      conversations.map((c) =>
        h("a", { class: "conv-row", href: `#/messages?doctor=${c.doctorId}`, style: { display: "flex", gap: "12px", padding: "14px 16px", borderBottom: "1px solid var(--glass-border)", textDecoration: "none", color: "inherit", background: c.doctorId === activeConv?.doctorId ? "var(--color-primary-tint)" : "transparent" } }, [
          h("span", { class: "avatar avatar-md" }, h("span", {}, c.doctorName.replace("Dr. ", "").split(" ").map((p) => p[0]).slice(0, 2).join(""))),
          h("div", { style: { flex: 1, minWidth: 0 } }, [
            h("div", { style: { fontWeight: 600, fontSize: "14px" } }, c.doctorName),
            h("div", { style: { color: "var(--text-muted)", fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, c.lastMessage),
          ]),
          h("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" } }, [
            h("span", { style: { color: "var(--text-muted)", fontSize: "11px" } }, timeAgo(c.lastTime)),
            c.unread ? h("span", { class: "notif-count", style: { position: "static", display: "inline-flex" } }, c.unread) : null,
          ]),
        ]))),
  ]);

  const chatMsgs = (messages.filter((m) => m.conversationId === activeConv?.id) || []);

  const chatBox = h("div", { class: "mn-panel glass", style: { display: "flex", flexDirection: "column", height: "calc(100vh - 240px)" } }, [
    h("div", { class: "glass-header", style: { justifyContent: "space-between" } }, [
      h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-user-doctor" })), h("div", {}, [h("div", { class: "panel-title" }, activeConv.doctorName), h("div", { class: "panel-subtitle" }, h("span", { class: "status-dot status-online" }), " Online")])]),
    ]),
    h("div", { id: "chat-body", class: "glass-body", style: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" } },
      chatMsgs.length ? chatMsgs.map((m) =>
        h("div", { class: ["chat-bubble", m.senderId === user ? "me" : ""].join(" "), style: { alignSelf: m.senderId === user ? "flex-end" : "flex-start", maxWidth: "72%" } }, [
          h("div", { class: "chat-msg" }, m.text),
          h("div", { class: "chat-meta" }, timeAgo(m.time)),
        ])) :
      h("div", { style: { margin: "auto" } }, h("mn-empty", { icon: "comment-dots", title: "Start the conversation", text: "Send a message to your doctor." })),
    ),
    h("div", { class: "glass-footer", style: { display: "flex", gap: "10px", padding: "14px 16px" } }, [
      h("input", { class: "input", id: "msg-input", placeholder: "Type a message...", style: { flex: 1 } }),
      h("button", { class: "btn btn-primary btn-icon", id: "msg-send", "aria-label": "Send" }, h("i", { class: "fa-solid fa-paper-plane" })),
    ]),
  ]);

  chatBox.querySelector("#msg-send").addEventListener("click", send);
  chatBox.querySelector("#msg-input").addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });

  function send() {
    const input = chatBox.querySelector("#msg-input");
    const text = input.value.trim();
    if (!text) return;
    Db.collection("messages").insert({
      id: uid("msg"),
      conversationId: activeConv.id,
      senderId: user,
      senderName: "You",
      text,
      time: new Date().toISOString(),
      read: false,
      attachments: [],
    });
    input.value = "";
    const body = chatBox.querySelector("#chat-body");
    body.appendChild(h("div", { class: "chat-bubble me", style: { alignSelf: "flex-end", maxWidth: "72%" } }, [h("div", { class: "chat-msg" }, text), h("div", { class: "chat-meta" }, "just now")]));
    body.scrollTop = body.scrollHeight;
    Toast.info("Message sent", `Delivered to ${activeConv.doctorName}.`);
  }

  return h("div", { class: "anim-fade-up" }, [
    h("div", { class: "page-header" }, [h("h1", { style: { margin: 0, fontSize: "26px" } }, "Messages")]),
    h("div", { class: "grid", style: { gridTemplateColumns: "360px 1fr", gap: "20px", marginTop: "16px" } }, [convList, chatBox]),
  ]);
}

export const route = { path: "/messages", title: "Messages", layout: "user", auth: true, view };

export default { view, route };
