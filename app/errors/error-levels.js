/**
 * MediNova — Error severity levels.
 */

export const SEVERITY = {
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
  CRITICAL: "critical",
};

export const SEVERITY_ORDER = [SEVERITY.INFO, SEVERITY.WARNING, SEVERITY.ERROR, SEVERITY.CRITICAL];

export const SEVERITY_META = {
  [SEVERITY.INFO]: { label: "Info", icon: "fa-circle-info", color: "#22d3ee" },
  [SEVERITY.WARNING]: { label: "Warning", icon: "fa-triangle-exclamation", color: "#f59e0b" },
  [SEVERITY.ERROR]: { label: "Error", icon: "fa-circle-exclamation", color: "#ef4444" },
  [SEVERITY.CRITICAL]: { label: "Critical", icon: "fa-bolt", color: "#f87171" },
};

export function isSeverity(value) {
  return SEVERITY_ORDER.includes(value);
}

/** Rank helper for sorting severity. */
export function severityRank(value) {
  return SEVERITY_ORDER.indexOf(value);
}

export default { SEVERITY, SEVERITY_ORDER, SEVERITY_META, isSeverity, severityRank };
