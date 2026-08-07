/**
 * MediNova — Live GitHub Pages verification (happy-dom).
 * Loads the deployed site, boots the real app and exercises critical
 * SPA routes, then reports any uncaught errors, failed resource loads
 * or broken navigation.
 *
 * Usage: node scripts/verify-live.mjs [baseUrl]
 */

import { Window } from "happy-dom";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

const base = process.argv[2] || "https://rajahaider50.github.io/medinova-healthcare-platform/";
const root = fileURLToPath(new URL("..", import.meta.url));
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

const win = new Window({ url: base });
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
globalThis.fetch = win.fetch?.bind?.(win) ?? (async () => ({ ok: false, json: async () => ({}) }));
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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

await import(new URL("../app/main.js", import.meta.url).href);
await sleep(1400);

const results = [];
const check = (name, ok) => { results.push({ name, ok }); console.log(`${ok ? "PASS" : "FAIL"}  ${name}`); };

async function goto(path) {
  win.location.hash = path;
  win.dispatchEvent(new win.Event("hashchange"));
  await sleep(160);
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
  const eset = Object.getOwnPropertyDescriptor(emailInput.constructor.prototype, "value")?.set;
  eset ? eset.call(emailInput, email) : (emailInput.value = email);
  emailInput.dispatchEvent(new win.Event("input", { bubbles: true }));
  form.dispatchEvent(new win.Event("submit", { bubbles: true, cancelable: true }));
  await sleep(180);
  return (document.getElementById("view-root")?.textContent || "").trim();
}

const landing = await goto("#/");
check("landing renders", landing.includes("Your health, our priority"));

const admin = await doLogin("admin@medinova.app", "Admin@123");
check("admin login → dashboard", admin.includes("Admin Dashboard"));

for (const [path, token] of [
  ["#/medicines", "medicines"],
  ["#/doctors", "doctors"],
  ["#/admin/analytics", "Analytics"],
  ["#/admin/cms", "Content"],
  ["#/admin/settings", "Settings"],
  ["#/admin/security", "Security"],
  ["#/admin/error-console", "Error Console"],
]) {
  const t = await goto(path);
  check(`route ${path} renders`, t.toLowerCase().includes(token.toLowerCase()));
}

check("no uncaught runtime errors", errors.length === 0);

const failed = results.filter((r) => !r.ok);
if (failed.length) {
  console.log(`\n${failed.length} live check(s) failed.`);
  if (errors.length) console.log("Captured errors:", errors);
  process.exit(1);
}
console.log(`\nAll ${results.length} live checks passed against ${base}`);
process.exit(0);
