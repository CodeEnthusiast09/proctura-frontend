"use client";
// src/app/(app)/dashboard/courses/page.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { GraduationCap, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FormField } from "@/components/auth/FormField";
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from "@/hooks/services/courses";
import { courseSchema } from "@/validations/course";
import type { Course } from "@/interfaces";

type FormData = InferType<typeof courseSchema>;

export default function CoursesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Course | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);

  const { data, isLoading } = useCourses();
  const courses: Course[] = data?.data?.data ?? [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-plus text-2xl font-bold text-navy-dark dark:text-white">Courses</h1>
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
            <GraduationCap size={24} className="text-slate dark:text-slate-400" />
          </div>
          <h3 className="font-plus font-semibold text-navy-dark dark:text-white mb-2">No courses yet</h3>
          <p className="text-sm text-slate dark:text-slate-400">Create your first course to start adding exams.</p>
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
                <div className="flex items-center gap-1 flex-shrink-0">
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
    </div>
  );
}

// ── CourseModal ───────────────────────────────────────────────────────────────

function CourseModal({
  open,
  onClose,
  mode,
  course,
}: {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  course?: Course;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(courseSchema),
    defaultValues: course ? { title: course.title, code: course.code } : {},
  });

  const create = useCreateCourse(() => { reset(); onClose(); });
  const update = useUpdateCourse(course?.id ?? "", onClose);

  function onSubmit(data: FormData) {
    if (mode === "create") create.mutate(data);
    else update.mutate(data);
  }

  const isPending = create.isPending || update.isPending;

  return (
    <Modal open={open} onClose={onClose} title={mode === "create" ? "New Course" : "Edit Course"} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Course title"
          placeholder="Data Structures and Algorithms"
          error={errors.title?.message}
          {...register("title")}
        />
        <FormField
          label="Course code"
          placeholder="CSC301"
          error={errors.code?.message}
          {...register("code")}
        />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-navy dark:bg-blue-600 text-white rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 disabled:opacity-60 transition-colors"
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            {mode === "create" ? "Create" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── DeleteCourse ──────────────────────────────────────────────────────────────

function DeleteCourse({ course, onClose }: { course: Course | null; onClose: () => void }) {
  const { mutate, isPending } = useDeleteCourse(onClose);
  return (
    <ConfirmDialog
      open={!!course}
      onClose={onClose}
      onConfirm={() => course && mutate(course.id)}
      title="Delete course"
      message={`"${course?.title}" and all its exams will be permanently deleted.`}
      isPending={isPending}
    />
  );
}
