"use client";

import { useSyncExternalStore } from "react";
import type { User } from "@/interfaces";

// This used to read localStorage inside useMemo, which runs during render. The
// server has no localStorage, so it rendered the logged-out tree while the very
// first client render rendered the real user, and React threw #418 and discarded
// the whole dashboard. useSyncExternalStore is the supported fix: React uses
// getServerSnapshot for both the server render and the hydration render, so the
// two agree, then swaps to getSnapshot right after hydration.

// getSnapshot has to return a stable reference or React re-renders forever, and
// JSON.parse hands back a new object every call. So read the raw string (cheap,
// and it is what actually changes) and only re-parse when it differs.
let cachedRaw: string | null = null;
let cachedUser: User | null = null;

function subscribe(onStoreChange: () => void) {
  // Cross-tab only: `storage` does not fire in the tab that wrote the value.
  // That matches the old useMemo([], ...) behaviour, which never updated at all.
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getSnapshot(): User | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem("user");
  } catch {
    raw = null;
  }

  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedUser = raw ? (JSON.parse(raw) as User) : null;
    } catch {
      cachedUser = null;
    }
  }

  return cachedUser;
}

function getServerSnapshot(): User | null {
  return null;
}

export function useCurrentUser(): User | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
