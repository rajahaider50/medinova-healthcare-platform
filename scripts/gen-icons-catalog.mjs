/**
 * MediNova — Icon catalog generator.
 * Single source of truth for the project icon library. Emits:
 *   Icons/SVG/<name>.svg      (standalone 24x24 stroke SVGs)
 *   Icons/HTML/<name>.html    (reusable HTML snippets)
 *   Icons/index.json          (manifest)
 *   Icons/README.md
 *
 * Usage: node scripts/gen-icons-catalog.mjs
 */

import { writeFileSync, mkdirSync, rmSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svgDir = join(root, "Icons", "SVG");
const htmlDir = join(root, "Icons", "HTML");
mkdirSync(svgDir, { recursive: true });
mkdirSync(htmlDir, { recursive: true });

const STROKE = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
const svgWrap = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ${STROKE} aria-hidden="true">\n${inner}\n</svg>`;

// ---------------------------------------------------------------------------
// Icon definitions: name -> { category, d: [inner svg markup] }
// 24x24 grid coordinates. Simple recognizable stroke shapes.
// ---------------------------------------------------------------------------
const I = {
  // ---------- navigation ----------
  home: { c: "navigation", d: [`<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/>`] },
  dashboard: { c: "navigation", d: [`<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>`] },
  menu: { c: "navigation", d: [`<path d="M4 7h16M4 12h16M4 17h16"/>`] },
  "menu-grid": { c: "navigation", d: [`<circle cx="5" cy="5" r="1.8"/><circle cx="12" cy="5" r="1.8"/><circle cx="19" cy="5" r="1.8"/><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/><circle cx="5" cy="19" r="1.8"/><circle cx="12" cy="19" r="1.8"/><circle cx="19" cy="19" r="1.8"/>`] },
  "chevron-left": { c: "navigation", d: [`<path d="m14.5 6-6 6 6 6"/>`] },
  "chevron-right": { c: "navigation", d: [`<path d="m9.5 6 6 6-6 6"/>`] },
  "chevron-up": { c: "navigation", d: [`<path d="m6 14.5 6-6 6 6"/>`] },
  "chevron-down": { c: "navigation", d: [`<path d="m6 9.5 6 6 6-6"/>`] },
  "arrow-left": { c: "navigation", d: [`<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>`] },
  "arrow-right": { c: "navigation", d: [`<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>`] },
  "arrow-up": { c: "navigation", d: [`<path d="M12 19V5"/><path d="m6 11 6-6 6 6"/>`] },
  "arrow-down": { c: "navigation", d: [`<path d="M12 5v14"/><path d="m6 13 6 6 6-6"/>`] },
  "arrow-up-right": { c: "navigation", d: [`<path d="M7 17 17 7"/><path d="M9 7h8v8"/>`] },
  close: { c: "navigation", d: [`<path d="M6 6l12 12M18 6 6 18"/>`] },
  plus: { c: "navigation", d: [`<path d="M12 5v14M5 12h14"/>`] },
  minus: { c: "navigation", d: [`<path d="M5 12h14"/>`] },
  "more-horizontal": { c: "navigation", d: [`<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>`] },
  "more-vertical": { c: "navigation", d: [`<circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/>`] },
  back: { c: "navigation", d: [`<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>`] },
  forward: { c: "navigation", d: [`<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>`] },

  // ---------- health ----------
  "plus-cross": { c: "health", d: [`<path d="M12 3v18M3 12h18"/>`] },
  "heart-pulse": { c: "health", d: [`<path d="M12 20.5C7 16 3 12.8 3 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 9 2.8c0 4-4 7.2-9 11.7Z"/><path d="M3.5 12h3l1.8-3 2.6 5 1.9-3.5h3.6"/>`] },
  stethoscope: { c: "health", d: [`<path d="M5 3v6a5 5 0 0 0 10 0V3"/><path d="M10 3v9.5"/><path d="M3 3h4M6 3v6.5a4.2 4.2 0 0 0 8.4 0"/><path d="M18 11a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm0 5v2.5a3 3 0 0 1-3 3h-1"/>`] },
  syringe: { c: "health", d: [`<path d="m14 5 5 5M16 3l5 5"/><path d="m3.5 15 9.5-9.5 2.5 2.5-9.5 9.5-3 1Z"/><path d="m10 8 6 6"/>`] },
  "first-aid": { c: "health", d: [`<rect x="4" y="7" width="16" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M12 11v5M9.5 13.5h5"/>`] },
  pill: { c: "health", d: [`<path d="m7.5 16.5 9-9a3.2 3.2 0 0 1 4.5 4.5l-9 9a3.2 3.2 0 0 1-4.5-4.5Z"/><path d="m7.5 16.5 6-6"/>`] },
  capsule: { c: "health", d: [`<path d="M8.5 15.5A4.8 4.8 0 0 1 15.5 8.5l.9.9a4.8 4.8 0 0 1-7 7Z"/><path d="m15.5 8.5 5.5 5.5a4.8 4.8 0 0 1-6.8 6.8L8.7 15.3A4.8 4.8 0 0 1 15.5 8.5Z"/>`] },
  dna: { c: "health", d: [`<path d="M7 3c4 2.5 4 8 0 10.5S3 19.5 7 22"/><path d="M17 3c-4 2.5-4 8 0 10.5s4 6 0 8.5"/><path d="M7 7h8M7 17h8M7 12h10"/>`] },
  heartbeat: { c: "health", d: [`<path d="M12 20.5C7 16 3 12.8 3 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 9 2.8c0 4-4 7.2-9 11.7Z"/><path d="M7.5 12h2.4l1.6-2.8 2 4.6 1.4-1.8H16.5"/>`] },
  bone: { c: "health", d: [`<path d="M17 10a3.2 3.2 0 0 1-3-3 3.2 3.2 0 0 1 3-3.2A3.2 3.2 0 0 1 17 10Zm-2-2a3.2 3.2 0 0 1 3-3.2M7 10a3.2 3.2 0 0 0 3-3M12 12a3.2 3.2 0 0 1-3-3 3.2 3.2 0 0 1 3-3"/>`] },
  brain: { c: "health", d: [`<path d="M9.5 3A3 3 0 0 1 12 5.5V9a2 2 0 0 1-4 0V5.5A3 3 0 0 1 9.5 3Z"/><path d="M12 5.5A3 3 0 0 1 14.5 3 3 3 0 0 1 17 5.5V9a2 2 0 0 1-4 0V5.5ZM9.5 21A3 3 0 0 1 7 18.5V15a2 2 0 0 1 4 0v3.5A3 3 0 0 1 9.5 21Zm0-6V9M14.5 21A3 3 0 0 0 17 18.5V15a2 2 0 0 0-4 0v3.5A3 3 0 0 0 14.5 21Zm0-6V9M12 12v.01"/>`] },
  "eye-check": { c: "health", d: [`<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/><path d="m9.5 12 1.8 1.8 3.5-3.6"/>`] },
  teeth: { c: "health", d: [`<path d="M8 4c1.5 0 2.5 1 3 2 .5-1 1.5-2 3-2 1.5 0 2.5 1.3 2.5 3 0 3.5-2 6.5-2 9 0 2-1 3-1.5 3s-1-1-1-3c-.5 2-1.5 3-2 3s-1.5-1-1.5-3c0-2.5-2-5.5-2-9 0-1.7 1-3 2.5-3Z"/>`] },
  baby: { c: "health", d: [`<circle cx="12" cy="7" r="3"/><path d="M8.5 11a3.5 3.5 0 0 0 7 0M9 15c-2 1-2 4 3 4s5-3 3-4"/>`] },
  wheelchair: { c: "health", d: [`<circle cx="15" cy="4.5" r="2"/><path d="M8 8a4 4 0 1 0 4 7l2-2.5h4.5V10H13.5L12 12"/><path d="M6 12.5V21"/>`] },
  "x-ray": { c: "health", d: [`<path d="M9 3h6M10 3v4.5a3 3 0 0 0 4 2.8 3 3 0 0 1 0 5.4 3 3 0 0 0-4 2.8V21M12 10v4M10 12h4M9 12v.01M15 12v.01"/>`] },
  scan: { c: "health", d: [`<path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M12 8v8M8 12h8"/>`] },
  virus: { c: "health", d: [`<circle cx="12" cy="12" r="4.5"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8"/>`] },
  "blood-drop": { c: "health", d: [`<path d="M12 3.5s5.5 6 5.5 10.2A5.5 5.5 0 0 1 12 19a5.5 5.5 0 0 1-5.5-5.3C6.5 9.5 12 3.5 12 3.5Z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>`] },
  temperature: { c: "health", d: [`<path d="M12 3a2.5 2.5 0 0 0-2.5 2.5v7.4a4 4 0 1 0 5 0V5.5A2.5 2.5 0 0 0 12 3Z"/><path d="M12 14.5v4"/>`] },
  bandage: { c: "health", d: [`<rect x="2.5" y="14" width="9" height="9" rx="2" transform="rotate(-45 7 18.5)"/><path d="m9.5 5.5 9 9M7 8l9 9M5 6l2 2M15 16l2 2M11 12v.01"/>`] },
  "clipboard-pulse": { c: "health", d: [`<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4a3 3 0 0 1 6 0M8.5 13.5h2l1.5-3 2 4.5 1.5-1.5h2"/>`] },
  "shield-cross": { c: "health", d: [`<path d="M12 3 5 5.5v5.3c0 4.4 3 7.6 7 9.2 4-1.6 7-4.8 7-9.2V5.5Z"/><path d="M12 8.5v6M9 11.5h6"/>`] },
  "star-of-life": { c: "health", d: [`<path d="M12 3v18M3 7.5v9L21 7.5v9Z"/>`] },

  // ---------- doctors / patients ----------
  doctor: { c: "doctors", d: [`<circle cx="9" cy="7.5" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16.5 7.5h4M18.5 5.5v4"/>`] },
  user: { c: "doctors", d: [`<circle cx="12" cy="7.5" r="3.5"/><path d="M4 20a8 8 0 0 1 16 0"/>`] },
  "user-plus": { c: "doctors", d: [`<circle cx="9" cy="7.5" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M18 9v6M15 12h6"/>`] },
  "user-minus": { c: "doctors", d: [`<circle cx="9" cy="7.5" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M18 12h6"/>`] },
  users: { c: "doctors", d: [`<circle cx="9" cy="8" r="3"/><path d="M2.5 19.5a6.5 6.5 0 0 1 13 0"/><path d="M16 5.2a3 3 0 0 1 0 5.6M17.5 13.5a6.5 6.5 0 0 1 4 6"/>`] },
  "user-doctor": { c: "doctors", d: [`<circle cx="9" cy="8" r="3"/><path d="M2.5 19.5a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="3"/><path d="M16.5 13h2"/>`] },
  "user-nurse": { c: "doctors", d: [`<circle cx="9" cy="8" r="3"/><path d="M2.5 19.5a6.5 6.5 0 0 1 13 0"/><path d="M16 7.5 20 5l4 2.5M20 5v6"/>`] },
  avatar: { c: "doctors", d: [`<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="9.5" r="3"/><path d="M5.5 19a7 7 0 0 1 13 0"/>`] },
  patient: { c: "doctors", d: [`<circle cx="9" cy="8" r="3"/><path d="M2.5 19.5a6.5 6.5 0 0 1 13 0"/><path d="M16.5 7.5h4M18.5 5.5v4"/>`] },
  gender: { c: "doctors", d: [`<circle cx="8" cy="8" r="4"/><path d="M8 12v8M5.5 14.5h5"/><circle cx="16.5" cy="16.5" r="3.5"/><path d="M16.5 13v-6l2-2h-4"/>`] },
  "id-badge": { c: "doctors", d: [`<rect x="5" y="3" width="14" height="18" rx="2.5"/><circle cx="12" cy="9" r="2.5"/><path d="M8.5 16.5a3.5 3.5 0 0 1 7 0"/>`] },
  "user-check": { c: "doctors", d: [`<circle cx="9" cy="7.5" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="m16.5 13 2 2 3.5-3.5"/>`] },
  "edit": { c: "files", d: [`<path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17Z"/><path d="m13.5 6.5 3 3"/>`] },
  pen: { c: "files", d: [`<path d="m4 20 1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19Z"/><path d="m13.5 6.5 3 3"/>`] },
  trash: { c: "files", d: [`<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13"/><path d="M10 11v5M14 11v5"/>`] },
  "alert": { c: "status", d: [`<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v4.5M12 16h.01"/>`] },
  info: { c: "status", d: [`<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>`] },

  // ---------- medicines / pharmacy ----------
  pills: { c: "pharmacy", d: [`<rect x="3" y="7.5" width="8" height="12" rx="4"/><rect x="13" y="4.5" width="8" height="12" rx="4"/><path d="M7 10.5v6M17 7.5v6"/>`] },
  "medicine-bottle": { c: "pharmacy", d: [`<path d="M9 3h6M9.5 3v2.5L8 8a3 3 0 0 0-.5 1.7V20a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V9.7A3 3 0 0 0 16 8l-1.5-2.5V3"/><path d="M9 13.5h6"/>`] },
  "mortar-pestle": { c: "pharmacy", d: [`<path d="M3 11h12v4.5A4.5 4.5 0 0 1 6 15.5V11"/><path d="M6 7.5 3 11M8 7.5 15 11"/><path d="M17 5l3 3-4 4-3-3Z"/>`] },
  prescription: { c: "pharmacy", d: [`<path d="M7 3h7a3 3 0 0 1 0 6H7Z"/><path d="M7 9h8a3 3 0 0 1 0 6H7v6"/>`] },
  rx: { c: "pharmacy", d: [`<path d="M8 4v7M8 10c2 0 4 0 4-3S10 4 8 4M8 11v9M8 13l6 6M14 13l-6 6"/>`] },
  "pharmacy-cross": { c: "pharmacy", d: [`<rect x="3.5" y="6" width="17" height="14" rx="2"/><path d="M12 9v8M8 13h8"/>`] },
  "shopping-bag": { c: "pharmacy", d: [`<path d="M5 7h14l-1 13H6Z"/><path d="M8.5 7V6a3.5 3.5 0 0 1 7 0v1"/>`] },
  cart: { c: "pharmacy", d: [`<circle cx="9" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/><path d="M3 4h2l2.4 11.5h9.8L20 7H6"/>`] },
  "cart-plus": { c: "pharmacy", d: [`<circle cx="9" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/><path d="M3 4h2l2.4 11.5h9.8L20 7H6"/><path d="M12 9v5M9.5 11.5h5"/>`] },
  truck: { c: "pharmacy", d: [`<path d="M3 6h11v10H3z"/><path d="M14 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>`] },
  package: { c: "pharmacy", d: [`<path d="m12 3 8 4v10l-8 4-8-4V7Z"/><path d="m4 7 8 4 8-4M12 11v10"/>`] },
  "box-open": { c: "pharmacy", d: [`<path d="M3 8 6 5h12l3 3-3 3H6Z"/><path d="M4.5 9.5V20h15V9.5"/><path d="M10 13h4"/>`] },
  warehouse: { c: "pharmacy", d: [`<path d="M3 20V9l9-5 9 5v11"/><path d="M3 20h18M7 20v-6h10v6"/><path d="M7 11h.01M10 11h.01M13 11h.01"/>`] },
  shelf: { c: "pharmacy", d: [`<path d="M3 4h18v16H3z"/><path d="M3 12h18M9 8v8M15 8v8"/>`] },
  barcode: { c: "pharmacy", d: [`<path d="M4 8v8M8 8v8M11 8v8M15 8v8M19 8v8M7 8v8"/>`] },
  tags: { c: "pharmacy", d: [`<path d="m3 11 8-8 10 10-8 8Z"/><path d="m7 7 4-4"/><circle cx="9.5" cy="6.5" r="1"/>`] },
  tag: { c: "pharmacy", d: [`<path d="m3.5 12 8-8H19v7.5l-8 8Z"/><circle cx="15.5" cy="8.5" r="1.4"/>`] },
  coupon: { c: "pharmacy", d: [`<path d="M3 8h18v8H3z"/><path d="M7 10v4M11 10v4M15 12h.01"/>`] },
  discount: { c: "pharmacy", d: [`<path d="m9 15 6-6"/><circle cx="9" cy="9" r="2"/><circle cx="15" cy="15" r="2"/>`] },

  // ---------- appointments / calendar ----------
  calendar: { c: "calendar", d: [`<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17"/>`] },
  "calendar-plus": { c: "calendar", d: [`<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17M12 13v5M9.5 15.5h5"/>`] },
  "calendar-check": { c: "calendar", d: [`<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17"/><path d="m9 15.5 2 2 4-4"/>`] },
  "calendar-xmark": { c: "calendar", d: [`<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17"/><path d="m10 14.5 4 4M14 14.5l-4 4"/>`] },
  "calendar-clock": { c: "calendar", d: [`<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17"/><circle cx="17" cy="16.5" r="2.5"/><path d="M17 15.2v1.3l.9.9"/>`] },
  clock: { c: "calendar", d: [`<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>`] },
  hourglass: { c: "calendar", d: [`<path d="M6 3h12M6 21h12M7 3c0 4 2 5.5 5 8-3 2.5-5 4-5 10M17 3c0 4-2 5.5-5 8 3 2.5 5 4 5 10"/>`] },
  alarm: { c: "calendar", d: [`<circle cx="12" cy="13" r="6.5"/><path d="M12 10v3l2 1.5M5 5l-2 2M19 5l2 2M12 3V2M12 24h.01"/>`] },
  timer: { c: "calendar", d: [`<circle cx="12" cy="13" r="7"/><path d="M12 10v3l2 1.5M9 3h6M12 6V3"/>`] },
  schedule: { c: "calendar", d: [`<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17M12 14h.01M12 17h.01"/>`] },
  "location-pin": { c: "calendar", d: [`<path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>`] },
  "map-pin": { c: "calendar", d: [`<path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><path d="M9.5 10a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z"/>`] },
  compass: { c: "calendar", d: [`<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/>`] },
  navigation: { c: "calendar", d: [`<path d="M4 10.5 20 4l-6.5 16-2.5-7.5Z"/>`] },

  // ---------- records / files ----------
  file: { c: "files", d: [`<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4"/>`] },
  "file-text": { c: "files", d: [`<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 16h6"/>`] },
  "file-plus": { c: "files", d: [`<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4M12 11v6M9 14h6"/>`] },
  "file-check": { c: "files", d: [`<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4"/><path d="m9.5 14.5 1.8 1.8 3.5-3.6"/>`] },
  "file-search": { c: "files", d: [`<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4"/><circle cx="11" cy="14.5" r="2.5"/><path d="m13 16.5 2 2"/>`] },
  folder: { c: "files", d: [`<path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>`] },
  "folder-open": { c: "files", d: [`<path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h6a2 2 0 0 1 2 2V10H5a2 2 0 0 0-2 2Z"/><path d="m5 13 1.5 6h13l1-6"/>`] },
  clipboard: { c: "files", d: [`<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4a3 3 0 0 1 6 0"/>`] },
  "clipboard-check": { c: "files", d: [`<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4a3 3 0 0 1 6 0"/><path d="m9.5 14 2 2 3.5-3.5"/>`] },
  "clipboard-list": { c: "files", d: [`<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4a3 3 0 0 1 6 0"/><path d="M9 11h.01M9 15h.01M13 11h3M13 15h3"/>`] },
  notes: { c: "files", d: [`<path d="M5 4h14v14l-4 4H5Z"/><path d="M15 21v-3h4M9 9h6M9 13h6"/>`] },
  document: { c: "files", d: [`<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4"/><path d="M9 13h6M9 17h6"/>`] },
  archive: { c: "files", d: [`<rect x="3" y="4" width="18" height="5" rx="1.5"/><path d="M5 9v11h14V9"/><path d="M10 13h4"/>`] },
  list: { c: "files", d: [`<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>`] },
  "list-check": { c: "files", d: [`<path d="M8 6h13M8 12h13M8 18h13"/><path d="m3.5 6 .8.8 1.5-1.5M3.5 12l.8.8 1.5-1.5M3.5 18l.8.8 1.5-1.5"/>`] },
  receipt: { c: "files", d: [`<path d="M6 3h12v18l-3-1.5-3 1.5-3-1.5L6 21Z"/><path d="M9 8h6M9 12h6"/>`] },
  download: { c: "files", d: [`<path d="M12 4v10"/><path d="m7 10 5 5 5-5"/><path d="M4 20h16"/>`] },
  upload: { c: "files", d: [`<path d="M12 14V4"/><path d="m7 9 5-5 5 5"/><path d="M4 20h16"/>`] },
  save: { c: "files", d: [`<path d="M5 3h11l5 5v13H5Z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/>`] },
  print: { c: "files", d: [`<path d="M7 8V3h10v5"/><rect x="4" y="8" width="16" height="8" rx="2"/><path d="M7 14h10v7H7z"/>`] },
  share: { c: "files", d: [`<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/>`] },
  link: { c: "files", d: [`<path d="M9.5 14.5 14.5 9.5"/><path d="M11 5.5 13 3.5a4 4 0 0 1 5.7 5.7l-2 2M13 18.5l-2 2a4 4 0 0 1-5.7-5.7l2-2"/>`] },
  copy: { c: "files", d: [`<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>`] },

  // ---------- payments ----------
  "credit-card": { c: "payments", d: [`<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>`] },
  wallet: { c: "payments", d: [`<path d="M4 6a2 2 0 0 1 2-2h12v3H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14V7H5"/><circle cx="16.5" cy="13.5" r="1.2"/>`] },
  bank: { c: "payments", d: [`<path d="m3 9 9-5 9 5"/><path d="M5 9v8M9.5 9v8M14.5 9v8M19 9v8"/><path d="M3 20h18M3 20v-1M21 20v-1"/>`] },
  money: { c: "payments", d: [`<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6.5 9.5h.01M17.5 14.5h.01"/>`] },
  cash: { c: "payments", d: [`<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6.5 9.5h.01M17.5 14.5h.01M6.5 14.5h.01M17.5 9.5h.01"/>`] },
  "receipt-check": { c: "payments", d: [`<path d="M6 3h12v18l-3-1.5-3 1.5-3-1.5L6 21Z"/><path d="m9.5 12 1.8 1.8 3.5-3.6"/>`] },
  payment: { c: "payments", d: [`<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M6.5 15h3.5"/>`] },
  invoice: { c: "payments", d: [`<path d="M5 3h14v18l-3-2-3 2-3-2-3 2-2-2Z"/><path d="M9 8h6M9 12h6"/>`] },
  coin: { c: "payments", d: [`<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v9M14.5 10c-.5-1-1.5-1.5-2.5-1.5S9.5 9.3 9.5 10.5 11 11.8 12 12s2.5.8 2.5 2-1.5 2-2.5 2-2-.5-2.5-1.5"/>`] },
  percent: { c: "payments", d: [`<path d="m19 5-14 14"/><circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>`] },
  banknote: { c: "payments", d: [`<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6.5 9.5h.01M17.5 14.5h.01"/>`] },

  // ---------- messages / notifications ----------
  mail: { c: "messages", d: [`<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>`] },
  "mail-open": { c: "messages", d: [`<path d="m3 9 9-6 9 6v11H3Z"/><path d="m3 9 9 5 9-5"/>`] },
  send: { c: "messages", d: [`<path d="M20 4 3 12l6 2 2 6 9-16Z"/><path d="m9 14 11-10"/>`] },
  chat: { c: "messages", d: [`<path d="M4 5h16v11H9l-5 4Z"/>`] },
  "chat-bubble": { c: "messages", d: [`<path d="M4 5h16v10H9.5L5 19v-4H4Z"/>`] },
  "message-circle": { c: "messages", d: [`<path d="M21 11.5a8.5 8.5 0 0 1-12.5 7.5L4 20l1-4.5A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"/>`] },
  bell: { c: "messages", d: [`<path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6"/><path d="M10 19a2 2 0 0 0 4 0"/>`] },
  "bell-ring": { c: "messages", d: [`<path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6"/><path d="M10 19a2 2 0 0 0 4 0M3.5 5.5a7 7 0 0 1 3-2.7M20.5 5.5a7 7 0 0 0-3-2.7"/>`] },
  "bell-slash": { c: "messages", d: [`<path d="M18 9a6 6 0 0 0-9.4-4.9M13.7 20a2 2 0 0 1-3.4 0M4 4l16 16M18 9c0 5 2 6 2 6H8"/>`] },
  notification: { c: "messages", d: [`<path d="M6 8.5a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 19a2 2 0 0 0 4 0"/>`] },
  comment: { c: "messages", d: [`<path d="M4 5h16v10H9.5L5 19v-4H4Z"/><path d="M8 9h8M8 12h5"/>`] },

  // ---------- search / filters ----------
  search: { c: "search", d: [`<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/>`] },
  filter: { c: "search", d: [`<path d="M4 6h16M7 12h10M10 18h4"/>`] },
  "filter-sliders": { c: "search", d: [`<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="9" cy="18" r="2"/>`] },
  sliders: { c: "search", d: [`<path d="M4 7h16M4 12h16M4 17h16"/><circle cx="9" cy="7" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="9" cy="17" r="2"/>`] },
  sort: { c: "search", d: [`<path d="m8 4-4 4h8ZM8 20l4-4M8 20V4M12 4v16M16 8h4M18 6l-2 2 2 2M16 16h4M18 14l-2 2 2 2"/>`] },
  "sort-desc": { c: "search", d: [`<path d="M4 6h9M4 11h6M4 16h3M13 15l3 3 3-3M16 18V6"/>`] },
  "sort-asc": { c: "search", d: [`<path d="M4 6h9M4 11h6M4 16h3M16 9l3-3 3 3M16 6v12"/>`] },
  eye: { c: "search", d: [`<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>`] },
  "eye-off": { c: "search", d: [`<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/><path d="m4 4 16 16"/>`] },
  "scan-search": { c: "search", d: [`<path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/><circle cx="12" cy="12" r="3.5"/><path d="m14.5 14.5 2 2"/>`] },

  // ---------- security ----------
  lock: { c: "security", d: [`<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>`] },
  "lock-open": { c: "security", d: [`<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 7.5-1.5"/>`] },
  unlock: { c: "security", d: [`<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 7.5-1.5"/><path d="M12 14.5v3"/>`] },
  shield: { c: "security", d: [`<path d="M12 3 5 5.5v5.3c0 4.4 3 7.6 7 9.2 4-1.6 7-4.8 7-9.2V5.5Z"/>`] },
  "shield-check": { c: "security", d: [`<path d="M12 3 5 5.5v5.3c0 4.4 3 7.6 7 9.2 4-1.6 7-4.8 7-9.2V5.5Z"/><path d="m9 12 2 2 4-4"/>`] },
  "shield-xmark": { c: "security", d: [`<path d="M12 3 5 5.5v5.3c0 4.4 3 7.6 7 9.2 4-1.6 7-4.8 7-9.2V5.5Z"/><path d="m10 10 4 4M14 10l-4 4"/>`] },
  "shield-halved": { c: "security", d: [`<path d="M12 3 5 5.5v5.3c0 4.4 3 7.6 7 9.2 4-1.6 7-4.8 7-9.2V5.5Z"/><path d="M12 3v20"/>`] },
  key: { c: "security", d: [`<circle cx="8" cy="14" r="4.5"/><path d="m11.5 10.5 8-8 2 2-2 2M17 7l2 2"/>`] },
  fingerprint: { c: "security", d: [`<path d="M5 12a7 7 0 0 1 14 0M12 12a3 3 0 0 1 3 3c0 2 .5 4-1 5M12 6.5a5.5 5.5 0 0 1 5.5 5.5M9.5 8a5.5 5.5 0 0 0-4.5 4M12 12v5.5c0 2-1.5 3.5-2.5 3.5M15.5 17c.5 1.5 1 2.5 2 3"/>`] },
  "user-shield": { c: "security", d: [`<circle cx="9" cy="8" r="3"/><path d="M2.5 19.5a6.5 6.5 0 0 1 13 0"/><path d="M16 12v5.3c0 4.4 3 7.6 7 9.2 4-1.6 7-4.8 7-9.2V12Z"/>`] },
  ban: { c: "security", d: [`<circle cx="12" cy="12" r="8.5"/><path d="m5.5 5.5 13 13"/>`] },
  "alert-octagon": { c: "security", d: [`<path d="M8 3h8l5 5v8l-5 5H8l-5-5V8Z"/><path d="M12 8v4M12 16h.01"/>`] },
  password: { c: "security", d: [`<path d="M9 5a3 3 0 1 1 0 6c-1 0-1.5-.5-2-1M9 5l3 3M6.5 8.5 9 11"/><path d="M5 17h14M5 13h.01M9 13h.01M13 13h.01M17 13h.01"/>`] },

  // ---------- system / settings ----------
  settings: { c: "system", d: [`<circle cx="12" cy="12" r="3"/><path d="M12 3.5 12.8 6c.5.2.9.4 1.3.7l2.4-1 1.4 1.4-1 2.4c.3.4.5.8.7 1.3l2.4.8v2l-2.4.8c-.2.5-.4.9-.7 1.3l1 2.4-1.4 1.4-2.4-1c-.4.3-.8.5-1.3.7l-.8 2.4h-2l-.8-2.4c-.5-.2-.9-.4-1.3-.7l-2.4 1-1.4-1.4 1-2.4c-.3-.4-.5-.8-.7-1.3l-2.4-.8v-2l2.4-.8c.2-.5.4-.9.7-1.3l-1-2.4 1.4-1.4 2.4 1c.4-.3.8-.5 1.3-.7Z"/>`] },
  gear: { c: "system", d: [`<circle cx="12" cy="12" r="3"/><path d="M12 3.5 12.8 6c.5.2.9.4 1.3.7l2.4-1 1.4 1.4-1 2.4c.3.4.5.8.7 1.3l2.4.8v2l-2.4.8c-.2.5-.4.9-.7 1.3l1 2.4-1.4 1.4-2.4-1c-.4.3-.8.5-1.3.7l-.8 2.4h-2l-.8-2.4c-.5-.2-.9-.4-1.3-.7l-2.4 1-1.4-1.4 1-2.4c-.3-.4-.5-.8-.7-1.3l-2.4-.8v-2l2.4-.8c.2-.5.4-.9.7-1.3l-1-2.4 1.4-1.4 2.4 1c.4-.3.8-.5 1.3-.7Z"/>`] },
  cog: { c: "system", d: [`<circle cx="12" cy="12" r="3.5"/><path d="M12 2.5 13 5l.5.5L16.5 4 20 7.5l-1.5 3 .5 1 2.5 1v4l-2.5 1-.5 1 1.5 3-3.5 3.5-3-1.5-1 .5-1 2.5h-4l-1-2.5-1-.5-3 1.5L4 20.5l1.5-3-.5-1-2.5-1v-4L5 11.5l.5-1L4 7.5 7.5 4l3 1.5.5-.5Z"/>`] },
  "sliders-horizontal": { c: "system", d: [`<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="9" cy="18" r="2"/>`] },
  tools: { c: "system", d: [`<path d="M14.5 6.5a3.5 3.5 0 0 1 4.8-3.3l-2.6 2.6 1.5 1.5 2.6-2.6a3.5 3.5 0 0 1-4.6 4.6L7 18.5 5.5 17Z"/><path d="M3 6.5 6.5 3l3 3L7 8.5l-4 0Z"/><path d="m14 14 4 4M8 15l-3 3 1.5 1.5L7 17"/>`] },
  wrench: { c: "system", d: [`<path d="M14.5 6.5a3.5 3.5 0 0 1 4.8-3.3l-2.6 2.6 1.5 1.5 2.6-2.6a3.5 3.5 0 0 1-4.6 4.6L7 18.5 5.5 17Z"/>`] },
  server: { c: "system", d: [`<rect x="3.5" y="3.5" width="17" height="7" rx="2"/><rect x="3.5" y="13.5" width="17" height="7" rx="2"/><path d="M7 7h.01M7 17h.01M10.5 7H17M10.5 17H17"/>`] },
  database: { c: "system", d: [`<ellipse cx="12" cy="5.5" rx="7.5" ry="2.8"/><path d="M4.5 5.5v6c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-6"/><path d="M4.5 11.5v6c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-6"/>`] },
  cpu: { c: "system", d: [`<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M9 3v2M13 3v2M17 3v2M5 9H3M5 13H3M5 17H3M9 21v-2M13 21v-2M17 21v-2M21 9h-2M21 13h-2M21 17h-2"/><path d="M10 10h4v4h-4z"/>`] },
  "hard-drive": { c: "system", d: [`<path d="M4 7h16l2 6v5H2v-5Z"/><path d="M6 15h.01M10 15h.01M2 13h20"/>`] },
  terminal: { c: "system", d: [`<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/>`] },
  code: { c: "system", d: [`<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>`] },
  bug: { c: "system", d: [`<rect x="8" y="8" width="8" height="11" rx="2.5"/><path d="M12 8V6M12 19v2M8 10H5M8 14H5M8 18H5M16 10h3M16 14h3M16 18h3M8 8 6 6M16 8l2-2M8 19l-2 2M16 19l2 2"/>`] },
  refresh: { c: "system", d: [`<path d="M4 12a8 8 0 0 1 13.7-5.7L20 8"/><path d="M20 4v4h-4"/><path d="M20 12a8 8 0 0 1-13.7 5.7L4 16"/><path d="M4 20v-4h4"/>`] },
  "refresh-cw": { c: "system", d: [`<path d="M4 12a8 8 0 0 1 8-8 8 8 0 0 1 6 2.8L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 6.2L4 15"/><path d="M4 20v-5h5"/>`] },
  spinner: { c: "system", d: [`<path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 6.5a5.5 5.5 0 1 0 5.5 5.5"/>`] },
  cloud: { c: "system", d: [`<path d="M7 18a4 4 0 0 1-.5-7.97A6 6 0 0 1 18 8.6 4.5 4.5 0 0 1 17.5 18Z"/>`] },
  "cloud-off": { c: "system", d: [`<path d="M7 18a4 4 0 0 1-.5-7.97A6 6 0 0 1 18 8.6 4.5 4.5 0 0 1 17.5 18Z"/><path d="m4 4 16 16"/>`] },
  wifi: { c: "system", d: [`<path d="M4 9.5a12 12 0 0 1 16 0M7.5 13a7 7 0 0 1 9 0M10.5 16.5a2.5 2.5 0 0 1 3 0"/><path d="M12 20h.01"/>`] },
  "wifi-off": { c: "system", d: [`<path d="M4 9.5a12 12 0 0 1 16 0M7.5 13a7 7 0 0 1 9 0M10.5 16.5a2.5 2.5 0 0 1 3 0"/><path d="M12 20h.01"/><path d="m3 3 18 18"/>`] },
  plug: { c: "system", d: [`<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0Z"/><path d="M12 14v7"/>`] },
  power: { c: "system", d: [`<path d="M12 3v9M18.5 6.5a8 8 0 1 1-13 0"/>`] },
  "toggle-on": { c: "system", d: [`<rect x="3" y="8" width="18" height="8" rx="4"/><circle cx="15" cy="12" r="2.5"/>`] },
  "toggle-off": { c: "system", d: [`<rect x="3" y="8" width="18" height="8" rx="4"/><circle cx="9" cy="12" r="2.5"/>`] },
  layers: { c: "system", d: [`<path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/>`] },
  globe: { c: "system", d: [`<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.3 2.5 14.7 0 17M12 3.5c-2.5 2.3-2.5 14.7 0 17"/>`] },
  "globe-check": { c: "system", d: [`<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.3 2.5 14.7 0 17M12 3.5c-2.5 2.3-2.5 14.7 0 17"/><path d="m9 12 2 2 4-4"/>`] },

  // ---------- status ----------
  "check-circle": { c: "status", d: [`<circle cx="12" cy="12" r="8.5"/><path d="m8.5 12 2.2 2.2 4.8-4.8"/>`] },
  "xmark-circle": { c: "status", d: [`<circle cx="12" cy="12" r="8.5"/><path d="m9.5 9.5 5 5M14.5 9.5l-5 5"/>`] },
  "info-circle": { c: "status", d: [`<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>`] },
  "alert-triangle": { c: "status", d: [`<path d="M12 4 2.5 20h19Z"/><path d="M12 10v4M12 17h.01"/>`] },
  "alert-circle": { c: "status", d: [`<circle cx="12" cy="12" r="8.5"/><path d="M12 8v4.5M12 16h.01"/>`] },
  "help-circle": { c: "status", d: [`<circle cx="12" cy="12" r="8.5"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 1-1 2.2M12 17h.01"/>`] },
  question: { c: "status", d: [`<path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 1-1 2.2M12 17h.01"/>`] },
  exclamation: { c: "status", d: [`<path d="M12 4v11M12 19h.01"/>`] },
  warning: { c: "status", d: [`<path d="M12 4 2.5 20h19Z"/><path d="M12 10v4M12 17h.01"/>`] },
  "success-check": { c: "status", d: [`<circle cx="12" cy="12" r="8.5"/><path d="m8.5 12 2.2 2.2 4.8-4.8"/>`] },
  "ban-circle": { c: "status", d: [`<circle cx="12" cy="12" r="8.5"/><path d="m5.5 5.5 13 13"/>`] },

  // ---------- admin / analytics ----------
  "chart-line": { c: "admin", d: [`<path d="M4 4v16h16"/><path d="m6 15 4-4 3 3 5-6"/>`] },
  "chart-bar": { c: "admin", d: [`<path d="M4 4v16h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>`] },
  "chart-pie": { c: "admin", d: [`<path d="M12 3a9 9 0 1 0 9 9h-9Z"/><path d="M14 3.5a7.5 7.5 0 0 1 6.5 6.5H14Z"/>`] },
  "chart-area": { c: "admin", d: [`<path d="M4 4v16h16"/><path d="m6 16 4-5 3 3 5-7 2 2v7Z"/>`] },
  "trending-up": { c: "admin", d: [`<path d="m3 16 6-6 4 4 8-8"/><path d="M15 6h6v6"/>`] },
  "trending-down": { c: "admin", d: [`<path d="m3 8 6 6 4-4 8 8"/><path d="M15 18h6v-6"/>`] },
  analytics: { c: "admin", d: [`<path d="M4 4v16h16"/><path d="M7 15l3-4 3 2 4-6"/><path d="M17 7h.01"/>`] },
  gauge: { c: "admin", d: [`<path d="M4 18a8 8 0 1 1 16 0"/><path d="m12 14 3-4"/><path d="M9.5 18a2.5 2.5 0 0 1 5 0Z"/>`] },
  activity: { c: "admin", d: [`<path d="M3 12h4l2.5-6 4 12 2.5-6h5"/>`] },
  target: { c: "admin", d: [`<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>`] },
  grid: { c: "admin", d: [`<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>`] },
  layout: { c: "admin", d: [`<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12"/>`] },
  newspaper: { c: "admin", d: [`<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M6 8h8M6 12h8M6 16h5M15 16h3M15 8h3M15 12h3"/>`] },
  monitor: { c: "admin", d: [`<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M9 20h6M12 16v4"/>`] },
  building: { c: "admin", d: [`<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01M10 21v-3h4v3"/>`] },
  hospital: { c: "admin", d: [`<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 7v6M9 10h6"/><path d="M8 21v-3h8v3"/>`] },
  clinic: { c: "admin", d: [`<path d="M4 21V8l8-5 8 5v13"/><path d="M9 21v-5h6v5M12 11v5M9.5 13.5h5"/>`] },
  "sign-in": { c: "admin", d: [`<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4"/><path d="m10 8 4 4-4 4"/><path d="M14 12H3"/>`] },
  "sign-out": { c: "admin", d: [`<path d="M9 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H9"/><path d="m14 8 4 4-4 4"/><path d="M18 12H7"/>`] },
  "external-link": { c: "admin", d: [`<path d="M14 4h6v6M20 4 10 14"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>`] },
  bookmark: { c: "admin", d: [`<path d="M6 4h12v16l-6-4-6 4Z"/>`] },
  star: { c: "admin", d: [`<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9Z"/>`] },
  "star-half": { c: "admin", d: [`<path d="M12 3.5v14.4l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9Z"/><path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7"/>`] },
  heart: { c: "admin", d: [`<path d="M12 20.5C7 16 3 12.8 3 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 9 2.8c0 4-4 7.2-9 11.7Z"/>`] },
  "thumbs-up": { c: "admin", d: [`<path d="M7 11v10H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1ZM7 11l4-8h2a2 2 0 0 1 2 2v5h4.5a2 2 0 0 1 2 2.4l-1.5 7a2 2 0 0 1-2 1.6H7"/>`] },
  flag: { c: "admin", d: [`<path d="M5 21V4"/><path d="M5 4h13l-2.5 4L18 12H5"/>`] },
  gift: { c: "admin", d: [`<rect x="3" y="8" width="18" height="4"/><path d="M5 12v8h14v-8M12 8v12"/><path d="M12 8c-1.5 0-4-1-4-3s2.5-2.5 4-.5M12 8c1.5 0 4-1 4-3s-2.5-2.5-4-.5"/>`] },
  "tag-percent": { c: "admin", d: [`<path d="m3.5 12 8-8H19v7.5l-8 8Z"/><circle cx="15.5" cy="8.5" r="1.4"/><path d="m7 7 10 10"/>`] },

  // ---------- misc ----------
  phone: { c: "misc", d: [`<path d="M5 3h4l1.5 4.5L8 9.5a12 12 0 0 0 6.5 6.5l2-2.5L21 15v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/>`] },
  smartphone: { c: "misc", d: [`<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>`] },
  tablet: { c: "misc", d: [`<rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M11 18h2"/>`] },
  laptop: { c: "misc", d: [`<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2.5 20h19M10 20h4"/>`] },
  camera: { c: "misc", d: [`<path d="M4 8h3l1.5-2h7L17 8h3v11H4Z"/><circle cx="12" cy="13" r="3.5"/>`] },
  image: { c: "misc", d: [`<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m4 17 5-4 3 2.5 3-2.5 5 4"/>`] },
  video: { c: "misc", d: [`<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3Z"/>`] },
  "video-slash": { c: "misc", d: [`<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3Z"/><path d="m3 3 18 18"/>`] },
  play: { c: "misc", d: [`<path d="M7 4.5 19 12 7 19.5Z"/>`] },
  pause: { c: "misc", d: [`<path d="M8 5v14M16 5v14"/>`] },
  microphone: { c: "misc", d: [`<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/>`] },
  volume: { c: "misc", d: [`<path d="M4 10v4h3l4 3.5v-11L7 10Z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>`] },
  headset: { c: "misc", d: [`<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/><path d="M20 19a3 3 0 0 1-3 3h-3"/>`] },
  language: { c: "misc", d: [`<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.3 2.5 14.7 0 17M12 3.5c-2.5 2.3-2.5 14.7 0 17"/><path d="M7 8.5c1 2 1.5 4 1 6.5M17 8.5c-1 2-1.5 4-1 6.5"/>`] },
  translate: { c: "misc", d: [`<path d="M4 5h7M7.5 3v2M5 9a6 6 0 0 0 6 4M11 9a9 9 0 0 1-5 5.5"/><path d="m9 20 3-7 3 7M10 17.5h4"/>`] },
  moon: { c: "misc", d: [`<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/>`] },
  sun: { c: "misc", d: [`<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>`] },
  sparkles: { c: "misc", d: [`<path d="m12 4 1.5 4.5L18 10l-4.5 1.5L12 16l-1.5-4.5L6 10l4.5-1.5Z"/><path d="M18.5 15.5.5 1.5l1 2.5L20 19.5Z"/>`] },
  palette: { c: "misc", d: [`<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2 0-1.5-1.5-2-1.5-3.5S14 12.5 15 12.5H18A3.5 3.5 0 0 0 21 9c0-3-4-6-9-6Z"/><path d="M7.5 9.5h.01M10 6.5h.01M14 6.5h.01M16.5 9.5h.01"/>`] },
  brush: { c: "misc", d: [`<path d="M13 4a2 2 0 0 1 2 2v6l5-4v9a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3v-2"/>`] },
  "paint-roller": { c: "misc", d: [`<rect x="4" y="3" width="12" height="6" rx="1.5"/><path d="M16 6h2a2 2 0 0 1 2 2v2h-5"/><rect x="10" y="10" width="6" height="10" rx="1.5"/>`] },
  anchor: { c: "misc", d: [`<circle cx="12" cy="5" r="2.5"/><path d="M12 7.5V21M5 12H3a9 9 0 0 0 18 0h-2M12 21c-2-3-2-6-2-9M12 21c2-3 2-6 2-9"/>`] },
  fire: { c: "misc", d: [`<path d="M12 3c1 3-3 4.5-3 8a3 3 0 0 0 6 0c2 1 2.5 3.5 2.5 5A5.5 5.5 0 0 1 12 21a5.5 5.5 0 0 1-5.5-5.5c0-3.5 3-5 3-7M12 3c0 2 1 3 1 4"/>`] },
  lightbulb: { c: "misc", d: [`<path d="M9 18h6M10 21h4"/><path d="M12 3a6.5 6.5 0 0 0-4 11.5c.8.7 1 1.5 1 2.5h6c0-1 .2-1.8 1-2.5A6.5 6.5 0 0 0 12 3Z"/>`] },
  rocket: { c: "misc", d: [`<path d="M12 14c4-4 5.5-9 5.5-9s-5 .5-9 5.5L12 14ZM9.5 10.5 3.5 7l4-1L12 3.5M12 14l-4 6 1.5-1.5 2-2"/>`] },
  robot: { c: "misc", d: [`<rect x="4.5" y="8" width="15" height="10" rx="2.5"/><path d="M12 8V5.5M12 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM9 13h.01M15 13h.01M8 16h8"/>`] },
  "calendar-sync": { c: "misc", d: [`<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17"/><path d="M15 14.5a3.5 3.5 0 0 0-6-.5l-1 1.5M9 14.5a3.5 3.5 0 0 0 6 .5l1-1.5M14 18.5l.5-1.5-1.5.5"/>`] },
};

