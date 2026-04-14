"use client";
// src/app/(app)/dashboard/exams/[id]/results/page.tsx
import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Users } from "lucide-react";
import { useExam, useExamResults } from "@/hooks/services/exams";
import type { Submission } from "@/interfaces";

const STATUS_STYLES: Record<string, string> = {
  in_progress: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
  submitted: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300",
  graded: "bg-green-pale dark:bg-green/10 text-green",
};

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: examData } = useExam(id);
  const { data: resultsData, isLoading } = useExamResults(id);

  const exam = examData?.data?.data;
  const submissions: Submission[] = resultsData?.data?.data ?? [];

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/dashboard/exams/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate dark:text-slate-400 hover:text-navy dark:hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={14} /> Back to Builder
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-plus text-2xl font-bold text-navy-dark dark:text-white">
              Results
            </h1>
            {exam && (
              <p className="text-sm text-slate dark:text-slate-400 mt-1">
                {exam.title} · {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-slate" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-slate dark:text-slate-400" />
          </div>
          <h3 className="font-plus font-semibold text-navy-dark dark:text-white mb-2">No submissions yet</h3>
          <p className="text-sm text-slate dark:text-slate-400">
            Results will appear here once students start and submit the exam.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">Student</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">Matric No.</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">Score</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">Violations</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {submissions.map((sub) => (
                  <ResultRow key={sub.id} submission={sub} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultRow({ submission }: { submission: Submission }) {
  const pct = submission.maxScore > 0
    ? Math.round((submission.totalScore / submission.maxScore) * 100)
    : 0;

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td className="px-5 py-3.5 font-medium text-navy-dark dark:text-white">
        {(submission as Submission & { student?: { firstName: string; lastName: string } }).student
          ? `${(submission as any).student.firstName} ${(submission as any).student.lastName}`
          : "—"}
      </td>
      <td className="px-5 py-3.5 text-slate dark:text-slate-400 font-mono text-xs">
        {(submission as any).student?.matricNumber ?? "—"}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-navy-dark dark:text-white">
            {submission.totalScore}/{submission.maxScore}
          </span>
          <span className={`text-xs font-medium ${pct >= 50 ? "text-green" : "text-red-500"}`}>
            {pct}%
          </span>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${STATUS_STYLES[submission.status]}`}>
          {submission.status.replace("_", " ")}
        </span>
      </td>
      <td className="px-5 py-3.5 text-slate dark:text-slate-400">
        {submission.violationCount > 0 ? (
          <span className="text-orange-500 font-semibold">{submission.violationCount}</span>
        ) : (
          <span>0</span>
        )}
      </td>
      <td className="px-5 py-3.5 text-slate dark:text-slate-400">
        {submission.submittedAt
          ? new Date(submission.submittedAt).toLocaleString()
          : "—"}
      </td>
    </tr>
  );
}
