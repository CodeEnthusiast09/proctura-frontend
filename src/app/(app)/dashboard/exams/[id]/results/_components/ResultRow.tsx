"use client";

import { Code2 } from "lucide-react";
import type { Submission } from "@/interfaces";

export const STATUS_STYLES: Record<string, string> = {
  in_progress:
    "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
  submitted: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300",
  graded: "bg-green-pale dark:bg-green/10 text-green",
};

export function ResultRow({
  submission,
  onReview,
}: {
  submission: Submission;
  onReview: () => void;
}) {
  const pct =
    submission.maxScore > 0
      ? Math.round((submission.totalScore / submission.maxScore) * 100)
      : 0;

  const canReview =
    submission.status === "submitted" || submission.status === "graded";

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td className="px-5 py-3.5 font-medium text-navy-dark dark:text-white">
        {submission.student
          ? `${submission.student.firstName} ${submission.student.lastName}`
          : "—"}
      </td>
      <td className="px-5 py-3.5 text-slate dark:text-slate-400 font-mono text-xs">
        {submission.student?.matricNumber ?? "—"}
      </td>
      <td className="px-5 py-3.5">
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
      </td>
      <td className="px-5 py-3.5">
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${STATUS_STYLES[submission.status]}`}
        >
          {submission.status.replace("_", " ")}
        </span>
      </td>
      <td className="px-5 py-3.5 text-slate dark:text-slate-400">
        {submission.violationCount > 0 ? (
          <span className="text-orange-500 font-semibold">
            {submission.violationCount}
          </span>
        ) : (
          "0"
        )}
      </td>
      <td className="px-5 py-3.5 text-slate dark:text-slate-400">
        {submission.submittedAt
          ? new Date(submission.submittedAt).toLocaleString()
          : "—"}
      </td>
      <td className="px-5 py-3.5">
        {canReview && (
          <button
            onClick={onReview}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            <Code2 size={12} /> Review Code
          </button>
        )}
      </td>
    </tr>
  );
}
