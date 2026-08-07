/**
 * MediNova — View: Notifications.
 */

import { h } from "../../utils/html.js";
import * as Db from "../../data/db.js";
import * as Store from "../../state/store.js";
import UserData from "../../services/UserDataService.js";
import { NOTIFICATION_TYPES } from "../../config/constants.js";
import { timeAgo } from "../../utils/date.js";
import * as Toast from "../../services/ToastService.js";

export async function view() {
  const notifications = UserData.myNotifications();

  function iconFor(type) {
    return NOTIFICATION_TYPES.find((t) => t.id === type)?.icon || "fa-bell";
  }

  const list = h("div", { class: "mn-panel glass" });

  function markRead() {
    notifications.forEach((n) => Db.collection("notifications").update(n.id, { read: true }));
    Store.set("unreadNotifications", 0);
    render();
  }

  function render() {
    list.replaceChildren(
      h("div", { class: "glass-header" }, [
        h("div", { class: "panel-heading" }, [h("div", { class: "icon-box icon-box-sm" }, h("i", { class: "fa-solid fa-bell" })), h("div", {}, [h("div", { class: "panel-title" }, "Notifications"), h("div", { class: "panel-subtitle" }, `${notifications.filter((n) => !n.read).length} unread`)])]),
        h("button", { class: "btn btn-ghost btn-sm", onclick: markRead }, h("i", { class: "fa-solid fa-check-double" }), " Mark all read"),
      ]),
      h("div", { class: "glass-body", style: { padding: 0 } },
        notifications.length ? notifications.map((n) =>
          h("div", { style: { display: "flex", gap: "12px", padding: "14px 20px", borderBottom: "1px solid var(--glass-border)", background: n.read ? "transparent" : "var(--color-primary-tint)", cursor: "pointer", alignItems: "flex-start" } }, [
            h("div", { class: "icon-box icon-box-sm" }, h("i", { class: `fa-solid ${iconFor(n.type)}` })),
            h("div", { style: { flex: 1, minWidth: 0 } }, [
              h("div", { style: { fontWeight: n.read ? 500 : 700, fontSize: "14px" } }, n.title),
              h("div", { style: { color: "var(--text-muted)", fontSize: "13px" } }, n.message),
            ]),
            h("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" } }, [
              h("span", { style: { color: "var(--text-muted)", fontSize: "11px", whiteSpace: "nowrap" } }, timeAgo(n.createdAt)),
              !n.read ? h("span", { class: "badge badge-dot badge-purple" }) : null,
            ]),
          ])) :
        h("div", { style: { padding: "32px 24px" } }, h("mn-empty", { icon: "bell-slash", title: "No notifications", text: "You're all caught up." })),
      ),
    );
  }

  render();

  return h("div", { class: "anim-fade-up" }, [
    h("div", { class: "page-header" }, [
      h("h1", { style: { margin: 0, fontSize: "26px" } }, "Notifications"),
      h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, "Updates on appointments, orders and more"),
    ]),
    h("div", { style: { marginTop: "16px" } }, list),
  ]);
}

export const route = { path: "/notifications", title: "Notifications", layout: "user", auth: true, view };

export default { view, route };
