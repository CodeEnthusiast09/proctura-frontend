"use client";

import { useState } from "react";
import {
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Users,
} from "lucide-react";
import { useCourses } from "@/hooks/services/courses";
import type { Course } from "@/interfaces";
import { CourseModal } from "./_components/CourseModal";
import { EnrollModal } from "./_components/EnrollModal";
import { DeleteCourse } from "./_components/DeleteCourse";

export default function CoursesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Course | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [enrollTarget, setEnrollTarget] = useState<Course | null>(null);

  const { data, isLoading } = useCourses();
  const courses: Course[] = data?.data?.data ?? [];

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
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 bg-navy dark:bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 transition-colors"
        >
          <Plus size={16} />
          New Course
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-slate" />
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <GraduationCap
              size={24}
              className="text-slate dark:text-slate-400"
            />
          </div>
          <h3 className="font-plus font-semibold text-navy-dark dark:text-white mb-2">
            No courses yet
          </h3>
          <p className="text-sm text-slate dark:text-slate-400">
            Create your first course to start adding exams.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className="inline-block text-xs font-bold font-mono bg-navy/10 dark:bg-navy/30 text-navy dark:text-blue-300 px-2 py-0.5 rounded mb-1.5">
                    {course.code}
                  </span>
                  <h3 className="font-plus font-semibold text-navy-dark dark:text-white text-sm leading-snug">
                    {course.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setEnrollTarget(course)}
                    title="Manage enrollments"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <Users size={14} />
                  </button>
                  <button
                    onClick={() => setEditTarget(course)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-navy dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(course)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate dark:text-slate-500">
                Created {new Date(course.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <CourseModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        mode="create"
      />
      {editTarget && (
        <CourseModal
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          mode="edit"
          course={editTarget}
        />
      )}
      <DeleteCourse
        course={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
      {enrollTarget && (
        <EnrollModal
          course={enrollTarget}
          onClose={() => setEnrollTarget(null)}
        />
      )}
    </div>
  );
}
