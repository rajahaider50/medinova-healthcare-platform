/**
 * MediNova — View: Lab reports.
 */

import { h } from "../../utils/html.js";
import UserData from "../../services/UserDataService.js";
import { formatDate } from "../../utils/date.js";
import * as Toast from "../../services/ToastService.js";

export async function view() {
  const reports = UserData.myReports().sort((a, b) => b.date.localeCompare(a.date));

  const rows = h("div", { class: "mn-panel glass" }, [
    h("div", { class: "table-wrap" }, h("table", { class: "table" }, [
      h("thead", {}, h("tr", {}, [
        h("th", {}, "Test"), h("th", {}, "Lab"), h("th", {}, "Date"), h("th", {}, "Result"), h("th", {}, "Status"), h("th", {}, ""),
      ])),
      h("tbody", {}, reports.length ? reports.map((r) =>
        h("tr", {}, [
          h("td", { style: { fontWeight: 600 } }, r.test),
          h("td", {}, r.lab),
          h("td", {}, formatDate(r.date)),
          h("td", { style: { fontSize: "13px", maxWidth: "240px" } }, r.result),
          h("td", {}, h("span", { class: `badge ${r.status === "normal" ? "badge-success" : "badge-danger"}` }, r.status)),
          h("td", {}, h("button", { class: "btn btn-ghost btn-sm", onclick: () => Toast.info(r.test, r.notes || "No notes attached.") }, h("i", { class: "fa-solid fa-eye" }), " View")),
        ])) :
      h("tr", {}, h("td", { colSpan: 6 }, h("div", { style: { padding: "24px" } }, h("mn-empty", { icon: "vial-circle-check", title: "No lab reports yet", text: "Your test results will appear here." })))),
    )])),
  ]);

  return h("div", { class: "anim-fade-up" }, [
    h("div", { class: "page-header" }, [
      h("h1", { style: { margin: 0, fontSize: "26px" } }, "Lab Reports"),
      h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, `${reports.length} report(s)`),
    ]),
    h("div", { style: { marginTop: "16px" } }, rows),
  ]);
}

export const route = { path: "/reports", title: "Lab Reports", layout: "user", auth: true, view };

export default { view, route };
