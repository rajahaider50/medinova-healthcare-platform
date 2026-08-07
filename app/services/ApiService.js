/**
 * MediNova — ApiService.
 * Data-access facade. In MOCK_MODE it delegates to the local DataStore
 * (demo/mock data, clearly isolated). Switching MOCK_MODE=false points the
 * same calls at a real REST backend without touching modules.
 */

import * as Db from "../data/db.js";
import { ENV } from "../config/app.config.js";
import { createAppError } from "../errors/error-utils.js";

/**
 * FUTURE BACKEND SWITCH:
 * set MOCK_MODE = false and provide a BASE_URL. Every call below already
 * has a real-fetch path so modules keep working against a live API.
 */
export const MOCK_MODE = true;
export const BASE_URL = "";

function delay(ms = 180) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mockAdapter(action) {
  await delay();
  try {
    return await action();
  } catch (e) {
    throw createAppError(e.message || "Data operation failed", { type: "db", details: e.details });
  }
}

/**
 * Generic collection API — mirrors DataStore but routed through ApiService
 * so swapping backends is transparent.
 */
export function api(name) {
  return {
    async all(params) {
      if (!MOCK_MODE) return realRequest("GET", `/${name}`, params);
      return mockAdapter(() => Db.collection(name).all());
    },
    async find(filter, sort) {
      if (!MOCK_MODE) return realRequest("GET", `/${name}`, filter);
      return mockAdapter(() => Db.collection(name).find(filter, sort));
    },
    async findOne(filter) {
      if (!MOCK_MODE) return realRequest("GET", `/${name}/find-one`, filter);
      return mockAdapter(() => Db.collection(name).findOne(filter));
    },
    async get(id) {
      if (!MOCK_MODE) return realRequest("GET", `/${name}/${id}`);
      return mockAdapter(() => Db.collection(name).get(id));
    },
    async insert(item) {
      if (!MOCK_MODE) return realRequest("POST", `/${name}`, item);
      return mockAdapter(() => Db.collection(name).insert(item));
    },
    async update(id, patch) {
      if (!MOCK_MODE) return realRequest("PUT", `/${name}/${id}`, patch);
      return mockAdapter(() => Db.collection(name).update(id, patch));
    },
    async remove(id) {
      if (!MOCK_MODE) return realRequest("DELETE", `/${name}/${id}`);
      return mockAdapter(() => Db.collection(name).remove(id));
    },
    async count(filter) {
      if (!MOCK_MODE) return realRequest("GET", `/${name}/count`, filter);
      return mockAdapter(() => Db.collection(name).count(filter));
    },
  };
}

/** Placeholder real-network path (unused while MOCK_MODE=true). */
async function realRequest(method, path, body) {
  const res = await fetch(BASE_URL + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw createAppError(`API ${res.status}`, { type: "server", code: res.status });
  return res.json();
}

/** Simulated latency helper for controllers to show skeletons. */
export const simulateLatency = delay;

export default { api, MOCK_MODE, BASE_URL, simulateLatency };
