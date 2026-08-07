/**
 * MediNova — View: Privacy policy.
 */

import { prosePage } from "./static.js";

export async function view() {
  return prosePage({
    title: "Privacy Policy",
    lead: "Last updated: August 2026. Your privacy matters to us.",
    sections: [
      {
        heading: "1. Information we collect",
        body: [
          "When you use MediNova, we collect the information you provide — such as your name, email, phone number, and health details you choose to share — as well as basic usage data like pages visited and appointment history.",
        ],
      },
      {
        heading: "2. How we use your information",
        body: [
          "We use your information to provide healthcare services: booking appointments, processing pharmacy orders, storing medical records you upload, sending reminders, and improving our platform.",
          "We never sell your personal data to third parties.",
        ],
      },
      {
        heading: "3. Data security",
        body: [
          "Medical information is sensitive. We follow strict privacy practices, keep sensitive records separate from public content, and never expose private health data in public views.",
        ],
      },
      {
        heading: "4. Your rights",
        body: [
          "You can request a copy of your data, ask us to correct inaccuracies, or delete your account at any time by contacting support.",
        ],
      },
    ],
  });
}

export const route = { path: "/privacy", title: "Privacy Policy", layout: "public", view };

export default { view, route };
