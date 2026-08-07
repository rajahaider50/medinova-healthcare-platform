/**
 * MediNova — Hash Router.
 * SPA routing that works on GitHub Pages (no server rewrites needed).
 * Handles layout mounting, auth/role guards, 404, titles, and errors.
 */

import { h, setChildren } from "../utils/html.js";
import * as ErrorManager from "../errors/ErrorManager.js";
import * as Store from "../state/store.js";
import { isAuthed, currentUser } from "../services/AuthService.js";

const routes = [];
let layouts = {};
let rootEl = null;

/**
 * Register a route.
 * { path, title, view(ctx), controller(ctx, el), layout, auth, roles, meta }
 */
export function register(route) {
  routes.push(route);
  return route;
}

/** Register many routes at once (used by module route files). */
export function registerMany(list) {
  for (const r of list || []) register(r);
}

/** Register layout renderers: { auth, user, admin, public }. */
export function setLayouts(map) {
  layouts = map;
}

/** Set root mount element. */
export function setRoot(el) {
  rootEl = el;
}

function parseHash() {
  const raw = window.location.hash.slice(1) || "/";
  const [path, queryString] = raw.split("?");
  const query = Object.fromEntries(new URLSearchParams(queryString || ""));
  return { path: "/" + path.split("/").filter(Boolean).join("/"), query, raw };
}

/** Match route to path (supports :params). */
function matchRoute(path) {
  for (const route of routes) {
    const pattern = route.path.split("/").filter(Boolean);
    const parts = path.split("/").filter(Boolean);
    if (pattern.length !== parts.length && !route.path.endsWith("*")) continue;
    const params = {};
    let ok = true;
    if (route.path.endsWith("*")) {
      const base = route.path.replace(/\/\*$/, "").split("/").filter(Boolean);
      if (base.every((p, i) => p === parts[i])) {
        params.rest = parts.slice(base.length).join("/");
        return { route, params };
      }
      continue;
    }
    for (let i = 0; i < pattern.length; i++) {
      const p = pattern[i];
      if (p.startsWith(":")) params[p.slice(1)] = decodeURIComponent(parts[i]);
      else if (p !== parts[i]) { ok = false; break; }
    }
    if (ok) return { route, params };
  }
  return null;
}

/** Navigate programmatically. */
export function navigate(path) {
  if (path.startsWith("#")) window.location.hash = path;
  else window.location.hash = "#" + path;
}

/** Navigate replacing current hash. */
export function replace(path) {
  window.location.replace(window.location.pathname + "#" + (path.startsWith("#") ? path.slice(1) : path));
}

/** Refresh current route. */
export function reload() {
  run();
}

/** The single route runner. */
async function run() {
  if (!rootEl) return;
  const { path, query } = parseHash();
  const match = matchRoute(path);

  if (!match) {
    await renderFallback(path);
    return;
  }

  const { route, params } = match;

  // Auth guard
  if (route.auth && !isAuthed()) {
    navigate("/auth/login?redirect=" + encodeURIComponent(path));
    return;
  }
  // Role guard
  if (route.roles && route.roles.length) {
    const user = currentUser();
    const role = user?.role;
    if (!user || !route.roles.includes(role)) {
      await renderPermission(path);
      return;
    }
  }

  Store.set("route", { path, query, params, title: route.title });

  const layoutName = route.layout || (route.auth ? "user" : "public");
  const layoutFn = layouts[layoutName] || layouts["public"];

  try {
    if (layoutFn) {
      const frame = await layoutFn({ route, path, query, params });
      setChildren(rootEl, frame);
    } else {
      setChildren(rootEl, h("div", { class: "app-content" }));
    }
    await renderView(route, params, query);
  } catch (e) {
    ErrorManager.report(e, { module: "router", page: path, retryFn: () => run() });
    renderError(path);
  }
}

