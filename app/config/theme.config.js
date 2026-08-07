/**
 * MediNova — Theme configuration (Light / Dark / System).
 */

export const THEMES = ["dark", "light", "system"];

export const DEFAULT_THEME = "dark";

/** Map resolved theme -> actual. */
export function resolveTheme(pref) {
  if (pref === "system") {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }
  return pref === "light" ? "light" : "dark";
}

/** Apply theme to document root + meta theme-color. */
export function applyTheme(pref) {
  const resolved = resolveTheme(pref);
  document.documentElement.setAttribute("data-theme", resolved);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", resolved === "light" ? "#eef2f7" : "#070a14");
  }
  document.dispatchEvent(
    new CustomEvent("mn:themechange", { detail: { pref, resolved } })
  );
}

/** Brand accent overrides exposed for future admin branding panel. */
export const BRAND_COLORS = {
  primary: "#8b5cf6",
  primaryStrong: "#a855f7",
  accentTeal: "#14b8a6",
  accentCyan: "#22d3ee",
};

/** Typography configuration (Google Fonts). */
export const FONTS = {
  heading: "Sora",
  body: "Inter",
  url: "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap",
};

export default { THEMES, DEFAULT_THEME, resolveTheme, applyTheme, BRAND_COLORS, FONTS };
