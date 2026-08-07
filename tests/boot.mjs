/**
 * MediNova — Boot smoke test (happy-dom).
 * Boots the real app (main.js), seeds the database (empty-by-default: only
 * the bootstrap admin + CMS/settings templates), logs in as the admin and
 * verifies key views render without runtime errors.
 *
 * Usage: npm test
 */

import { Window } from "happy-dom";
import { pathToFileURL } from "url";
import { join } from "path";
import { fileURLToPath } from "url";

const root = fileURLToPath(new URL("..", import.meta.url));
const win = new Window({ url: "http://localhost:5500/" });
const { document } = win;

globalThis.window = win;
globalThis.document = document;
globalThis.navigator = win.navigator;
globalThis.location = win.location;
globalThis.localStorage = win.localStorage;
globalThis.sessionStorage = win.sessionStorage;
globalThis.customElements = win.customElements;
globalThis.HTMLElement = win.HTMLElement;
globalThis.Node = win.Node;
globalThis.Element = win.Element;
globalThis.Event = win.Event;
globalThis.EventTarget = win.EventTarget;
globalThis.MutationObserver = win.MutationObserver;
globalThis.CSSStyleDeclaration = win.CSSStyleDeclaration;
globalThis.CustomEvent = win.CustomEvent;
globalThis.getComputedStyle = () => ({ getPropertyValue: () => "" });

const errors = [];
win.addEventListener("error", (e) => errors.push("window.error: " + (e.error?.message || e.message)));
win.addEventListener("unhandledrejection", (e) => errors.push("unhandledrejection: " + (e.reason?.message || String(e.reason))));

document.body.innerHTML = `
  <div id="app-shell"></div>
  <div id="toast-root"></div>
  <div id="modal-root"></div>
  <div id="console-root"></div>
  <div id="network-banner" hidden></div>
  <div id="boot-screen"></div>`;

await import(pathToFileURL(join(root, "app/main.js")).href);
await sleep(1400);

const db = JSON.parse(win.localStorage.getItem("mn:medinova.db") || "{}");
const seedOk =
  Array.isArray(db.users) && db.users.length === 1 && db.users[0]?.isBootstrap === true &&
  Array.isArray(db.doctors) && db.doctors.length === 0 &&
  Array.isArray(db.medicines) && db.medicines.length === 0 &&
  Array.isArray(db.appointments) && db.appointments.length === 0 &&
  db._meta?.some((m) => m.id === "seed" && m.version === "2.0.0") &&
  Array.isArray(db.platformSettings) && db.platformSettings.some((s) => s.id === "__seed__") &&
  Array.isArray(db.cms) && db.cms.some((c) => c.id === "__seed__");

const results = [];
function check(name, ok) {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
}

check("database seeded empty-by-default (bootstrap admin + templates only)", !!seedOk);

async function goto(path) {
  win.location.hash = path;
  win.dispatchEvent(new win.Event("hashchange"));
  await sleep(140);
  return (document.getElementById("view-root")?.textContent || "").trim();
}

async function doLogin(email, password) {
  await goto("#/auth/login");
  const form = document.querySelector("form");
  if (!form) return "NO_FORM";
  for (const inp of form.querySelectorAll("input")) {
    const setter = Object.getOwnPropertyDescriptor(inp.constructor.prototype, "value")?.set;
    setter ? setter.call(inp, password) : (inp.value = password);
    inp.dispatchEvent(new win.Event("input", { bubbles: true }));
  }
  const emailInput = form.querySelector('input[name="email"]');
  const emailSetter = Object.getOwnPropertyDescriptor(emailInput.constructor.prototype, "value")?.set;
  emailSetter ? emailSetter.call(emailInput, email) : (emailInput.value = email);
  emailInput.dispatchEvent(new win.Event("input", { bubbles: true }));
  form.dispatchEvent(new win.Event("submit", { bubbles: true, cancelable: true }));
  await sleep(180);
  return (document.getElementById("view-root")?.textContent || "").trim();
}

const landing = await goto("#/");
check("landing page renders hero", landing.includes("Your health, our priority"));

const adminLanding = await doLogin("admin@medinova.app", "Admin@123");
check("admin login → admin dashboard", adminLanding.includes("Admin Dashboard"));

const adminDash = await goto("#/admin/dashboard");
check("admin dashboard renders", adminDash.includes("Admin Dashboard"));

const cms = await goto("#/admin/cms");
check("CMS content manager renders", cms.includes("Content Management") && cms.includes("Pages"));

const settings = await goto("#/admin/settings");
check("platform settings renders editable", settings.includes("Platform Settings"));

const errConsole = await goto("#/admin/error-console");
check("error console renders", errConsole.includes("Error Console"));

const meds = await goto("#/medicines");
await sleep(260);
const medsText = (document.getElementById("view-root")?.textContent || "").trim();
check("medicines empty state renders", medsText.includes("No medicines found"));

const doctors = await goto("#/doctors");
await sleep(260);
const doctorsText = (document.getElementById("view-root")?.textContent || "").trim();
check("doctors empty state renders", doctorsText.includes("No doctors found"));

const errs = await goto("#/admin/errors-not-a-route");
check("404 fallback renders", errs.length > 0 || document.title.includes("404"));

check("no uncaught runtime errors", errors.length === 0);

const failed = results.filter((r) => !r.ok);
if (failed.length) {
  console.log(`\n${failed.length} check(s) failed.`);
  if (errors.length) console.log("Captured errors:", errors);
  process.exit(1);
}
console.log(`\nAll ${results.length} boot checks passed.`);
process.exit(0);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
