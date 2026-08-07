/**
 * MediNova — ThemeService.
 * Light / Dark / System theme persistence + toggle.
 */

import { STORAGE_KEYS } from "../config/app.config.js";
import * as Storage from "./StorageService.js";
import { applyTheme, THEMES } from "../config/theme.config.js";

let current = Storage.get(STORAGE_KEYS.theme, "dark");

/** Current theme preference. */
export function getTheme() {
  return current;
}

/** Is the applied theme dark? */
export function isDark() {
  return current === "dark" || (current === "system" && (!window.matchMedia || window.matchMedia("(prefers-color-scheme: dark)").matches));
}

/** Set and persist theme. */
export function setTheme(pref, opts = { persist: true }) {
  if (!THEMES.includes(pref)) pref = "dark";
  current = pref;
  applyTheme(pref);
  if (opts.persist !== false) Storage.set(STORAGE_KEYS.theme, pref);
  return pref;
}

/** Cycle dark -> light -> system -> dark. */
export function cycleTheme() {
  const idx = THEMES.indexOf(current);
  return setTheme(THEMES[(idx + 1) % THEMES.length]);
}

/** Toggle helper returns new value. */
export function toggle() {
  return setTheme(current === "dark" ? "light" : "dark");
}

/** Initialize theme on app boot. */
export function init() {
  setTheme(current, { persist: false });
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
      if (current === "system") applyTheme("system");
    });
  }
  return current;
}

export default { getTheme, isDark, setTheme, cycleTheme, toggle, init };

export const ThemeService = { getTheme, isDark, setTheme, cycleTheme, toggle, init };
