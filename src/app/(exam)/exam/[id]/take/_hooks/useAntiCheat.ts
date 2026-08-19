"use client";

import { useEffect, useEffectEvent } from "react";

export function useAntiCheat({
  submissionId,
  requestingCameraRef,
  onViolation,
}: {
  submissionId: string | null;
  requestingCameraRef: React.RefObject<boolean>;
  onViolation: (reason: string) => void;
}) {
  // This used to be a ref reassigned during render, so the listeners below could
  // call the newest onViolation without re-subscribing on every parent render.
  // React flags that write because a ref mutated during render can read stale.
  // useEffectEvent is the supported form of the same idea: it always calls the
  // latest onViolation and is deliberately not an effect dependency.
  const reportViolation = useEffectEvent((reason: string) => {
    onViolation(reason);
  });

  const antiCheatEnabled = process.env.NEXT_PUBLIC_ANTI_CHEAT !== "false";

  // ── Anti-cheat: tab switch + window switch ─────────────────────────────────
  useEffect(() => {
    if (!antiCheatEnabled) return;
    function handleVisibilityChange() {
      if (document.hidden) reportViolation("tab_switch");
    }
    function handleWindowBlur() {
      if (!document.hidden && !requestingCameraRef.current)
        reportViolation("window_switch");
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [submissionId, antiCheatEnabled, requestingCameraRef]);

  // ── Anti-cheat: fullscreen exit ───────────────────────────────────────────
  useEffect(() => {
    if (!antiCheatEnabled) return;
    function handleFullscreenChange() {
      if (!document.fullscreenElement) {
        if (!requestingCameraRef.current) reportViolation("fullscreen_exit");
        document.documentElement.requestFullscreen?.().catch(() => {});
      }
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [submissionId, antiCheatEnabled, requestingCameraRef]);

  // ── Anti-cheat: clipboard ──────────────────────────────────────────────────
  useEffect(() => {
    if (!antiCheatEnabled) return;
    function handleCopy() {
      reportViolation("copy");
    }
    function handlePaste() {
      reportViolation("paste");
    }
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
    };
  }, [submissionId, antiCheatEnabled]);
}