// ---------------------------------------------------------------------------
// Emit files
// ---------------------------------------------------------------------------
rmSync(svgDir, { recursive: true, force: true });
rmSync(htmlDir, { recursive: true, force: true });
mkdirSync(svgDir, { recursive: true });
mkdirSync(htmlDir, { recursive: true });

const entries = Object.entries(I).map(([name, def]) => ({
  name,
  category: def.c,
  markup: def.d.join("\n"),
}));

const index = {
  count: entries.length,
  note: "MediNova icon library — 24x24 stroke icons. Use inline with stroke=\"currentColor\".",
  categories: {},
  icons: [],
};

for (const e of entries) {
  (index.categories[e.category] ||= []).push(e.name);
  const svg = svgWrap(e.markup);
  writeFileSync(join(svgDir, `${e.name}.svg`), svg + "\n");
  const html = `<!-- icon: ${e.name} | category: ${e.category} -->\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="20" height="20">\n${e.markup}\n</svg>\n`;
  writeFileSync(join(htmlDir, `${e.name}.html`), html);
  index.icons.push({ name: e.name, file: `SVG/${e.name}.svg`, html: `HTML/${e.name}.html`, category: e.category });
}

writeFileSync(join(root, "Icons", "index.json"), JSON.stringify(index, null, 2) + "\n");
writeFileSync(join(root, "Icons", "README.md"), readme());

