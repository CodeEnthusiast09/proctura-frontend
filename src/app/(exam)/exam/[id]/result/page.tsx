"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, LogOut, Clock } from "lucide-react";
import { useSubmissionResult } from "@/hooks/services/submissions";
import { useExam } from "@/hooks/services/exams";
import { removeFromLocalStorage } from "@/lib/localStorage";

export default function ExamResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    const sid = searchParams.get("sid");
    if (sid) setSubmissionId(sid);
  }, [searchParams]);

  const { data, isLoading } = useSubmissionResult(submissionId);
  const result = data?.data?.data;

  const { data: examData } = useExam(id);
  const exam = examData?.data?.data;

  const resultsReleased = exam?.resultsReleased ?? false;

  const pct =
    result && result.maxScore > 0
      ? Math.round((result.totalScore / result.maxScore) * 100)
      : 0;

  const passed = pct >= 50;

  function handleLogout() {
    removeFromLocalStorage("token");
    removeFromLocalStorage("user");
    removeFromLocalStorage("subdomain");
    setLoggedOut(true);
  }

  if (loggedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <p className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-8">
            Proctura
          </p>
          <div className="bg-[#161b22] border border-slate-700/60 rounded-2xl p-12">
            <CheckCircle2 size={40} className="text-green-400 mx-auto mb-4" />
            <h1 className="font-plus text-xl font-bold text-white mb-2">
              You&apos;ve been logged out
            </h1>
            <p className="text-sm text-slate-400">
              You can safely close this window.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <p className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-8">
          Proctura
        </p>

        {isLoading || !result ? (
          <div className="bg-[#161b22] border border-slate-700/60 rounded-2xl p-12">
            <Loader2
              size={32}
              className="animate-spin text-slate-500 mx-auto mb-4"
            />
            <p className="text-slate-400 text-sm">Loading your results…</p>
          </div>
        ) : result.status === "submitted" ? (
          <div className="bg-[#161b22] border border-slate-700/60 rounded-2xl p-12">
            <Loader2
              size={32}
              className="animate-spin text-blue-400 mx-auto mb-4"
            />
            <p className="text-white font-semibold mb-1">
              Grading in progress…
            </p>
            <p className="text-slate-400 text-sm">
              Your code is being evaluated. This usually takes a few seconds.
            </p>
          </div>
        ) : !resultsReleased ? (
          <div className="bg-[#161b22] border border-slate-700/60 rounded-2xl p-8">
            <Clock size={44} className="text-blue-400 mx-auto mb-4" />

            <h1 className="font-plus text-2xl font-bold text-white mb-1">
              Exam submitted
            </h1>
            <p className="text-slate-400 text-sm mb-6">
              Your exam has been submitted successfully. Results will be
              available once your lecturer releases them.
            </p>

            <div className="grid grid-cols-2 gap-3 text-sm mb-6">
              <div className="bg-slate-800/40 rounded-lg p-3">
                <p className="text-slate-500 text-xs mb-0.5">Status</p>
                <p className="font-semibold text-slate-200 capitalize">
                  {result.status.replace("_", " ")}
                </p>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-3">
                <p className="text-slate-500 text-xs mb-0.5">Violations</p>
                <p
                  className={`font-semibold ${result.violationCount > 0
                      ? "text-amber-400"
                      : "text-slate-200"
                    }`}
                >
                  {result.violationCount}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              <LogOut size={14} />
              Log Out
            </button>
          </div>
        ) : (
          <div className="bg-[#161b22] border border-slate-700/60 rounded-2xl p-8">
            {passed ? (
              <CheckCircle2 size={52} className="text-green-400 mx-auto mb-4" />
            ) : (
              <XCircle size={52} className="text-red-400 mx-auto mb-4" />
            )}

            <h1 className="font-plus text-2xl font-bold text-white mb-1">
              {passed ? "Well done!" : "Better luck next time"}
            </h1>
            <p className="text-slate-400 text-sm mb-6">
              Your exam has been submitted.
            </p>

            <div className="bg-slate-800/60 rounded-xl p-5 mb-5">
              <p className="text-5xl font-plus font-extrabold text-white mb-1">
                {pct}%
              </p>
              <p className="text-slate-400 text-sm">
                {result.totalScore} / {result.maxScore} points
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-6">
              <div className="bg-slate-800/40 rounded-lg p-3">
                <p className="text-slate-500 text-xs mb-0.5">Status</p>
                <p className="font-semibold text-slate-200 capitalize">
                  {result.status.replace("_", " ")}
                </p>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-3">
                <p className="text-slate-500 text-xs mb-0.5">Violations</p>
                <p
                  className={`font-semibold ${result.violationCount > 0
                      ? "text-amber-400"
                      : "text-slate-200"
                    }`}
                >
                  {result.violationCount}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              <LogOut size={14} />
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
