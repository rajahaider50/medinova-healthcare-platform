/**
 * MediNova — AppStore (observable global state).
 * Minimal pub/sub store for cross-module state (theme, session, counts).
 */

const state = {
  booted: false,
  route: null,
  user: null,
  role: null,
  theme: "dark",
  online: navigator.onLine !== false,
  unreadNotifications: 0,
  cartCount: 0,
  errors: 0,
  messages: 0,
  sidebarCollapsed: false,
};

const listeners = new Map();

/** Read a state slice. */
export function get(key) {
  return state[key];
}

/** Read all state (shallow copy). */
export function all() {
  return { ...state };
}

/** Update state and notify subscribers. */
export function set(key, value) {
  const prev = state[key];
  if (Object.is(prev, value)) return value;
  state[key] = value;
  emit(key, value, prev);
  return value;
}

/** Batch update. */
export function setMany(patch) {
  for (const [k, v] of Object.entries(patch)) {
    if (!Object.is(state[k], v)) {
      state[k] = v;
      emit(k, v, null);
    }
  }
}

/** Subscribe to a key (or "*" for all). Returns unsubscribe. */
export function subscribe(key, fn) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key).add(fn);
  return () => listeners.get(key)?.delete(fn);
}

/** Subscribe to multiple keys. */
export function subscribeMany(keys, fn) {
  const offs = keys.map((k) => subscribe(k, fn));
  return () => offs.forEach((off) => off());
}

function emit(key, value, prev) {
  const set = listeners.get(key);
  if (set) for (const fn of set) fn(value, prev);
  const allSet = listeners.get("*");
  if (allSet) for (const fn of allSet) fn({ key, value, prev });
}

/** Reset state (logout). */
export function reset() {
  setMany({ user: null, role: null, unreadNotifications: 0, messages: 0, cartCount: 0 });
}

/** Set current user + role from a user object. */
export function setUser(user) {
  set("user", user);
  set("role", user?.role || null);
}

export default { get, all, set, setMany, subscribe, subscribeMany, reset, setUser };
