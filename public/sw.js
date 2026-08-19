// Minimal service worker — its only purpose is to make the browser show the
// "Install" prompt for the PWA. We do NOT cache the app: an exam-taking app
// must always serve fresh code, never a stale shell. If you want offline
// support later, add caching here, but be careful never to serve a stale
// /exam page mid-exam.

const VERSION = "proctura-v1";

self.addEventListener("install", () => {
  // Take over immediately on first install.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Drop any old caches if a previous version registered them.
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== VERSION).map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

// Pass-through fetch — always go to network. Comment from above applies.
self.addEventListener("fetch", () => {});
