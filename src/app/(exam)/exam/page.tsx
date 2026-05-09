"use client";
// CBT landing route — proctors point lab machines here. Students log in via
// the layout's StudentAuth, then this page shows whichever exams the student
// is currently enrolled in and able to take. No exam ID needed in the URL.

import Link from "next/link";
import { Clock, Code2, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { useAvailableExams } from "@/hooks/services/exams";
import { clearLocalStorage } from "@/lib/localStorage";

export default function ExamLandingPage() {
  const { data, isLoading } = useAvailableExams(true);
  const exams = data?.data?.data ?? [];

  function handleSignOut() {
    clearLocalStorage();
    window.location.replace("/exam");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">
            Proctura
          </p>
          <button
            onClick={handleSignOut}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Sign out
          </button>
        </div>

        <div className="bg-[#161b22] border border-slate-700/60 rounded-2xl p-8">
          <h1 className="font-plus text-xl font-bold text-white mb-1">
            Your exams
          </h1>
          <p className="text-sm text-slate-400 mb-6">
            Select the exam you&apos;ve been told to take.
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-slate-500" />
            </div>
          ) : exams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <AlertCircle size={32} className="text-slate-500 mb-3" />
              <p className="text-sm text-slate-300 mb-1">
                No exams available right now.
              </p>
              <p className="text-xs text-slate-500">
                If your lecturer told you the exam is happening, ask a proctor —
                the exam may not have been opened yet.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {exams.map((exam) => (
                <li key={exam.id}>
                  <Link
                    href={`/exam/${exam.id}`}
                    className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-700/60 bg-slate-800/40 hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {exam.course && (
                          <span className="text-xs font-bold font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                            {exam.course.code}
                          </span>
                        )}
                      </div>
                      <p className="font-plus font-semibold text-white text-sm">
                        {exam.title}
                      </p>
                      <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {exam.durationMinutes} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Code2 size={12} />
                          {exam.languageName}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-slate-500 group-hover:text-white shrink-0 mt-1 transition-colors"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Need help? Speak to your proctor.
        </p>
      </div>
    </div>
  );
}