async function renderView(route, params, query) {
  const content = document.getElementById("view-root");
  if (!content) return;

  // Skeleton while view loads
  content.replaceChildren(
    h("div", { class: "spinner-wrap" }, h("div", { class: "spinner spinner-lg" }))
  );

  const ctx = { params, query, route, path: route.path };

  let viewEl;
  try {
    viewEl = await route.view(ctx);
  } catch (e) {
    ErrorManager.report(e, { module: "view", page: route.path, retryFn: () => run() });
    viewEl = h("div", { class: "error-state anim-fade-in" }, [
      h("div", { class: "error-icon" }, h("i", { class: "fa-solid fa-triangle-exclamation" })),
      h("h3", {}, "This page couldn't load"),
      h("p", { class: "text-secondary" }, "An unexpected error occurred. Please try again."),
      h("button", { class: "btn btn-primary mt-3", onclick: () => run() }, h("i", { class: "fa-solid fa-rotate" }), " Retry"),
    ]);
  }

  setChildren(content, h("div", { class: "anim-fade-up" }, viewEl));

  if (route.controller) {
    try {
      await route.controller(ctx, content);
    } catch (e) {
      ErrorManager.report(e, { module: "controller", page: route.path, retryFn: () => run() });
    }
  }

  document.title = route.title ? `${route.title} \u00B7 MediNova` : "MediNova";
  window.scrollTo({ top: 0, behavior: "instant" });
}

async function renderFallback(path) {
  Store.set("route", { path, title: "Not Found" });
  const layoutFn = layouts["public"];
  if (layoutFn) setChildren(rootEl, await layoutFn({ route: null }));
  const content = document.getElementById("view-root");
  if (content) {
    setChildren(content, h("div", { class: "anim-fade-up" }, [
      h("div", { class: "error-state", style: { padding: "80px 24px" } }, [
        h("div", { class: "error-icon" }, h("i", { class: "fa-solid fa-circle-question" })),
        h("h1", { class: "display-1" }, "404"),
        h("h3", {}, "Page not found"),
        h("p", { class: "text-secondary" }, `No route matches "${path}". It may have been moved.`),
        h("button", { class: "btn btn-primary mt-3", onclick: () => navigate("/") }, h("i", { class: "fa-solid fa-house" }), " Go Home"),
      ]),
    ]));
  }
  document.title = "404 \u00B7 MediNova";
}

async function renderPermission(path) {
  const layoutFn = layouts["user"] || layouts["public"];
  if (layoutFn) setChildren(rootEl, await layoutFn({ route: null }));
  const content = document.getElementById("view-root");
  if (content) {
    setChildren(content, h("div", { class: "error-state", style: { padding: "80px 24px" } }, [
      h("div", { class: "error-icon", style: { background: "var(--warning-soft)", color: "var(--warning)" } }, h("i", { class: "fa-solid fa-user-lock" })),
      h("h3", {}, "Access restricted"),
      h("p", { class: "text-secondary" }, "You don't have permission to view this page."),
      h("button", { class: "btn btn-primary mt-3", onclick: () => navigate("/") }, h("i", { class: "fa-solid fa-house" }), " Go Home"),
    ]));
  }
  document.title = "Access Denied \u00B7 MediNova";
}

function renderError(path) {
  const content = document.getElementById("view-root");
  if (!content) return;
  setChildren(content, h("div", { class: "error-state", style: { padding: "80px 24px" } }, [
    h("div", { class: "error-icon" }, h("i", { class: "fa-solid fa-circle-exclamation" })),
    h("h3", {}, "Something went wrong"),
    h("p", { class: "text-secondary" }, "The system hit an unexpected error."),
    h("button", { class: "btn btn-primary mt-3", onclick: () => run() }, h("i", { class: "fa-solid fa-rotate" }), " Try Again"),
  ]));
  document.title = "Error \u00B7 MediNova";
}

/** Initialize router. */
export function init() {
  window.addEventListener("hashchange", () => {
    run();
  });
  run();
}

export default { register, registerMany, setLayouts, setRoot, navigate, replace, reload, init, run, current: parseHash };
