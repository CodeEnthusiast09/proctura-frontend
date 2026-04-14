"use client";
// src/app/(app)/dashboard/users/page.tsx
import { Users, UserPlus, Upload } from "lucide-react";

export default function UsersPage() {
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-plus text-2xl font-bold text-navy-dark dark:text-white">
            Users
          </h1>
          <p className="text-sm text-slate dark:text-slate-400 mt-1">
            Manage lecturers and students in your school
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-navy-dark dark:text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:border-navy/30 dark:hover:border-slate-500 transition-colors">
            <Upload size={15} />
            Import CSV
          </button>
          <button className="flex items-center gap-2 bg-navy dark:bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 transition-colors">
            <UserPlus size={15} />
            Invite Lecturer
          </button>
        </div>
      </div>

      {/* Empty state */}
      <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
          <Users size={24} className="text-slate dark:text-slate-400" />
        </div>
        <h3 className="font-plus font-semibold text-navy-dark dark:text-white mb-2">
          No users yet
        </h3>
        <p className="text-sm text-slate dark:text-slate-400">
          Invite lecturers or import students via CSV to get started.
        </p>
      </div>
    </div>
  );
}