console.log(`Generated ${entries.length} icons across ${Object.keys(index.categories).length} categories.`);
for (const [cat, names] of Object.entries(index.categories)) console.log(`  ${cat}: ${names.length}`);

function readme() {
  const cats = Object.entries(index.categories)
    .map(([cat, names]) => `### ${cat}\n\n${names.map((n) => `- \`${n}\``).join("\n")}`)
    .join("\n\n");
  return `# MediNova Icon Library

A consistent 24×24 stroke icon catalog (1.8px stroke, round caps/joins) covering the
full app module surface: navigation, health, doctors, pharmacy, appointments,
records, payments, messaging, security, system, status, admin and more.

## Usage

Icons render with \`stroke="currentColor"\` so they inherit the surrounding text color.

\`\`\`html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
     stroke-linejoin="round" aria-hidden="true" width="20" height="20">
  <!-- paths -->
</svg>
\`\`\`

- \`SVG/\` — standalone files for direct use / sprites.
- \`HTML/\` — drop-in snippets (see any file for the full markup).
- \`index.json\` — machine-readable manifest (name, path, category).

## Naming

Kebab-case, one icon per file. Add new icons by extending
\`scripts/gen-icons-catalog.mjs\` and re-running \`node scripts/gen-icons-catalog.mjs\`.

## Catalog

${cats}
`;
}
