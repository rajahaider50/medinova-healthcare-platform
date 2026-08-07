/**
 * MediNova — View: About.
 */

import { h } from "../../utils/html.js";
import * as Content from "../../services/ContentService.js";
import { prosePage } from "./static.js";

export async function view() {
  const about = Content.getPage("about");
  return prosePage({
    title: about.heading || about.title || "About MediNova",
    lead: about.subtitle || about.body || "",
    sections: [
      {
        heading: "Who we are",
        body: [about.body || "MediNova connects patients with verified doctors and licensed pharmacies through a modern, secure platform."],
      },
      {
        heading: "Our mission",
        body: [about.mission || "To make quality healthcare simple, secure, and accessible for everyone."],
      },
      {
        heading: "Our vision",
        body: [about.vision || "A healthier world powered by connected, trusted care."],
      },
    ],
  });
}

export const route = { path: "/about", title: "About MediNova", layout: "public", view };

export default { view, route };
