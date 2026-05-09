"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Users, Search, Eye, EyeOff } from "lucide-react";
import {
  useExam,
  useExamResults,
  useReleaseResults,
} from "@/hooks/services/exams";
import { useCurrentUser } from "@/hooks/common/useCurrentUser";
import type { Submission } from "@/interfaces";
import { ResultRow } from "./_components/ResultRow";
import { ReviewDrawer } from "./_components/ReviewDrawer";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const user = useCurrentUser();
  const canManage = user?.role === "lecturer";
  const [search, setSearch] = useState("");
  const [reviewId, setReviewId] = useState<string | null>(null);

  const { data: examData } = useExam(id);
  const { data: resultsData, isLoading } = useExamResults(id);
  const releaseResults = useReleaseResults(id);

  const exam = examData?.data?.data;
  const resultsReleased = exam?.resultsReleased ?? false;
  const allSubmissions: Submission[] = resultsData?.data?.data ?? [];

  const q = search.toLowerCase();
  const submissions = q
    ? allSubmissions.filter((s) => {
      const name =
        `${s.student?.firstName ?? ""} ${s.student?.lastName ?? ""}`.toLowerCase();
      const matric = (s.student?.matricNumber ?? "").toLowerCase();
      return name.includes(q) || matric.includes(q);
    })
    : allSubmissions;

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/dashboard/exams/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate dark:text-slate-400 hover:text-navy dark:hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={14} /> Back to Builder
        </Link>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-plus text-2xl font-bold text-navy-dark dark:text-white">
              Results
            </h1>
            {exam && (
              <p className="text-sm text-slate dark:text-slate-400 mt-1">
                {exam.title} · {submissions.length} of {allSubmissions.length}{" "}
                submission{allSubmissions.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {canManage && (
              <button
                onClick={() => releaseResults.mutate(!resultsReleased)}
                disabled={releaseResults.isPending}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 ${
                  resultsReleased
                    ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                    : "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                }`}
              >
                {resultsReleased ? <EyeOff size={14} /> : <Eye size={14} />}
                {resultsReleased ? "Hide Results" : "Release Results"}
              </button>
            )}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search student name or matric…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-navy-dark dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 w-64"
              />
            </div>
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
          <h3 className="font-plus font-semibold text-navy-dark dark:text-white mb-2">
            No submissions yet
          </h3>
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
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">
                    Student
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">
                    Matric No.
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">
                    Score
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">
                    Violations
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">
                    Submitted
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {submissions.map((sub) => (
                  <ResultRow
                    key={sub.id}
                    submission={sub}
                    onReview={() => setReviewId(sub.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reviewId && (
        <ReviewDrawer
          submissionId={reviewId}
          examId={id}
          examLanguage={exam?.languageName ?? ""}
          onClose={() => setReviewId(null)}
        />
      )}
    </div>
  );
}
