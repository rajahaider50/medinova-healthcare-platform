/**
 * MediNova — View: Admin users management.
 */

import { h } from "../../utils/html.js";
import * as Db from "../../data/db.js";
import * as Toast from "../../services/ToastService.js";
import { initials } from "../../utils/format.js";
import { timeAgo } from "../../utils/date.js";

const ROLE_TONE = { admin: "danger", super_admin: "danger", doctor: "info", patient: "success", staff: "warning" };

export async function view() {
  const table = h("div", {});

  function render(term = "", role = "") {
    let list = Db.collection("users").all();
    if (term) list = list.filter((u) => `${u.name} ${u.email} ${u.phone}`.toLowerCase().includes(term.toLowerCase()));
    if (role) list = list.filter((u) => u.role === role);

    const rows = list.map((u) =>
      h("tr", {}, [
        h("td", {}, h("div", { style: { display: "flex", alignItems: "center", gap: "10px" } }, [
          h("span", { class: "avatar avatar-sm" }, u.avatar || initials(u.name)),
          h("div", {}, [h("div", { style: { fontWeight: 600, fontSize: "14px" } }, u.name), h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, u.email)]),
        ])),
        h("td", {}, h("span", { class: `badge badge-${ROLE_TONE[u.role] || "neutral"}` }, u.role)),
        h("td", {}, h("div", {}, u.phone || "—")),
        h("td", {}, h("div", {}, u.status === "active" ? h("span", { class: "badge badge-success" }, "Active") : h("span", { class: "badge badge-danger" }, u.status || "Inactive"))),
        h("td", {}, h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, timeAgo(u.createdAt))),
        h("td", { style: { textAlign: "right" } }, h("div", { style: { display: "flex", gap: "4px", justifyContent: "flex-end" } }, [
          h("button", { class: "btn btn-ghost btn-sm icon-btn", "data-act": "view", "data-id": u.id, title: "View profile" }, h("i", { class: "fa-solid fa-eye" })),
          h("button", { class: "btn btn-ghost btn-sm icon-btn", "data-act": "toggle", "data-id": u.id, title: u.status === "active" ? "Deactivate" : "Activate" }, h("i", { class: `fa-solid ${u.status === "active" ? "fa-ban" : "fa-check"}` })),
        ])),
      ]));
    table.replaceChildren(
      rows.length
        ? h("table", { class: "table" }, [h("thead", {}, h("tr", {}, [h("th", {}, "User"), h("th", {}, "Role"), h("th", {}, "Phone"), h("th", {}, "Status"), h("th", {}, "Joined"), h("th", { style: { width: "60px" } }, "")])), h("tbody", {}, rows)])
        : h("div", { style: { padding: "32px" } }, h("mn-empty", { icon: "users-slash", title: "No users found", sub: "Adjust filters or add a user." }))
    );
  }

  const search = h("input", { class: "input", placeholder: "Search users…" });
  const roleFilter = h("select", { class: "input", style: { maxWidth: "160px" } }, [
    h("option", { value: "" }, "All roles"),
    ...["admin", "doctor", "patient", "staff"].map((r) => h("option", { value: r }, r)),
  ]);
  search.addEventListener("input", () => render(search.value, roleFilter.value));
  roleFilter.addEventListener("change", () => render(search.value, roleFilter.value));

  table.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const { act, id } = btn.dataset;
    if (act === "toggle") {
      const user = Db.collection("users").get(id);
      if (!user) return;
      const next = user.status === "active" ? "inactive" : "active";
      Db.collection("users").update(id, { status: next });
      Toast.success("Updated", `${user.name} is now ${next}.`);
      render(search.value, roleFilter.value);
    } else if (act === "view") {
      const user = Db.collection("users").get(id);
      if (user) Toast.info(user.name, `${user.email} · ${user.role}`);
    }
  });

  render();

  const header = h("div", { class: "flex items-center justify-between flex-wrap gap-3", style: { marginBottom: "24px" } }, [
    h("div", {}, [h("h1", { style: { margin: 0, fontSize: "26px" } }, "Users"), h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, "Manage all platform accounts")]),
    h("button", { class: "btn btn-primary", onclick: () => Toast.info("Coming soon", "User creation form will be added in the full release.") }, h("i", { class: "fa-solid fa-user-plus" }), " Add User"),
  ]);

  const panel = h("div", { class: "mn-panel glass", style: { marginTop: "16px" } }, [
    h("div", { class: "glass-header flex items-center justify-between flex-wrap gap-3" }, [search, roleFilter]),
    h("div", { class: "glass-body", style: { padding: 0 } }, table),
  ]);

  return h("div", { class: "anim-fade-up" }, [header, panel]);
}

export const route = { path: "/admin/users", title: "Users", layout: "admin", auth: true, roles: ["admin", "super_admin"], view };

export default { view, route };
