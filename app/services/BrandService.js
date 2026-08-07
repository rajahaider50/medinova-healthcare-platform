/**
 * MediNova — BrandService.
 * Applies platform settings (brand, accent color, theme, contact, footer,
 * header, announcement) from the `platformSettings` collection to the live UI.
 * Admin-editable via the admin Settings panel.
 */

import * as Db from "../data/db.js";
import { DEFAULT_SETTINGS } from "../data/defaults.js";
import * as Log from "./LogService.js";

/** Full current settings object (merged over defaults). */
export function getSettings() {
  const doc = Db.collection("platformSettings").findOne({ id: "__seed__" });
  if (!doc) return DEFAULT_SETTINGS;
  const { id, ...rest } = doc;
  return deepMerge(DEFAULT_SETTINGS, rest);
}

/** Brand subset. */
export function getBrand() {
  return getSettings().brand;
}

/** Persist a settings patch (deep merge) and apply to the live UI. */
export function saveSettings(patch, actor) {
  const current = getSettings();
  const merged = deepMerge(current, patch);
  const doc = Db.collection("platformSettings").findOne({ id: "__seed__" });
  if (doc) {
    Db.collection("platformSettings").update(doc.id, merged);
  } else {
    Db.collection("platformSettings").insert({ id: "__seed__", ...merged });
  }
  Log.settingsChanged("platformSettings", { actor: actor || "admin" });
  applyBrand();
  return getSettings();
}

/**
 * Push brand settings into the live DOM: accent color, theme, brand name and
 * announcement banner. Called at boot and after every settings save.
 */
export function applyBrand() {
  const settings = getSettings();
  const brand = settings.brand || {};

  const root = document.documentElement;
  if (brand.accentColor && /^#[0-9a-f]{6}$/i.test(brand.accentColor)) {
    const base = brand.accentColor;
    root.style.setProperty("--color-primary", base);
    root.style.setProperty("--color-primary-strong", base);
    root.style.setProperty("--color-primary-soft", base);
    root.style.setProperty("--color-primary-glow", hexToRgba(base, 0.35));
    root.style.setProperty("--color-primary-tint", hexToRgba(base, 0.12));
    root.style.setProperty("--color-primary-tint-2", hexToRgba(base, 0.2));
  }

  if (brand.theme === "light" || brand.theme === "dark") {
    root.setAttribute("data-theme", brand.theme);
  }

  const banner = document.getElementById("announcement-banner");
  if (banner) {
    const msg = (brand.announcement || "").trim();
    if (msg) {
      banner.textContent = msg;
      banner.removeAttribute("hidden");
    } else {
      banner.hidden = true;
    }
  }
}

/** Deep merge plain objects/arrays (arrays replaced). */
function deepMerge(base, patch) {
  if (Array.isArray(base) || Array.isArray(patch)) return patch === undefined ? base : patch;
  if (!base || typeof base !== "object" || !patch || typeof patch !== "object") {
    return patch === undefined ? base : patch;
  }
  const out = { ...base };
  for (const k of Object.keys(patch)) {
    out[k] = deepMerge(base[k], patch[k]);
  }
  return out;
}

function hexToRgba(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export default { getSettings, getBrand, saveSettings, applyBrand, deepMerge };
