"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, BookOpen, Code2, AlertCircle, Loader2 } from "lucide-react";
import { useExam, useAvailableExams } from "@/hooks/services/exams";
import { useStartExam, useMySubmission } from "@/hooks/services/submissions";
import { retrieveFromLocalStorage } from "@/lib/localStorage";
import type { Submission } from "@/interfaces";

function submissionKey(examId: string) {
  return `exam_submission_${examId}`;
}

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

  const [hasResumable, setHasResumable] = useState(false);

  useEffect(() => {
    const stored = retrieveFromLocalStorage<Submission>(submissionKey(id));
    if (stored?.status === "in_progress") setHasResumable(true);
  }, [id]);

  useEffect(() => {
    if (isCheckingAccess || isLoading) return;
    if (!isEnrolled) {
      router.replace(`/exam/${id}`);
    }
  }, [isCheckingAccess, isLoading, isEnrolled, router, id]);

  const { data: mySubmissionData, isLoading: isCheckingSubmission } =
    useMySubmission(id);
  const existingSubmission = mySubmissionData?.data?.data;
  const alreadySubmitted =
    !!existingSubmission && existingSubmission.status !== "in_progress";

  const { mutate: startExam, isPending } = useStartExam((submission) => {
    localStorage.setItem(submissionKey(id), JSON.stringify(submission));
    router.push(`/exam/${id}/take`);
  });

  function handleStart() {
    document.documentElement.requestFullscreen?.().catch(() => { });
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

          {alreadySubmitted ? (
            <div className="mt-6">
              <div className="w-full flex items-center justify-center gap-2 bg-slate-800 text-slate-500 font-semibold py-3 rounded-xl cursor-not-allowed select-none">
                Already submitted
              </div>
            </div>
          ) : (
            <button
              onClick={handleStart}
              disabled={isPending || isCheckingSubmission}
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
