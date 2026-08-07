/**
 * MediNova — Application configuration.
 * Single source of truth for app-level settings.
 */

export const APP_NAME = "MediNova";
export const APP_TAGLINE = "Smart Healthcare. Simple. Secure.";
export const APP_VERSION = "1.0.0";
export const APP_BRAND = "MediNova Healthcare";
export const REPO_NAME = "medinova-healthcare";
export const GITHUB_USER = "rajahaider50";

/** Environment detection. */
export const IS_DEV =
  location.hostname === "localhost" ||
  location.hostname === "127.0.0.1" ||
  location.protocol === "file:" ||
  ["0.0.0.0"].includes(location.hostname);

export const ENV = IS_DEV ? "development" : "production";

/** Base URL used for asset paths (works on GitHub Pages sub-path). */
export const BASE_PATH = "/";

/** Default currency. */
export const CURRENCY = "Rs";
export const CURRENCY_CODE = "PKR";
export const LOCALE = "en";

/** Timezone display. */
export const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Karachi";

/** Feature toggles (admin can override via settings service). */
export const FEATURES = {
  pharmacyEnabled: true,
  onlineConsultation: true,
  paymentsEnabled: true,
  reviewsEnabled: true,
  darkMode: true,
  language: "en",
  registrationEnabled: true,
  demoMode: true,
};

/** App storage keys. */
export const STORAGE_KEYS = {
  db: "medinova.db",
  session: "medinova.session",
  theme: "medinova.theme",
  prefs: "medinova.prefs",
  errors: "medinova.errors",
  logs: "medinova.logs",
  recentSearches: "medinova.recentSearches",
  cart: "medinova.cart",
  notifications: "medinova.notifications",
  onboarding: "medinova.onboarding",
};

/** Demo accounts (isolated mock credentials). */
export const DEMO_ACCOUNTS = {
  user: { email: "patient@medinova.app", password: "Patient@123", name: "Ayesha Khan" },
  admin: { email: "admin@medinova.app", password: "Admin@123", name: "Admin MediNova" },
  doctor: { email: "doctor@medinova.app", password: "Doctor@123", name: "Dr. Salman Raza" },
};

export default { APP_NAME, APP_TAGLINE, APP_VERSION, APP_BRAND, REPO_NAME, GITHUB_USER, IS_DEV, ENV, BASE_PATH, CURRENCY, CURRENCY_CODE, LOCALE, TIMEZONE, FEATURES, STORAGE_KEYS, DEMO_ACCOUNTS };
