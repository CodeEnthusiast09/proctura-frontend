"use client";

import { useRef, useEffect } from "react";

export function useAntiCheat({
  submissionId,
  requestingCameraRef,
  onViolation,
}: {
  submissionId: string | null;
  requestingCameraRef: React.RefObject<boolean>;
  onViolation: (reason: string) => void;
}) {
  const onViolationRef = useRef(onViolation);
  onViolationRef.current = onViolation;

  const antiCheatEnabled = process.env.NEXT_PUBLIC_ANTI_CHEAT !== "false";

  // ── Anti-cheat: tab switch + window switch ─────────────────────────────────
  useEffect(() => {
    if (!antiCheatEnabled) return;
    function handleVisibilityChange() {
      if (document.hidden) onViolationRef.current("tab_switch");
    }
    function handleWindowBlur() {
      if (!document.hidden && !requestingCameraRef.current)
        onViolationRef.current("window_switch");
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId, antiCheatEnabled]);

  // ── Anti-cheat: fullscreen exit ───────────────────────────────────────────
  useEffect(() => {
    if (!antiCheatEnabled) return;
    function handleFullscreenChange() {
      if (!document.fullscreenElement) {
        if (!requestingCameraRef.current)
          onViolationRef.current("fullscreen_exit");
        document.documentElement.requestFullscreen?.().catch(() => { });
      }
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId, antiCheatEnabled]);

  // ── Anti-cheat: clipboard ──────────────────────────────────────────────────
  useEffect(() => {
    if (!antiCheatEnabled) return;
    function handleCopy() {
      onViolationRef.current("copy");
    }
    function handlePaste() {
      onViolationRef.current("paste");
    }
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId, antiCheatEnabled]);
}
