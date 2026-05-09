"use client";

import Link from "next/link";
import { Pencil, Trash2, Clock, Calendar, ChevronRight } from "lucide-react";
import type { Exam } from "@/interfaces";

export const STATUS_STYLES: Record<string, string> = {
  draft: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
  scheduled: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300",
  active: "bg-green-pale dark:bg-green/10 text-green",
  closed: "bg-red-50 dark:bg-red-900/20 text-red-500",
};

export function ExamCard({
  exam,
  isStudent,
  onEdit,
  onDelete,
}: {
  exam: Exam;
  isStudent: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {exam.course && (
              <span className="text-xs font-bold font-mono bg-navy/10 dark:bg-navy/30 text-navy dark:text-blue-300 px-2 py-0.5 rounded">
                {exam.course.code}
              </span>
            )}
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${STATUS_STYLES[exam.status]}`}
            >
              {exam.status}
            </span>
          </div>
          <h3 className="font-plus font-semibold text-navy-dark dark:text-white truncate">
            {exam.title}
          </h3>
          <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {exam.durationMinutes} min
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(exam.startsAt).toLocaleDateString()}
            </span>
            <span className="font-mono">{exam.languageName}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {!isStudent && (
            <>
              <Link
                href={`/dashboard/exams/${exam.id}`}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-navy dark:text-blue-300 bg-navy/5 dark:bg-navy/20 rounded-lg hover:bg-navy/10 dark:hover:bg-navy/30 transition-colors"
              >
                Builder <ChevronRight size={12} />
              </Link>
              <button
                onClick={onEdit}
                className="p-1.5 rounded-lg text-slate-400 hover:text-navy dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
          {isStudent && exam.status === "active" && (
            <Link
              href={`/exam/${exam.id}`}
              className="flex items-center gap-1 px-4 py-1.5 text-xs font-bold bg-green text-white rounded-lg hover:bg-green-light transition-colors"
            >
              Start Exam <ChevronRight size={12} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
