"use client";
// src/app/(exam)/exam/[id]/take/page.tsx
import { use, useEffect, useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Save,
} from "lucide-react";
import { useExam } from "@/hooks/services/exams";
import {
  useSaveAnswer,
  useSubmitExam,
  useLogViolation,
} from "@/hooks/services/submissions";
import { retrieveFromLocalStorage } from "@/lib/localStorage";
import type { Submission, Question } from "@/interfaces";
import toast from "react-hot-toast";

// Lazy-load Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-[#1e1e1e]">
      <Loader2 size={24} className="animate-spin text-slate-500" />
    </div>
  ),
});

// Monaco language map (Judge0 language IDs)
const LANGUAGE_MAP: Record<string, string> = {
  "python 3": "python",
  c: "c",
  "c++": "cpp",
  "c#": "csharp",
  java: "java",
};

function submissionKey(examId: string) {
  return `exam_submission_${examId}`;
}

function formatTime(seconds: number): string {
  if (seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ExamTakePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  // ── Load exam and submission from localStorage ──────────────────────────────
  const { data: examData } = useExam(id);
  const exam = examData?.data?.data;

  const submissionRef = useRef<Submission | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    const stored = retrieveFromLocalStorage<Submission>(submissionKey(id));
    if (!stored) {
      // No active submission — redirect to start
      router.replace(`/exam/${id}`);
      return;
    }
    submissionRef.current = stored;
    setSubmissionId(stored.id);
  }, [id, router]);

  // ── Per-question answers ────────────────────────────────────────────────────
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const answersRef = useRef<Record<string, string>>({});

  // Keep ref in sync so interval callbacks always see latest answers
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // ── Violations ──────────────────────────────────────────────────────────────
  const [violationCount, setViolationCount] = useState(0);
  const violationRef = useRef(0);

  // ── Timer ───────────────────────────────────────────────────────────────────
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Save status ─────────────────────────────────────────────────────────────
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // ── Mutations ───────────────────────────────────────────────────────────────
  const { mutate: saveAnswer } = useSaveAnswer();
  const { mutate: submitExam, isPending: isSubmitting } = useSubmitExam(() => {
    // Clear submission from localStorage on success
    localStorage.removeItem(submissionKey(id));
    router.replace(`/exam/${id}/result`);
  });
  const { mutate: logViolation } = useLogViolation();

  // ── Init timer from server startedAt ───────────────────────────────────────
  useEffect(() => {
    if (!exam || !submissionRef.current) return;
    const startedAt = new Date(submissionRef.current.startedAt).getTime();
    const totalSeconds = exam.durationMinutes * 60;
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    const remaining = Math.max(totalSeconds - elapsed, 0);
    setSecondsLeft(remaining);
    setViolationCount(submissionRef.current.violationCount);
    violationRef.current = submissionRef.current.violationCount;
  }, [exam]);

  // ── Countdown tick ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (secondsLeft === null) return;
    if (secondsLeft <= 0) {
      handleAutoSubmit("Time is up");
      return;
    }
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timerRef.current!);
          handleAutoSubmit("Time is up");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft === null ? null : "ready"]);

  // ── Auto-save every 30s ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!submissionId || !exam?.questions?.length) return;
    const interval = setInterval(() => {
      saveCurrentAnswer(true);
    }, 30_000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId, exam]);

  // ── Anti-cheat: tab switch ──────────────────────────────────────────────────
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden) recordViolation("tab_switch");
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId]);

  // ── Anti-cheat: clipboard ──────────────────────────────────────────────────
  useEffect(() => {
    function handleCopy() {
      recordViolation("copy");
    }
    function handlePaste() {
      recordViolation("paste");
    }
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId]);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function recordViolation(reason: string) {
    if (!submissionId) return;
    violationRef.current += 1;
    setViolationCount(violationRef.current);
    logViolation({ submissionId, reason });

    if (violationRef.current >= 3) {
      toast.error("3 violations reached — submitting automatically.");
      handleAutoSubmit("3 violations");
    } else {
      toast.error(`Violation recorded: ${reason.replace("_", " ")} (${violationRef.current}/3)`);
    }
  }

  const saveCurrentAnswer = useCallback(
    (silent = false) => {
      if (!submissionId || !exam?.questions?.length) return;
      const questions = exam.questions!;
      const q = questions[currentIndex];
      if (!q) return;
      const code = answersRef.current[q.id] ?? "";
      if (!code.trim()) return;

      if (!silent) setIsSaving(true);
      saveAnswer(
        { submissionId, questionId: q.id, code },
        {
          onSuccess: () => {
            setLastSaved(new Date());
            if (!silent) setIsSaving(false);
          },
          onError: () => {
            if (!silent) setIsSaving(false);
          },
        }
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [submissionId, exam, currentIndex]
  );

  function handleAutoSubmit(_reason?: string) {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!submissionId) return;
    // Save all answers before submitting
    if (exam?.questions) {
      exam.questions.forEach((q) => {
        const code = answersRef.current[q.id] ?? "";
        if (code.trim()) {
          saveAnswer({ submissionId, questionId: q.id, code });
        }
      });
    }
    submitExam(submissionId);
  }

  function handleManualSubmit() {
    if (!submissionId) return;
    saveCurrentAnswer(true);
    submitExam(submissionId);
  }

  function switchQuestion(index: number) {
    // Save current answer before switching
    saveCurrentAnswer(true);
    setCurrentIndex(index);
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  if (!exam || secondsLeft === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
        <Loader2 size={32} className="animate-spin text-slate-500" />
      </div>
    );
  }

  const questions: Question[] = exam.questions ?? [];
  const currentQuestion = questions[currentIndex];
  const monacoLanguage =
    LANGUAGE_MAP[exam.languageName.toLowerCase()] ?? "plaintext";
  const timerWarning = secondsLeft <= 300; // last 5 minutes

  return (
    <div className="flex flex-col h-screen bg-[#0d1117] overflow-hidden">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-5 py-3 bg-[#161b22] border-b border-slate-700/60 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-bold tracking-widest text-slate-500 uppercase hidden sm:block">
            Proctura
          </span>
          <span className="text-slate-600 hidden sm:block">·</span>
          <h1 className="font-plus font-semibold text-white truncate text-sm sm:text-base">
            {exam.title}
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Violations */}
          {violationCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <AlertTriangle size={13} />
              {violationCount}/3 violations
            </div>
          )}

          {/* Timer */}
          <div
            className={`flex items-center gap-1.5 text-sm font-mono font-bold px-3 py-1.5 rounded-lg ${
              timerWarning
                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                : "bg-slate-800 text-slate-200"
            }`}
          >
            <Clock size={13} />
            {formatTime(secondsLeft)}
          </div>

          {/* Submit */}
          <button
            onClick={handleManualSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
          >
            {isSubmitting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <CheckCircle2 size={13} />
            )}
            Submit
          </button>
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">
        {/* Question navigator */}
        <aside className="w-16 sm:w-20 bg-[#161b22] border-r border-slate-700/60 flex flex-col items-center py-4 gap-2 overflow-y-auto flex-shrink-0">
          {questions.map((q, i) => {
            const hasAnswer = !!(answers[q.id] ?? "").trim();
            const isActive = i === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => switchQuestion(i)}
                title={`Question ${i + 1}`}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition-colors flex items-center justify-center ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : hasAnswer
                    ? "bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </aside>

        {/* Main editor area */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Question body */}
          <div className="px-5 py-4 bg-[#161b22] border-b border-slate-700/60 flex-shrink-0 max-h-40 overflow-y-auto">
            {currentQuestion ? (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Question {currentIndex + 1} of {questions.length}
                    </span>
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded">
                      {currentQuestion.points} pts
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {currentQuestion.body}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No questions in this exam.</p>
            )}
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0">
            {currentQuestion && (
              <MonacoEditor
                height="100%"
                language={monacoLanguage}
                theme="vs-dark"
                value={answers[currentQuestion.id] ?? ""}
                onChange={(value) => {
                  setAnswers((prev) => ({
                    ...prev,
                    [currentQuestion.id]: value ?? "",
                  }));
                }}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  tabSize: 4,
                  renderWhitespace: "selection",
                  contextmenu: false,
                  lineNumbersMinChars: 3,
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="flex items-center justify-between px-5 py-2 bg-[#161b22] border-t border-slate-700/60 text-xs text-slate-500 flex-shrink-0">
        <div className="flex items-center gap-3">
          {isSaving ? (
            <span className="flex items-center gap-1.5 text-slate-400">
              <Loader2 size={11} className="animate-spin" /> Saving…
            </span>
          ) : lastSaved ? (
            <span className="flex items-center gap-1.5">
              <Save size={11} />
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          ) : (
            <span>Not saved yet</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Prev / Next */}
          <button
            onClick={() => switchQuestion(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft size={13} /> Prev
          </button>
          <button
            onClick={() =>
              switchQuestion(Math.min(questions.length - 1, currentIndex + 1))
            }
            disabled={currentIndex >= questions.length - 1}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            Next <ChevronRight size={13} />
          </button>

          <button
            onClick={() => saveCurrentAnswer(false)}
            disabled={isSaving}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 disabled:opacity-40 transition-colors text-slate-400 hover:text-slate-200"
          >
            <Save size={11} /> Save
          </button>
        </div>
      </footer>
    </div>
  );
}
