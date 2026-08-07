/**
 * MediNova — Error type codes used across the whole app.
 * Central registry so every module reports consistent types.
 */

export const ERROR_TYPES = {
  JS: "js",
  RUNTIME: "runtime",
  PROMISE: "promise",
  API: "api",
  NETWORK: "network",
  OFFLINE: "offline",
  TIMEOUT: "timeout",
  VALIDATION: "validation",
  ACTION: "action",
  COMPONENT: "component",
  IMAGE: "image",
  RESOURCE: "resource",
  AUTH: "auth",
  PERMISSION: "permission",
  ROUTING: "routing",
  SEARCH: "search",
  UPLOAD: "upload",
  STORAGE: "storage",
  DB: "db",
  FILE: "file",
  NOT_FOUND: "not-found",
  SESSION: "session",
  SERVER: "server",
  UNKNOWN: "unknown",
};

export const ERROR_TYPE_META = {
  [ERROR_TYPES.JS]: { label: "JavaScript", icon: "fa-bug" },
  [ERROR_TYPES.RUNTIME]: { label: "Runtime", icon: "fa-play-circle" },
  [ERROR_TYPES.PROMISE]: { label: "Promise", icon: "fa-hourglass-half" },
  [ERROR_TYPES.API]: { label: "API", icon: "fa-server" },
  [ERROR_TYPES.NETWORK]: { label: "Network", icon: "fa-wifi" },
  [ERROR_TYPES.OFFLINE]: { label: "Offline", icon: "fa-wifi-slash" },
  [ERROR_TYPES.TIMEOUT]: { label: "Timeout", icon: "fa-clock" },
  [ERROR_TYPES.VALIDATION]: { label: "Validation", icon: "fa-circle-xmark" },
  [ERROR_TYPES.ACTION]: { label: "Action", icon: "fa-hand-pointer" },
  [ERROR_TYPES.COMPONENT]: { label: "Component", icon: "fa-cube" },
  [ERROR_TYPES.IMAGE]: { label: "Image", icon: "fa-image" },
  [ERROR_TYPES.RESOURCE]: { label: "Resource", icon: "fa-file" },
  [ERROR_TYPES.AUTH]: { label: "Auth", icon: "fa-lock" },
  [ERROR_TYPES.PERMISSION]: { label: "Permission", icon: "fa-user-shield" },
  [ERROR_TYPES.ROUTING]: { label: "Routing", icon: "fa-route" },
  [ERROR_TYPES.SEARCH]: { label: "Search", icon: "fa-magnifying-glass" },
  [ERROR_TYPES.UPLOAD]: { label: "Upload", icon: "fa-cloud-arrow-up" },
  [ERROR_TYPES.STORAGE]: { label: "Storage", icon: "fa-database" },
  [ERROR_TYPES.DB]: { label: "Database", icon: "fa-database" },
  [ERROR_TYPES.FILE]: { label: "File", icon: "fa-file" },
  [ERROR_TYPES.NOT_FOUND]: { label: "Not Found", icon: "fa-circle-question" },
  [ERROR_TYPES.SESSION]: { label: "Session", icon: "fa-clock-rotate-left" },
  [ERROR_TYPES.SERVER]: { label: "Server", icon: "fa-server" },
  [ERROR_TYPES.UNKNOWN]: { label: "Unknown", icon: "fa-question" },
};

export function isErrorType(value) {
  return Object.values(ERROR_TYPES).includes(value);
}

export function typeLabel(value) {
  return ERROR_TYPE_META[value]?.label || "Unknown";
}

export default { ERROR_TYPES, ERROR_TYPE_META, isErrorType, typeLabel };
