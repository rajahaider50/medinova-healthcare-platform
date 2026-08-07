/**
 * MediNova — View: Terms of service.
 */

import { prosePage } from "./static.js";

export async function view() {
  return prosePage({
    title: "Terms of Service",
    lead: "Please read these terms carefully before using MediNova.",
    sections: [
      {
        heading: "1. Acceptance of terms",
        body: [
          "By creating an account or using MediNova, you agree to these terms. If you do not agree, please do not use the platform.",
        ],
      },
      {
        heading: "2. Use of the service",
        body: [
          "MediNova provides appointment booking, online consultations, and pharmacy ordering. Services are provided 'as is' and healthcare advice always comes from qualified professionals — not from the platform itself.",
        ],
      },
      {
        heading: "3. User responsibilities",
        body: [
          "You agree to provide accurate information, keep your credentials secure, and not misuse the platform or attempt to access data that is not yours.",
        ],
      },
      {
        heading: "4. Limitations",
        body: [
          "In emergencies, always contact local emergency services. MediNova is not a substitute for urgent medical care.",
        ],
      },
    ],
  });
}

export const route = { path: "/terms", title: "Terms of Service", layout: "public", view };

export default { view, route };
