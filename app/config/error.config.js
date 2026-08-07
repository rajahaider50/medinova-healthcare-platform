/**
 * MediNova — Error system configuration.
 */

/** Maximum error history retained. */
export const ERROR_MAX_HISTORY = 200;

/** Toast display duration in ms. */
export const ERROR_TOAST_DURATION = 6000;

/** Show floating overlay on-screen in development only. */
export const ERROR_OVERLAY_DEV_ONLY = true;

/** Max stack trace lines kept for clipboard. */
export const ERROR_STACK_LINES = 25;

/** Auto capture window.onerror / unhandledrejection. */
export const AUTO_CAPTURE = true;

/** Live counter animation duration (ms). */
export const ERROR_COUNTER_PULSE = 300;

/** Persist error history to localStorage. */
export const ERROR_PERSIST = true;

/** Group repeated identical errors (same message+module) within a window. */
export const ERROR_DEDUPE_WINDOW = 3000;

export default {
  ERROR_MAX_HISTORY,
  ERROR_TOAST_DURATION,
  ERROR_OVERLAY_DEV_ONLY,
  ERROR_STACK_LINES,
  AUTO_CAPTURE,
  ERROR_COUNTER_PULSE,
  ERROR_PERSIST,
  ERROR_DEDUPE_WINDOW,
};
