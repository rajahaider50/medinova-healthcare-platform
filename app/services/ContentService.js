/**
 * MediNova — ContentService.
 * Reads/writes editable page content (CMS) stored in the `cms` collection.
 * The admin Page Content Manager edits these; the frontend renders them.
 * Falls back to built-in defaults when no CMS record exists yet.
 */

import * as Db from "../data/db.js";
import { DEFAULT_PAGES, PAGE_FIELD_SCHEMAS } from "../data/defaults.js";
import * as Log from "./LogService.js";

/** Normalize the CMS doc into a plain map of slug -> page. */
export function getContent() {
  const doc = Db.collection("cms").findOne({ id: "__seed__" });
  const stored = (doc && doc.pages) || {};
  return { ...DEFAULT_PAGES, ...stored };
}

/** Get a single page's editable content. */
export function getPage(slug) {
  const content = getContent();
  const key = String(slug || "").toLowerCase();
  const page = content[key];
  if (!page && key === "home") return content.home || DEFAULT_PAGES.home;
  return page || content.home || DEFAULT_PAGES.home;
}

/** List pages available in the CMS editor. */
export function listPages() {
  return Object.entries(DEFAULT_PAGES).map(([key, page]) => ({
    key,
    id: page.id,
    title: page.title,
    slug: page.slug,
    fieldCount: (PAGE_FIELD_SCHEMAS[key] || []).length,
  }));
}

/** Field schema for a page (drives the CMS editor form). */
export function pageFields(key) {
  return PAGE_FIELD_SCHEMAS[key] || [];
}

/** Save updated fields for a page (merge, keeps unknown fields). */
export function savePage(key, fields, actor) {
  const content = getContent();
  const current = content[key] || {};
  const next = { ...DEFAULT_PAGES[key], ...current, ...fields };
  const doc = Db.collection("cms").findOne({ id: "__seed__" });
  if (doc) {
    Db.collection("cms").update(doc.id, { pages: { ...content, [key]: next } });
  } else {
    Db.collection("cms").insert({ id: "__seed__", pages: { ...content, [key]: next } });
  }
  Log.settingsChanged(`cms.${key}`, { actor: actor || "admin", page: key });
  return next;
}

/** Edit the home page feature cards. */
export function saveFeatures(features, actor) {
  const content = getContent();
  const next = Array.isArray(features) ? features : [];
  const doc = Db.collection("cms").findOne({ id: "__seed__" });
  if (doc) {
    Db.collection("cms").update(doc.id, { pages: { ...content, features: next } });
  } else {
    Db.collection("cms").insert({ id: "__seed__", pages: { ...content, features: next } });
  }
  Log.settingsChanged("cms.features", { actor: actor || "admin" });
  return next;
}

/** Features list for the landing page. */
export function getFeatures() {
  const content = getContent();
  return content.features || DEFAULT_PAGES.features || [];
}

export default { getContent, getPage, listPages, pageFields, savePage, saveFeatures, getFeatures };
