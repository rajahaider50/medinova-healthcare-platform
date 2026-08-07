/**
 * MediNova — View: About.
 */

import { h } from "../../utils/html.js";
import { cms } from "../../data/mock/cms.js";
import { prosePage } from "./static.js";

export async function view() {
  const about = cms.about;
  return prosePage({
    title: about.title,
    lead: about.text,
    sections: [
      {
        heading: "Our mission",
        body: [
          "MediNova exists to make quality healthcare accessible to everyone. We connect patients with verified doctors, licensed pharmacies, and reliable labs through one seamless platform.",
          "We believe healthcare should be simple, transparent, and secure — so you can focus on getting better, not on paperwork.",
        ],
      },
      {
        heading: "Our values",
        body: [
          "Trust: every doctor and pharmacist on MediNova is verified and licensed. Privacy: your medical data belongs to you. Care: our team is here for you around the clock.",
        ],
      },
    ],
  });
}

export const route = { path: "/about", title: "About MediNova", layout: "public", view };

export default { view, route };
