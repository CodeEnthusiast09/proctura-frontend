"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { useAllResults } from "@/hooks/services/submissions";
import { useCourses } from "@/hooks/services/courses";
import { useExams } from "@/hooks/services/exams";
import type { AllResultsRow, Course, Exam } from "@/interfaces";
import { ResultRow } from "./_components/ResultRow";

const STATUSES = [
  { label: "All Statuses", value: "" },
  { label: "In Progress", value: "in_progress" },
  { label: "Submitted", value: "submitted" },
  { label: "Graded", value: "graded" },
];

const PAGE_SIZE = 20;

export default function AllResultsPage() {
  const [courseId, setCourseId] = useState("");
  const [examId, setExamId] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data: coursesData } = useCourses();
  const courses: Course[] = coursesData?.data?.data ?? [];

  const { data: examsData } = useExams(courseId || undefined);
  const exams: Exam[] = examsData?.data?.data ?? [];

  const { data, isLoading } = useAllResults({
    courseId: courseId || undefined,
    examId: examId || undefined,
    status: status || undefined,
    search: debouncedSearch || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const rows: AllResultsRow[] = data?.data?.data ?? [];
  const meta = data?.data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  function handleCourseChange(id: string) {
    setCourseId(id);
    setExamId("");
    setPage(1);
  }

  function handleExamChange(id: string) {
    setExamId(id);
    setPage(1);
  }

  function handleStatusChange(s: string) {
    setStatus(s);
    setPage(1);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-plus text-2xl font-bold text-navy-dark dark:text-white">
          Results
        </h1>
        <p className="text-sm text-slate dark:text-slate-400 mt-1">
          Submissions and scores across all exams
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <select
          value={courseId}
          onChange={(e) => handleCourseChange(e.target.value)}
          className="text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-navy-dark dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} — {c.title}
            </option>
          ))}
        </select>

        <select
          value={examId}
          onChange={(e) => handleExamChange(e.target.value)}
          className="text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-navy-dark dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          <option value="">All Exams</option>
          {exams.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-navy-dark dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

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

        {meta && (
          <span className="ml-auto text-sm text-slate dark:text-slate-400">
            {meta.total} result{meta.total !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-slate" />
        </div>
      ) : rows.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <BarChart2 size={24} className="text-slate dark:text-slate-400" />
          </div>
          <h3 className="font-plus font-semibold text-navy-dark dark:text-white mb-2">
            No results found
          </h3>
          <p className="text-sm text-slate dark:text-slate-400">
            {courseId || examId || status
              ? "Try adjusting your filters."
              : "Results will appear here once students complete exams."}
          </p>
        </div>
      ) : (
        <>
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
                      Course
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">
                      Exam
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
                  {rows.map((row) => (
                    <ResultRow key={row.id} row={row} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-slate dark:text-slate-400">
              <span>
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
