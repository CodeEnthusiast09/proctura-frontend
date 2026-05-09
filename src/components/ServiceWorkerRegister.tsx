"use client";

import { useEffect } from "react";

// Registers /sw.js so the browser can offer the PWA install prompt.
// The SW itself is a no-op (network passthrough) — see public/sw.js for why.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator))
      return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch(() => {
        // Registration failure is non-critical — the app still works,
        // students just don't see an install prompt.
      });
  }, []);
  return null;
}
