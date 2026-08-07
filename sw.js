/* MediNova Healthcare — service worker */
const VERSION = "medinova-v1.0.0";
const BASE = self.registration.scope;
const APP_SHELL = [
  `${BASE}index.html`,
  `${BASE}manifest.webmanifest`,
  `${BASE}404.html`,
  `${BASE}assets/logo/favicon.svg`,
  `${BASE}assets/logo/logo.svg`,
  `${BASE}assets/logo/logo-mark.svg`,
  `${BASE}assets/logo/logo-light.svg`,
  `${BASE}assets/icons/icon-192.png`,
  `${BASE}assets/icons/icon-512.png`,
  `${BASE}assets/icons/apple-touch-icon.png`,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(APP_SHELL).catch(() => null))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  // Never cache the hash-router entry point stale — always network-first.
  if (url.pathname === new URL(BASE).pathname) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fresh = fetch(req)
          .then((res) => {
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(VERSION).then((cache) => cache.put(req, copy));
            }
            return res;
          })
          .catch(() => cached || Response.error());
        return fresh;
      })
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const fetched = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(VERSION).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => null);
      return cached || fetched || caches.match(`${BASE}404.html`);
    })
  );
});
