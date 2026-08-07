/**
 * MediNova — Clipboard helpers.
 */

/** Copy text to clipboard with legacy fallback. */
export function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(String(text));
  }
  return new Promise((resolve, reject) => {
    try {
      const ta = document.createElement("textarea");
      ta.value = String(text);
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      ok ? resolve() : reject(new Error("Copy failed"));
    } catch (e) {
      reject(e);
    }
  });
}

/** Copy text and show a small confirmation toast. */
export async function copyTextWithFeedback(text, toastFn) {
  try {
    await copyText(text);
    toastFn && toastFn({ type: "success", title: "Copied", msg: "Copied to clipboard" });
    return true;
  } catch {
    toastFn && toastFn({ type: "error", title: "Copy failed", msg: "Could not copy to clipboard" });
    return false;
  }
}

/** Copy an error block (safe fields only, no sensitive data). */
export function buildErrorClipboard(error) {
  const safe = {
    id: error?.id || "-",
    level: error?.level || "-",
    type: error?.type || "-",
    message: error?.message || "-",
    file: error?.file || "-",
    function: error?.function || "-",
    line: error?.line || "-",
    column: error?.column || "-",
    url: error?.url || "-",
    page: error?.page || "-",
    timestamp: error?.timestamp || "-",
    browser: error?.browser || "-",
    device: error?.device || "-",
    userAgent: error?.userAgent || "-",
    stack: error?.stack || "(no stack)",
  };
  const lines = [];
  for (const [k, v] of Object.entries(safe)) {
    lines.push(`${k.toUpperCase()}: ${v}`);
  }
  return lines.join("\n");
}

export default { copyText, copyTextWithFeedback, buildErrorClipboard };
