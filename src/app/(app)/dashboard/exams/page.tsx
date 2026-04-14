"use client";
// src/app/(app)/dashboard/exams/page.tsx
import { BookOpen } from "lucide-react";
import { useCurrentUser } from "@/hooks/common/useCurrentUser";

export default function ExamsPage() {
  const user = useCurrentUser();
  const isStudent = user?.role === "student";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-plus text-2xl font-bold text-navy-dark dark:text-white">
            {isStudent ? "My Exams" : "Exams"}
          </h1>
          <p className="text-sm text-slate dark:text-slate-400 mt-1">
            {isStudent
              ? "View and take your scheduled exams"
              : "Manage exams across your courses"}
          </p>
        </div>
        {!isStudent && (
          <button className="flex items-center gap-2 bg-navy dark:bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 transition-colors">
            <BookOpen size={16} />
            New Exam
          </button>
        )}
      </div>

      {/* Empty state */}
      <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
          <BookOpen size={24} className="text-slate dark:text-slate-400" />
        </div>
        <h3 className="font-plus font-semibold text-navy-dark dark:text-white mb-2">
          No exams yet
        </h3>
        <p className="text-sm text-slate dark:text-slate-400">
          {isStudent
            ? "No exams have been scheduled for you yet."
            : "Create your first exam to get started."}
        </p>
      </div>
    </div>
  );
}
