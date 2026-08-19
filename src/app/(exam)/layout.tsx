"use client";

import { useSyncExternalStore } from "react";
import { retrieveFromLocalStorage } from "@/lib/localStorage";
import { StudentAuth } from "@/components/auth";
import type { User } from "@/interfaces";

// Exam routes are student-only territory. A non-student token (a lecturer or
// admin signed in on the same browser) must NOT pass through, otherwise the
// student-only API calls inside the exam page (e.g. /exams/available) 403 and
// fire confusing toasts. We gate on role here, not just token presence.
//
// localStorage is an external store, so reading it in a useState initialiser
// made the server render the login gate and the client render the exam page,
// throwing away the whole tree on every authenticated load (React #418).
// useSyncExternalStore serves the server snapshot during hydration, so the
// first client render matches, then swaps to the real value.
//
// The state is deliberately tri-state: "unknown" is what both the server and
// the hydration pass render, so an authenticated student never sees the login
// form flash before their exam appears.
type Session = "unknown" | "student" | "guest";

const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  // Catch sign-out or sign-in performed in another tab.
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

// StudentAuth writes the token to localStorage, which React cannot observe on
// its own, so it tells us when it has.
function notifySessionChange() {
  listeners.forEach((cb) => cb());
}

function getSnapshot(): Session {
  const token = retrieveFromLocalStorage<string>("token");
  if (!token) return "guest";
  const user = retrieveFromLocalStorage<User>("user");
  return user?.role === "student" ? "student" : "guest";
}

function getServerSnapshot(): Session {
  return "unknown";
}

export default function ExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {session === "unknown" ? null : session === "student" ? (
        children
      ) : (
        <StudentAuth onAuthenticated={notifySessionChange} />
      )}
    </div>
  );
}
