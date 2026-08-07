/**
 * MediNova — View: Find Doctors (directory).
 */

import { h } from "../../utils/html.js";
import * as Store from "../../state/store.js";
import { doctors, specialties } from "../../data/mock/doctors.js";
import { money, truncate } from "../../utils/format.js";
import { debounce } from "../../utils/debounce.js";
import { navigate } from "../../router/Router.js";

function doctorCard(d) {
  return h("a", { class: "mn-panel glass glass-hover", href: `#/doctors/${d.slug}`, style: { textDecoration: "none", color: "inherit", display: "block" } }, [
    h("div", { style: { display: "flex", gap: "14px", alignItems: "flex-start" } }, [
      h("span", { class: "avatar avatar-xl" }, h("span", {}, d.name.replace("Dr. ", "").split(" ").map((p) => p[0]).slice(0, 2).join(""))),
      h("div", { style: { flex: 1, minWidth: 0 } }, [
        h("div", { style: { display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" } }, [
          h("span", { style: { fontWeight: 700, fontSize: "16px" } }, d.name),
          d.verified ? h("span", { class: "badge badge-success" }, h("i", { class: "fa-solid fa-circle-check" }), " Verified") : null,
          d.onlineConsultation ? h("span", { class: "badge badge-info" }, h("i", { class: "fa-solid fa-video" }), " Online") : null,
        ]),
        h("div", { style: { color: "var(--color-primary)", fontSize: "13px", fontWeight: 600, margin: "4px 0" } }, d.specialty),
        h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, h("i", { class: "fa-solid fa-location-dot" }), ` ${d.location}`),
        h("div", { style: { color: "var(--text-muted)", fontSize: "12px" } }, h("i", { class: "fa-solid fa-hospital" }), ` ${d.hospital}`),
      ]),
    ]),
    h("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginTop: "14px" } }, [
      h("span", { class: "rating" }, h("i", { class: "fa-solid fa-star" }), h("span", { class: "rating-value" }, d.rating)),
      h("span", { class: "rating-count" }, `(${d.reviews} reviews)`),
      h("span", { class: "ml-auto", style: { fontWeight: 700, color: "var(--color-primary)" } }, money(d.fee - d.discount)),
      h("span", { style: { fontSize: "11px", color: "var(--text-muted)" } }, "/ visit"),
    ]),
    h("div", { style: { marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" } },
      d.services.slice(0, 3).map((s) => h("span", { class: "chip chip-filter", style: { pointerEvents: "none" } }, s))),
  ]);
}

export async function view() {
  const filters = {
    specialty: Store.get("route")?.query?.specialty || "",
    search: Store.get("route")?.query?.search || "",
  };

  const searchInput = h("input", {
    class: "input",
    type: "search",
    placeholder: "Search by name or specialty...",
    value: filters.search,
    "aria-label": "Search doctors",
  });

  const specialtySelect = h("select", { class: "select", "aria-label": "Filter by specialty" }, [
    h("option", { value: "" }, "All specialties"),
    ...specialties.map((s) => h("option", { value: s, selected: s === filters.specialty ? "selected" : null }, s)),
  ]);

  const list = h("div", { class: "grid grid-auto" });

  const render = debounce(() => {
    const q = (searchInput.value || "").trim().toLowerCase();
    const spec = specialtySelect.value;
    const filtered = doctors.filter((d) => {
      const matchesQ = !q || d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q);
      const matchesSpec = !spec || d.specialty === spec;
      return matchesQ && matchesSpec;
    });
    list.replaceChildren(
      filtered.length
        ? filtered.map(doctorCard)
        : h("div", { class: "span-full" }, h("mn-empty", { icon: "user-doctor", title: "No doctors found", text: "Try a different search or filter." })),
    );
  }, 200);

  searchInput.addEventListener("input", render);
  specialtySelect.addEventListener("change", render);

  render();

  return h("div", { class: "anim-fade-up" }, [
    h("div", { class: "page-header flex items-center justify-between flex-wrap gap-3" }, [
      h("div", {}, [
        h("h1", { style: { margin: 0, fontSize: "26px" } }, "Find Doctors"),
        h("p", { style: { color: "var(--text-muted)", margin: "4px 0 0" } }, `${doctors.length} verified specialists ready to help`),
      ]),
    ]),
    h("div", { class: "filter-bar", style: { display: "flex", gap: "12px", flexWrap: "wrap", margin: "16px 0" } }, [
      h("div", { class: "search-box", style: { flex: "1", minWidth: "220px", position: "relative" } }, [
        h("i", { class: "fa-solid fa-magnifying-glass", style: { position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" } }),
        searchInput,
      ]),
      specialtySelect,
    ]),
    list,
  ]);
}

export const route = { path: "/doctors", title: "Find Doctors", layout: "user", auth: true, view };

export default { view, route };
