"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import {
  useCourseEnrollments,
  useEnrollStudents,
  useUnenrollStudent,
} from "@/hooks/services/courses";
import type { Course } from "@/interfaces";

export function EnrollModal({
  course,
  onClose,
}: {
  course: Course;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const { data, isLoading } = useCourseEnrollments(course.id);
  const enrollments = data?.data?.data ?? [];
  const { mutate: enroll, isPending: isEnrolling } = useEnrollStudents(
    course.id,
    () => setInput(""),
  );
  const { mutate: unenroll } = useUnenrollStudent(course.id);

  function handleEnroll() {
    const matrics = input
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (matrics.length === 0) return;
    enroll(matrics);
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={`Enroll Students — ${course.code}`}
      size="md"
    >
      <div className="space-y-4">
        {/* Add students */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            Matric numbers{" "}
            <span className="font-normal text-slate-400">
              (one per line, or comma-separated)
            </span>
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            placeholder={"CSC/2021/001\nCSC/2021/002\nCSC/2021/003"}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
          />
          <button
            onClick={handleEnroll}
            disabled={isEnrolling || !input.trim()}
            className="mt-2 flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-60 transition-colors"
          >
            {isEnrolling && <Loader2 size={13} className="animate-spin" />}
            Enroll
          </button>
        </div>

        {/* Enrolled students */}
        <div>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
            Enrolled students ({enrollments.length})
          </p>
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 size={18} className="animate-spin text-slate-400" />
            </div>
          ) : enrollments.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">
              No students enrolled yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-700 max-h-52 overflow-y-auto rounded-lg border border-slate-100 dark:border-slate-700">
              {enrollments.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {e.student?.firstName} {e.student?.lastName}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      {e.student?.matricNumber ?? e.student?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => e.studentId && unenroll(e.studentId)}
                    className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Remove"
                  >
                    <X size={13} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}
