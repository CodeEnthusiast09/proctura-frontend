"use client";

import { use, useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  BookOpen,
  Code2,
  AlertCircle,
  Loader2,
  Camera,
  CheckCircle2,
} from "lucide-react";
import { useExam, useAvailableExams } from "@/hooks/services/exams";
import { useStartExam, useMySubmission } from "@/hooks/services/submissions";
import { retrieveFromLocalStorage } from "@/lib/localStorage";
import type { Submission } from "@/interfaces";

function submissionKey(examId: string) {
  return `exam_submission_${examId}`;
}

// localStorage only changes here via this component's own write, which always
// coincides with the server query resolving, so there is nothing to subscribe to.
const noSubscription = () => () => {};

type CameraStatus = "checking" | "ready" | "denied";

export default function ExamStartPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data: examData, isLoading } = useExam(id);
  const exam = examData?.data?.data;

  const { data: availableData, isLoading: isCheckingAccess } =
    useAvailableExams(true);
  const isEnrolled = (availableData?.data?.data ?? []).some((e) => e.id === id);


  // ── Pre-request camera permission ────────────────────────────────────────────
  // Triggering getUserMedia here means the browser prompt fires on this page,
  // not after fullscreen on /take. The browser remembers the grant for the
  // origin, so no second prompt drops the student out of fullscreen mid-exam.
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("checking");
  useEffect(() => {
    let cancelled = false;
    // Every branch resolves asynchronously, including the unsupported one, so
    // no state is written during the effect body itself.
    Promise.resolve()
      .then(() => {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
        return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      })
      .then((stream) => {
        // Stop tracks immediately — we only wanted the permission grant.
        stream.getTracks().forEach((t) => t.stop());
        if (!cancelled) setCameraStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setCameraStatus("denied");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Resume detection ─────────────────────────────────────────────────────────
  // Two paths produce a resumable: a submission already in localStorage (same
  // browser), or an in_progress submission on the server (different browser /
  // cleared storage). The server path is what was causing "you have already
  // started this exam" toasts to spam — clicking Start kept hitting the API.
  // localStorage is an external store. Reading it during render would not match
  // the server render, and reading it in an effect means a setState cascade.
  // useSyncExternalStore serves the server snapshot during hydration and the
  // real value afterwards, with no effect and no duplicated state.
  const storedInProgress = useSyncExternalStore(
    noSubscription,
    () =>
      retrieveFromLocalStorage<Submission>(submissionKey(id))?.status ===
      "in_progress",
    () => false,
  );

  const { data: mySubmissionData, isLoading: isCheckingSubmission } =
    useMySubmission(id);
  const existingSubmission = mySubmissionData?.data?.data;
  const alreadySubmitted =
    !!existingSubmission && existingSubmission.status !== "in_progress";

  // Derived, not stored. Both paths feed this one expression.
  const hasResumable =
    storedInProgress || existingSubmission?.status === "in_progress";

  // Caching the server's submission locally is a real side effect, so it stays
  // in an effect. The resumable flag above is derived, so nothing sets state.
  useEffect(() => {
    if (isCheckingSubmission || !existingSubmission) return;
    if (existingSubmission.status === "in_progress") {
      localStorage.setItem(
        submissionKey(id),
        JSON.stringify(existingSubmission),
      );
    }
  }, [isCheckingSubmission, existingSubmission, id]);

  useEffect(() => {
    if (isCheckingAccess || isLoading) return;
    if (!isEnrolled) {
      router.replace(`/exam/${id}`);
    }
  }, [isCheckingAccess, isLoading, isEnrolled, router, id]);

  const { mutate: startExam, isPending } = useStartExam((submission) => {
    localStorage.setItem(submissionKey(id), JSON.stringify(submission));
    router.push(`/exam/${id}/take`);
  });

  function handleStart() {
    document.documentElement.requestFullscreen?.().catch(() => {});
    if (hasResumable) {
      router.push(`/exam/${id}/take`);
    } else {
      startExam(id);
    }
  }

  if (isLoading || isCheckingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-slate-400" />
      </div>
    );
  }

  if (!isEnrolled) return null;

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
          <p className="text-slate-400">Exam not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <p className="text-center text-sm font-bold tracking-widest text-slate-500 uppercase mb-8">
          Proctura
        </p>

        <div className="bg-[#161b22] border border-slate-700/60 rounded-2xl p-8">
          {exam.course && (
            <span className="text-xs font-bold font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full">
              {exam.course.code}
            </span>
          )}

          <h1 className="font-plus text-2xl font-bold text-white mt-3 mb-1">
            {exam.title}
          </h1>

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {exam.durationMinutes} minutes
            </span>
            <span className="flex items-center gap-1.5">
              <Code2 size={14} />
              {exam.languageName}
            </span>
            {exam.questions && (
              <span className="flex items-center gap-1.5">
                <BookOpen size={14} />
                {exam.questions.length} question
                {exam.questions.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {exam.instructions && (
            <div className="mt-5 p-4 bg-slate-800/60 border border-slate-700/50 rounded-xl">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Instructions
              </p>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {exam.instructions}
              </p>
            </div>
          )}

          <div className="mt-5 flex items-start gap-2.5 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <AlertCircle size={15} className="text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-300 leading-relaxed">
              Do not switch tabs, switch windows, or copy/paste during the exam.
              Each violation is recorded. Three violations will result in
              automatic submission.
            </p>
          </div>

          <CameraStatusPill status={cameraStatus} />

          {alreadySubmitted ? (
            <div className="mt-6">
              <div className="w-full flex items-center justify-center gap-2 bg-slate-800 text-slate-500 font-semibold py-3 rounded-xl cursor-not-allowed select-none">
                Already submitted
              </div>
            </div>
          ) : (
            <button
              onClick={handleStart}
              disabled={
                isPending || isCheckingSubmission || cameraStatus === "checking"
              }
              className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {(isPending || isCheckingSubmission) && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {hasResumable ? "Resume Exam" : "Start Exam"}
            </button>
          )}
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Once you start, the timer begins and cannot be paused.
        </p>
      </div>
    </div>
  );
}

function CameraStatusPill({ status }: { status: CameraStatus }) {
  if (status === "checking") {
    return (
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <Loader2 size={13} className="animate-spin" />
        Checking camera and microphone access…
      </div>
    );
  }
  if (status === "ready") {
    return (
      <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
        <CheckCircle2 size={13} />
        Camera and microphone ready.
      </div>
    );
  }
  return (
    <div className="mt-3 flex items-start gap-2 text-xs text-amber-400">
      <Camera size={13} className="mt-0.5 shrink-0" />
      <span>
        Camera access not granted. You can still take the exam, but the session
        won&apos;t be recorded. To enable recording, allow camera access in your
        browser and reload this page.
      </span>
    </div>
  );
}
