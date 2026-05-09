"use client";

import Link from "next/link";
import { Loader2, BarChart2, ExternalLink } from "lucide-react";
import { useMySubmissions } from "@/hooks/services/submissions";
import type { Submission } from "@/interfaces";

const STATUS_STYLES: Record<string, string> = {
  in_progress: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  submitted: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  graded: "bg-green-500/10 text-green-400 border border-green-500/20",
};

export default function MyResultsPage() {
  const { data, isLoading } = useMySubmissions();
  const submissions: Submission[] = data?.data?.data ?? [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-plus text-2xl font-bold text-navy-dark dark:text-white">
          My Results
        </h1>
        <p className="text-sm text-slate dark:text-slate-400 mt-1">
          Your exam history and scores
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-slate" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <BarChart2 size={24} className="text-slate dark:text-slate-400" />
          </div>
          <h3 className="font-plus font-semibold text-navy-dark dark:text-white mb-2">
            No exams yet
          </h3>
          <p className="text-sm text-slate dark:text-slate-400">
            Results will appear here once you complete an exam.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">
                    Exam
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">
                    Course
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">
                    Score
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">
                    Submitted
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {submissions.map((sub) => (
                  <SubmissionRow key={sub.id} submission={sub} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function SubmissionRow({ submission }: { submission: Submission }) {
  const pct =
    submission.maxScore > 0
      ? Math.round((submission.totalScore / submission.maxScore) * 100)
      : 0;

  const examTitle =
    (
      submission as Submission & {
        exam?: { title: string; course?: { code: string } };
      }
    ).exam?.title ?? "—";
  const courseCode =
    (
      submission as Submission & {
        exam?: { title: string; course?: { code: string } };
      }
    ).exam?.course?.code ?? "—";

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td className="px-5 py-3.5 font-medium text-navy-dark dark:text-white">
        {examTitle}
      </td>
      <td className="px-5 py-3.5 text-slate dark:text-slate-400 font-mono text-xs">
        {courseCode}
      </td>
      <td className="px-5 py-3.5">
        {submission.status === "graded" ? (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-navy-dark dark:text-white">
              {submission.totalScore}/{submission.maxScore}
            </span>
            <span
              className={`text-xs font-medium ${pct >= 50 ? "text-green" : "text-red-500"}`}
            >
              {pct}%
            </span>
          </div>
        ) : (
          <span className="text-slate dark:text-slate-500">—</span>
        )}
      </td>
      <td className="px-5 py-3.5">
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[submission.status]}`}
        >
          {submission.status.replace("_", " ")}
        </span>
      </td>
      <td className="px-5 py-3.5 text-slate dark:text-slate-400 text-xs">
        {submission.submittedAt
          ? new Date(submission.submittedAt).toLocaleString()
          : "—"}
      </td>
      <td className="px-5 py-3.5">
        {submission.status !== "in_progress" && (
          <Link
            href={`/exam/${submission.examId}/result?sid=${submission.id}`}
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            <ExternalLink size={12} />
            View
          </Link>
        )}
      </td>
    </tr>
  );
}
