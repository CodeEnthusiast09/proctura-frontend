"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

// next-themes resolves the theme synchronously on the client, so the very first
// client render already knows it while the server render did not. Rendering the
// button straight away is a hydration mismatch (React #418). This is the "have
// we hydrated yet" signal the old `mounted` state carried, without a setState
// in an effect: React uses the server snapshot during hydration, so the first
// client render matches the server, then swaps to the client snapshot.
const subscribeToNothing = () => () => {};
const onClient = () => true;
const onServer = () => false;

export function ThemeToggle({ className = "" }: { className?: string }) {
  const hydrated = useSyncExternalStore(
    subscribeToNothing,
    onClient,
    onServer,
  );
  // resolvedTheme rather than theme: the provider sets defaultTheme="system",
  // where `theme` is the literal string "system", so `theme === "dark"` was
  // false even with the OS in dark mode. The button showed the wrong icon and
  // its first click set the theme it was already on.
  const { resolvedTheme, setTheme } = useTheme();

  if (!hydrated) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={`w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${className}`}
      aria-label="Toggle dark mode"
    >
      {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
