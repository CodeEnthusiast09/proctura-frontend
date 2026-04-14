"use client";
// src/app/(app)/dashboard/results/page.tsx
import { LayoutDashboard } from "lucide-react";

export default function ResultsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-plus text-2xl font-bold text-navy-dark dark:text-white">
          Results
        </h1>
        <p className="text-sm text-slate dark:text-slate-400 mt-1">
          View submissions and scores for all exams
        </p>
      </div>

      {/* Empty state */}
      <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
          <LayoutDashboard size={24} className="text-slate dark:text-slate-400" />
        </div>
        <h3 className="font-plus font-semibold text-navy-dark dark:text-white mb-2">
          No results yet
        </h3>
        <p className="text-sm text-slate dark:text-slate-400">
          Results will appear here once students complete exams.
        </p>
      </div>
    </div>
  );
}
