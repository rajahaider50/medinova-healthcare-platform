/**
 * MediNova — Node shim: minimal browser globals so pure-CJS-free app
 * modules (app.config.js, etc.) can be imported by dev scripts.
 * Import this FIRST in any Node script that pulls in app modules.
 */

globalThis.location = globalThis.location || { hostname: "localhost", protocol: "https:", href: "https://localhost/" };
globalThis.window = globalThis.window || globalThis;
globalThis.navigator = globalThis.navigator || { userAgent: "node" };
globalThis.document = globalThis.document || { documentElement: { style: {}, setAttribute: () => {}, getAttribute: () => null }, getElementById: () => null, createElement: () => ({ style: {}, appendChild: () => {}, setAttribute: () => {}, removeAttribute: () => {} }) };
globalThis.localStorage = globalThis.localStorage || { getItem: () => null, setItem: () => {}, removeItem: () => {} };
