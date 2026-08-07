/**
 * MediNova — Static public page factory.
 * Builds simple prose pages from content (about/contact/privacy/terms).
 */

import { h } from "../../utils/html.js";
import * as Brand from "../../services/BrandService.js";

export function prosePage({ title, lead, sections = [] }) {
  const brand = Brand.getBrand();
  return h("div", { class: "anim-fade-up", style: { maxWidth: "760px", margin: "0 auto", padding: "24px 0" } }, [
    h("h1", { style: { fontSize: "30px", margin: "0 0 8px" } }, title),
    lead ? h("p", { style: { color: "var(--text-secondary)", margin: "0 0 24px" } }, lead) : null,
    sections.map((sec) =>
      h("section", { style: { marginBottom: "24px" } }, [
        sec.heading ? h("h2", { style: { fontSize: "18px", margin: "0 0 8px" } }, sec.heading) : null,
        Array.isArray(sec.body) ? sec.body.map((para) => h("p", { style: { color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 12px" } }, para)) : null,
      ])),
    h("div", { class: "divider", style: { margin: "24px 0" } }),
    h("p", { style: { color: "var(--text-muted)", fontSize: "13px" } }, `Questions? Contact ${brand.supportEmail} or call ${brand.supportPhone}.`),
  ]);
}

export default { prosePage };
