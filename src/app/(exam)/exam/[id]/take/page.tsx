"use client";

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
  Play,
  X,
  CircleCheck,
  CircleX,
} from "lucide-react";
import { useExam } from "@/hooks/services/exams";
import {
  useSaveAnswer,
  useSubmitExam,
  useLogViolation,
  useRunCode,
} from "@/hooks/services/submissions";
import {
  retrieveFromLocalStorage,
  removeFromLocalStorage,
} from "@/lib/localStorage";
import type { Submission, Question, RunCodeResult } from "@/interfaces";
import toast from "react-hot-toast";
import { useRecording } from "./_hooks/useRecording";
import { useAntiCheat } from "./_hooks/useAntiCheat";

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

  // ── Run Code state ──────────────────────────────────────────────────────────
  const [runResults, setRunResults] = useState<RunCodeResult[] | null>(null);
  const [showRunPanel, setShowRunPanel] = useState(false);

  // ── Mutations ───────────────────────────────────────────────────────────────
  const { mutate: saveAnswer } = useSaveAnswer();
  const { mutate: submitExam, isPending: isSubmitting } = useSubmitExam();
  const { mutate: logViolation } = useLogViolation();
  const { mutate: runCode, isPending: isRunning } = useRunCode();
  const [isHandlingSubmit, setIsHandlingSubmit] = useState(false);

  const {
    previewVideoRef,
    isRecording,
    requestingCameraRef,
    stopRecorder,
    uploadAndAttach,
  } = useRecording(submissionId);
  useAntiCheat({
    submissionId,
    requestingCameraRef,
    onViolation: recordViolation,
  });

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

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function recordViolation(reason: string) {
    if (!submissionId) return;
    violationRef.current += 1;
    setViolationCount(violationRef.current);

    if (violationRef.current >= 3) {
      toast.error("3 violations reached — submitting automatically.");
      // logViolation auto-submits on the backend; we just need to navigate after
      logViolation(
        { submissionId, reason },
        {
          onSuccess: () => handleAutoSubmit("3 violations"),
          onError: () => handleAutoSubmit("3 violations"),
        },
      );
    } else {
      logViolation({ submissionId, reason });
      toast.error(
        `Violation recorded: ${reason.replace("_", " ")} (${violationRef.current}/3)`,
      );
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
        },
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [submissionId, exam, currentIndex],
  );

  // Clears the student's session and hard-reloads to /exam/[id], which the
  // ExamLayout will render as StudentAuth — ready for the next CBT student.
  async function logoutAndReset(subId: string, blob: Blob | null) {
    if (blob) {
      try {
        await uploadAndAttach(subId, blob);
      } catch {
        // best-effort — recording attachment is non-critical
      }
    }
    localStorage.removeItem(submissionKey(id));
    removeFromLocalStorage("token");
    removeFromLocalStorage("user");
    removeFromLocalStorage("subdomain");
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => { });
    }
    // Land on the picker, not the same exam — the next CBT student should see
    // their own exam list after logging in, not be stuck on the previous one.
    window.location.replace(`/exam`);
  }

  async function handleAutoSubmit(reason?: string) {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!submissionId) return;

    // Collect the blob now — before navigation unmounts the component and
    // the cleanup stops the stream tracks, making the MediaRecorder inactive.
    const blob = await stopRecorder();
    const subId = submissionId;

    if (reason === "3 violations") {
      await logoutAndReset(subId, blob);
      return;
    }

    // Save all answers before submitting (timer expiry path)
    if (exam?.questions) {
      exam.questions.forEach((q) => {
        const code = answersRef.current[q.id] ?? "";
        if (code.trim()) {
          saveAnswer({ submissionId: subId, questionId: q.id, code });
        }
      });
    }

    submitExam(
      { submissionId: subId },
      {
        onSuccess: () => logoutAndReset(subId, blob),
        onError: () => logoutAndReset(subId, blob),
      },
    );
  }

  async function handleManualSubmit() {
    if (!submissionId || isHandlingSubmit) return;
    setIsHandlingSubmit(true);
    saveCurrentAnswer(true);

    // Collect the blob before navigation so the stream is still active.
    const blob = await stopRecorder();
    const subId = submissionId;

    submitExam(
      { submissionId: subId },
      {
        onSuccess: () => logoutAndReset(subId, blob),
        onError: () => {
          setIsHandlingSubmit(false);
        },
      },
    );
  }

  function handleRunCode() {
    if (!submissionId || !currentQuestion) return;
    const code = answers[currentQuestion.id] ?? "";
    if (!code.trim()) {
      toast.error("Write some code first before running.");
      return;
    }
    setShowRunPanel(true);
    setRunResults(null);
    runCode(
      { submissionId, questionId: currentQuestion.id, code },
      {
        onSuccess: (res) => setRunResults(res.data?.data ?? []),
        onError: () => toast.error("Failed to run code. Try again."),
      },
    );
  }

  function switchQuestion(index: number) {
    saveCurrentAnswer(true);
    setCurrentIndex(index);
    setRunResults(null);
    setShowRunPanel(false);
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
      <header className="flex items-center justify-between px-5 py-3 bg-[#161b22] border-b border-slate-700/60 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-bold tracking-widest text-slate-500 uppercase hidden sm:block">
            Proctura
          </span>
          <span className="text-slate-600 hidden sm:block">·</span>
          <h1 className="font-plus font-semibold text-white truncate text-sm sm:text-base">
            {exam.title}
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Recording indicator */}
          {isRecording && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              REC
            </div>
          )}

          {/* Violations */}
          {violationCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <AlertTriangle size={13} />
              {violationCount}/3 violations
            </div>
          )}

          {/* Timer */}
          <div
            className={`flex items-center gap-1.5 text-sm font-mono font-bold px-3 py-1.5 rounded-lg ${timerWarning
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
            disabled={isSubmitting || isHandlingSubmit}
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
        <aside className="w-16 sm:w-20 bg-[#161b22] border-r border-slate-700/60 flex flex-col items-center py-4 gap-2 overflow-y-auto shrink-0">
          {questions.map((q, i) => {
            const hasAnswer = !!(answers[q.id] ?? "").trim();
            const isActive = i === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => switchQuestion(i)}
                title={`Question ${i + 1}`}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition-colors flex items-center justify-center ${isActive
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
          <div className="px-5 py-4 bg-[#161b22] border-b border-slate-700/60 shrink-0 max-h-72 overflow-y-auto">
            {currentQuestion ? (
              <div>
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

                {/* Public test cases as examples */}
                {currentQuestion.testCases &&
                  currentQuestion.testCases.filter((tc) => !tc.isHidden)
                    .length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Examples
                      </p>
                      {currentQuestion.testCases
                        .filter((tc) => !tc.isHidden)
                        .map((tc, i) => (
                          <div
                            key={tc.id}
                            className="flex gap-2 text-xs font-mono"
                          >
                            {tc.input != null && (
                              <div className="flex-1 bg-slate-800/80 border border-slate-700/50 rounded-lg p-2.5">
                                <p className="text-slate-500 mb-1">
                                  Input {i + 1}
                                </p>
                                <pre className="text-slate-300 whitespace-pre-wrap">
                                  {tc.input}
                                </pre>
                              </div>
                            )}
                            <div className="flex-1 bg-slate-800/80 border border-slate-700/50 rounded-lg p-2.5">
                              <p className="text-slate-500 mb-1">
                                Expected Output
                              </p>
                              <pre className="text-slate-300 whitespace-pre-wrap">
                                {tc.expectedOutput}
                              </pre>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">
                No questions in this exam.
              </p>
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

          {/* Run Code Results Panel */}
          {showRunPanel && (
            <div className="h-48 shrink-0 bg-[#0d1117] border-t border-slate-700/60 flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700/60">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Test Results
                </span>
                <button
                  onClick={() => setShowRunPanel(false)}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-2">
                {isRunning || !runResults ? (
                  <div className="flex items-center gap-2 text-slate-400 text-sm h-full">
                    <Loader2 size={14} className="animate-spin" />
                    Running against public test cases…
                  </div>
                ) : runResults.length === 0 ? (
                  <p className="text-slate-500 text-sm">
                    No public test cases to run against.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {runResults.map((r, i) => (
                      <div
                        key={r.testCaseId}
                        className={`flex items-start gap-3 p-2.5 rounded-lg border text-xs font-mono ${r.passed
                            ? "bg-green-500/5 border-green-500/20"
                            : "bg-red-500/5 border-red-500/20"
                          }`}
                      >
                        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                          {r.passed ? (
                            <CircleCheck size={13} className="text-green-400" />
                          ) : (
                            <CircleX size={13} className="text-red-400" />
                          )}
                          <span
                            className={
                              r.passed ? "text-green-400" : "text-red-400"
                            }
                          >
                            Test {i + 1}
                          </span>
                        </div>
                        {!r.passed && (
                          <div className="flex gap-3 flex-1 min-w-0">
                            <div className="min-w-0">
                              <p className="text-slate-500 mb-0.5">Expected</p>
                              <pre className="text-slate-300 whitespace-pre-wrap break-all">
                                {r.expectedOutput}
                              </pre>
                            </div>
                            <div className="min-w-0">
                              <p className="text-slate-500 mb-0.5">Got</p>
                              <pre className="text-red-300 whitespace-pre-wrap break-all">
                                {r.actualOutput || r.statusDesc}
                              </pre>
                            </div>
                          </div>
                        )}
                        {r.passed && (
                          <span className="text-green-400/70">Passed</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="flex items-center justify-between px-5 py-2 bg-[#161b22] border-t border-slate-700/60 text-xs text-slate-500 shrink-0">
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

        <div className="flex items-center gap-2">
          {/* Prev / Next */}
          <button
            onClick={() => switchQuestion(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors text-slate-300"
          >
            <ChevronLeft size={15} /> Prev
          </button>
          <button
            onClick={() =>
              switchQuestion(Math.min(questions.length - 1, currentIndex + 1))
            }
            disabled={currentIndex >= questions.length - 1}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors text-slate-300"
          >
            Next <ChevronRight size={15} />
          </button>

          <button
            onClick={() => saveCurrentAnswer(false)}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors text-slate-300 hover:text-white"
          >
            <Save size={14} /> Save
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning || !submissionId || !currentQuestion}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/25 hover:border-emerald-500/50 disabled:opacity-40 transition-colors text-sm font-semibold"
          >
            {isRunning ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Play size={14} />
            )}
            Run Code
          </button>
        </div>
      </footer>

      {/* ── Webcam preview ────────────────────────────────────────────────── */}
      {isRecording && (
        <div className="fixed bottom-14 left-4 z-50">
          <video
            ref={previewVideoRef}
            autoPlay
            muted
            playsInline
            className="w-72 h-48 rounded-xl object-cover border-2 border-red-500/60 bg-black shadow-lg"
          />
          <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-black/60 rounded px-1.5 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold text-red-400 tracking-wide">
              REC
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
