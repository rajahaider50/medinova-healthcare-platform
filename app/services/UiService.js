/**
 * MediNova — UiService.
 * Layout UX: sidebar collapse (desktop), mobile drawer, scrim handling,
 * logo navigation and global keyboard shortcuts. Persists collapse state.
 */

import * as Store from "../state/store.js";
import { navigate } from "../router/Router.js";
import { isAuthed, currentUser } from "./AuthService.js";

const COLLAPSE_KEY = "medinova.sidebarCollapsed";
const MOBILE_QUERY = "(max-width: 959px)";

/** Is the current viewport mobile (drawer + bottom nav mode)? */
export function isMobile() {
  return typeof window !== "undefined" && window.matchMedia ? window.matchMedia(MOBILE_QUERY).matches : false;
}

/** Home route for the current user (used by the logo). */
export function homeRoute() {
  if (!isAuthed()) return "/";
  const role = currentUser()?.role;
  return role === "admin" || role === "super_admin" ? "/admin/dashboard" : "/dashboard";
}

/** Logo navigation — never touches auth. */
export function logoHref() {
  return "#" + homeRoute();
}

export function handleLogoClick(e) {
  e.preventDefault();
  closeDrawer();
  navigate(homeRoute());
}

/** Collapse state (desktop persistent). */
export function isCollapsed() {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setCollapsed(value) {
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) sidebar.classList.toggle("collapsed", !!value);
  try {
    localStorage.setItem(COLLAPSE_KEY, value ? "1" : "0");
  } catch { /* ignore */ }
  Store.set("sidebarCollapsed", !!value);
}

export function toggleCollapse() {
  setCollapsed(!isCollapsed());
}

/** Mobile drawer. */
export function openDrawer() {
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) sidebar.classList.add("mobile-open");
  let scrim = document.getElementById("sidebar-scrim");
  if (!scrim) {
    scrim = document.createElement("div");
    scrim.id = "sidebar-scrim";
    scrim.className = "sidebar-scrim";
    scrim.addEventListener("click", closeDrawer);
    document.body.appendChild(scrim);
  }
  document.body.classList.add("drawer-open");
  scrim.style.display = "block";
}

export function closeDrawer() {
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) sidebar.classList.remove("mobile-open");
  const scrim = document.getElementById("sidebar-scrim");
  if (scrim) scrim.style.display = "none";
  document.body.classList.remove("drawer-open");
}

export function toggleDrawer() {
  const sidebar = document.querySelector(".sidebar");
  const isOpen = sidebar && sidebar.classList.contains("mobile-open");
  if (isOpen) closeDrawer();
  else openDrawer();
}

/** Unified menu button handler used by headers. */
export function handleMenuClick(e) {
  if (e) e.preventDefault();
  if (isMobile()) toggleDrawer();
  else toggleCollapse();
}

/** Wire global listeners (scrim close, escape, route close, resize). */
export function initUi() {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  window.addEventListener("resize", () => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) sidebar.classList.remove("mobile-open");
    const scrim = document.getElementById("sidebar-scrim");
    if (scrim) scrim.style.display = "none";
    document.body.classList.remove("drawer-open");
  });

  Store.subscribe("route", () => closeDrawer());

  setCollapsed(isCollapsed());
}

export default { isMobile, homeRoute, logoHref, handleLogoClick, isCollapsed, setCollapsed, toggleCollapse, openDrawer, closeDrawer, toggleDrawer, handleMenuClick, initUi };
