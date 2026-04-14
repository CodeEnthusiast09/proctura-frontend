"use client";
// src/app/(app)/dashboard/exams/page.tsx
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import Link from "next/link";
import {
  BookOpen, Plus, Pencil, Trash2, Loader2,
  Clock, Calendar, ChevronRight,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FormField } from "@/components/auth/FormField";
import { useExams, useCreateExam, useUpdateExam, useDeleteExam } from "@/hooks/services/exams";
import { useCourses } from "@/hooks/services/courses";
import { examSchema, updateExamSchema, LANGUAGES } from "@/validations/exam";
import { useCurrentUser } from "@/hooks/common/useCurrentUser";
import type { Exam } from "@/interfaces";

type CreateFormData = InferType<typeof examSchema>;
type UpdateFormData = InferType<typeof updateExamSchema>;

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
  scheduled: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300",
  active: "bg-green-pale dark:bg-green/10 text-green",
  closed: "bg-red-50 dark:bg-red-900/20 text-red-500",
};

export default function ExamsPage() {
  const user = useCurrentUser();
  const isStudent = user?.role === "student";
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Exam | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Exam | null>(null);

  const { data, isLoading } = useExams();
  const exams: Exam[] = data?.data?.data ?? [];

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-plus text-2xl font-bold text-navy-dark dark:text-white">
            {isStudent ? "My Exams" : "Exams"}
          </h1>
          <p className="text-sm text-slate dark:text-slate-400 mt-1">
            {isStudent ? "View and take your scheduled exams" : "Manage exams across your courses"}
          </p>
        </div>
        {!isStudent && (
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 bg-navy dark:bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 transition-colors"
          >
            <Plus size={16} />
            New Exam
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-slate" />
        </div>
      ) : exams.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <BookOpen size={24} className="text-slate dark:text-slate-400" />
          </div>
          <h3 className="font-plus font-semibold text-navy-dark dark:text-white mb-2">No exams yet</h3>
          <p className="text-sm text-slate dark:text-slate-400">
            {isStudent ? "No exams have been scheduled for you yet." : "Create your first exam to get started."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    {exam.course && (
                      <span className="text-xs font-bold font-mono bg-navy/10 dark:bg-navy/30 text-navy dark:text-blue-300 px-2 py-0.5 rounded">
                        {exam.course.code}
                      </span>
                    )}
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${STATUS_STYLES[exam.status]}`}>
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

                <div className="flex items-center gap-1 flex-shrink-0">
                  {!isStudent && (
                    <>
                      <Link
                        href={`/dashboard/exams/${exam.id}`}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-navy dark:text-blue-300 bg-navy/5 dark:bg-navy/20 rounded-lg hover:bg-navy/10 dark:hover:bg-navy/30 transition-colors"
                      >
                        Builder <ChevronRight size={12} />
                      </Link>
                      <button
                        onClick={() => setEditTarget(exam)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-navy dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(exam)}
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
          ))}
        </div>
      )}

      <CreateExamModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {editTarget && (
        <EditExamModal exam={editTarget} onClose={() => setEditTarget(null)} />
      )}
      <DeleteExam exam={deleteTarget} onClose={() => setDeleteTarget(null)} />
    </div>
  );
}

// ── Create Exam Modal ─────────────────────────────────────────────────────────

function CreateExamModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: coursesData } = useCourses();
  const courses = coursesData?.data?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateFormData>({ resolver: yupResolver(examSchema) });

  const { mutate, isPending } = useCreateExam(() => { reset(); onClose(); });

  const selectedLangId = watch("languageId");

  function onSubmit(data: CreateFormData) {
    mutate({
      ...data,
      startsAt: new Date(data.startsAt).toISOString(),
      endsAt: new Date(data.endsAt).toISOString(),
    });
  }

  return (
    <Modal open={open} onClose={onClose} title="New Exam" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Course */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-navy-dark dark:text-slate-200">Course</label>
          <select
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white dark:bg-slate-900 text-navy-dark dark:text-white outline-none transition-colors ${errors.courseId ? "border-red-400" : "border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500"}`}
            {...register("courseId")}
          >
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.code} — {c.title}</option>
            ))}
          </select>
          {errors.courseId && <p className="text-xs text-red-500">{errors.courseId.message}</p>}
        </div>

        <FormField label="Exam title" placeholder="Midterm Examination" error={errors.title?.message} {...register("title")} />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-navy-dark dark:text-slate-200">Instructions <span className="text-slate-400 font-normal">(optional)</span></label>
          <textarea
            rows={3}
            placeholder="Answer all questions. No external libraries allowed."
            className="w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white dark:bg-slate-900 text-navy-dark dark:text-white placeholder:text-slate-400 outline-none transition-colors border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500 resize-none"
            {...register("instructions")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Duration (minutes)" type="number" placeholder="60" error={errors.durationMinutes?.message} {...register("durationMinutes", { valueAsNumber: true })} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-navy-dark dark:text-slate-200">Language</label>
            <select
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white dark:bg-slate-900 text-navy-dark dark:text-white outline-none transition-colors ${errors.languageId ? "border-red-400" : "border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500"}`}
              value={selectedLangId ?? ""}
              onChange={(e) => {
                const lang = LANGUAGES.find((l) => l.id === Number(e.target.value));
                if (lang) {
                  setValue("languageId", lang.id);
                  setValue("languageName", lang.name);
                }
              }}
            >
              <option value="">Select language</option>
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
            {errors.languageId && <p className="text-xs text-red-500">{errors.languageId.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-navy-dark dark:text-slate-200">Starts at</label>
            <input
              type="datetime-local"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white dark:bg-slate-900 text-navy-dark dark:text-white outline-none transition-colors ${errors.startsAt ? "border-red-400" : "border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500"}`}
              {...register("startsAt")}
            />
            {errors.startsAt && <p className="text-xs text-red-500">{errors.startsAt.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-navy-dark dark:text-slate-200">Ends at</label>
            <input
              type="datetime-local"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white dark:bg-slate-900 text-navy-dark dark:text-white outline-none transition-colors ${errors.endsAt ? "border-red-400" : "border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500"}`}
              {...register("endsAt")}
            />
            {errors.endsAt && <p className="text-xs text-red-500">{errors.endsAt.message}</p>}
          </div>
        </div>

        {/* Hidden field for languageName */}
        <input type="hidden" {...register("languageName")} />

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isPending} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-navy dark:bg-blue-600 text-white rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 disabled:opacity-60 transition-colors">
            {isPending && <Loader2 size={14} className="animate-spin" />}
            Create Exam
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Edit Exam Modal ───────────────────────────────────────────────────────────

function EditExamModal({ exam, onClose }: { exam: Exam; onClose: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateFormData>({
    resolver: yupResolver(updateExamSchema),
    defaultValues: {
      title: exam.title,
      instructions: exam.instructions ?? "",
      durationMinutes: exam.durationMinutes,
    },
  });
  const { mutate, isPending } = useUpdateExam(exam.id, onClose);

  return (
    <Modal open onClose={onClose} title="Edit Exam" size="md">
      <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
        <FormField label="Exam title" error={errors.title?.message} {...register("title")} />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-navy-dark dark:text-slate-200">Instructions <span className="text-slate-400 font-normal">(optional)</span></label>
          <textarea rows={3} className="w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white dark:bg-slate-900 text-navy-dark dark:text-white outline-none border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500 resize-none" {...register("instructions")} />
        </div>
        <FormField label="Duration (minutes)" type="number" error={errors.durationMinutes?.message} {...register("durationMinutes", { valueAsNumber: true })} />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
          <button type="submit" disabled={isPending} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-navy dark:bg-blue-600 text-white rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 disabled:opacity-60 transition-colors">
            {isPending && <Loader2 size={14} className="animate-spin" />}Save
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Delete Exam ───────────────────────────────────────────────────────────────

function DeleteExam({ exam, onClose }: { exam: Exam | null; onClose: () => void }) {
  const { mutate, isPending } = useDeleteExam(onClose);
  return (
    <ConfirmDialog
      open={!!exam}
      onClose={onClose}
      onConfirm={() => exam && mutate(exam.id)}
      title="Delete exam"
      message={`"${exam?.title}" and all its questions will be permanently deleted.`}
      isPending={isPending}
    />
  );
}
