"use client";

import Link from "next/link";
import type { AllResultsRow } from "@/interfaces";

export const STATUS_STYLES: Record<string, string> = {
  in_progress: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  submitted: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  graded: "bg-green-500/10 text-green-400 border border-green-500/20",
};

export function ResultRow({ row }: { row: AllResultsRow }) {
  const pct =
    row.maxScore > 0 ? Math.round((row.totalScore / row.maxScore) * 100) : 0;

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td className="px-5 py-3.5 font-medium text-navy-dark dark:text-white">
        {row.student ? `${row.student.firstName} ${row.student.lastName}` : "—"}
      </td>
      <td className="px-5 py-3.5 text-slate dark:text-slate-400 font-mono text-xs">
        {row.student?.matricNumber ?? "—"}
      </td>
      <td className="px-5 py-3.5 text-slate dark:text-slate-400 font-mono text-xs">
        {row.courseCode || "—"}
      </td>
      <td className="px-5 py-3.5 text-slate dark:text-slate-200 max-w-50 truncate">
        {row.examTitle || "—"}
      </td>
      <td className="px-5 py-3.5">
        {row.status === "graded" ? (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-navy-dark dark:text-white">
              {row.totalScore}/{row.maxScore}
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
          className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[row.status]}`}
        >
          {row.status.replace("_", " ")}
        </span>
      </td>
      <td className="px-5 py-3.5 text-slate dark:text-slate-400">
        {row.violationCount > 0 ? (
          <span className="text-orange-500 font-semibold">
            {row.violationCount}
          </span>
        ) : (
          <span>0</span>
        )}
      </td>
      <td className="px-5 py-3.5 text-slate dark:text-slate-400 text-xs">
        {row.submittedAt ? new Date(row.submittedAt).toLocaleString() : "—"}
      </td>
      <td className="px-5 py-3.5">
        <Link
          href={`/dashboard/exams/${row.examId}/results`}
          className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          View exam
        </Link>
      </td>
    </tr>
  );
}
