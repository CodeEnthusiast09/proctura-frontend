"use client";
// src/app/(app)/dashboard/courses/page.tsx
import { GraduationCap, Plus } from "lucide-react";

export default function CoursesPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-plus text-2xl font-bold text-navy-dark dark:text-white">
            Courses
          </h1>
          <p className="text-sm text-slate dark:text-slate-400 mt-1">
            Manage your courses and link exams to them
          </p>
        </div>
        <button className="flex items-center gap-2 bg-navy dark:bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 transition-colors">
          <Plus size={16} />
          New Course
        </button>
      </div>

      {/* Empty state */}
      <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
          <GraduationCap size={24} className="text-slate dark:text-slate-400" />
        </div>
        <h3 className="font-plus font-semibold text-navy-dark dark:text-white mb-2">
          No courses yet
        </h3>
        <p className="text-sm text-slate dark:text-slate-400">
          Create your first course to start adding exams.
        </p>
      </div>
    </div>
  );
}
