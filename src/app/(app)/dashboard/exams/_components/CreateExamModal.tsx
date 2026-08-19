"use client";

import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/auth/FormField";
import { useCreateExam } from "@/hooks/services/exams";
import { useCourses } from "@/hooks/services/courses";
import { examSchema, LANGUAGES } from "@/validations/exam";

type CreateFormData = InferType<typeof examSchema>;

export function CreateExamModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: coursesData } = useCourses();
  const courses = coursesData?.data?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateFormData>({ resolver: yupResolver(examSchema) });

  const { mutate, isPending } = useCreateExam(() => {
    reset();
    onClose();
  });

  // useWatch rather than watch(): watch() returns a fresh function from
  // useForm() that cannot be memoised, so React Compiler skips optimising the
  // whole component. useWatch subscribes to just this field and re-renders
  // only on its changes. There are no defaultValues and the select already
  // handles undefined via ?? "", so the value is identical.
  const selectedLangId = useWatch({ control, name: "languageId" });

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
          <label className="text-sm font-medium text-navy-dark dark:text-slate-200">
            Course
          </label>
          <select
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white dark:bg-slate-900 text-navy-dark dark:text-white outline-none transition-colors ${errors.courseId ? "border-red-400" : "border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500"}`}
            {...register("courseId")}
          >
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.title}
              </option>
            ))}
          </select>
          {errors.courseId && (
            <p className="text-xs text-red-500">{errors.courseId.message}</p>
          )}
        </div>

        <FormField
          label="Exam title"
          placeholder="Midterm Examination"
          error={errors.title?.message}
          {...register("title")}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-navy-dark dark:text-slate-200">
            Instructions{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Answer all questions. No external libraries allowed."
            className="w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white dark:bg-slate-900 text-navy-dark dark:text-white placeholder:text-slate-400 outline-none transition-colors border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500 resize-none"
            {...register("instructions")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Duration (minutes)"
            type="number"
            placeholder="60"
            error={errors.durationMinutes?.message}
            {...register("durationMinutes", { valueAsNumber: true })}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-navy-dark dark:text-slate-200">
              Language
            </label>
            <select
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white dark:bg-slate-900 text-navy-dark dark:text-white outline-none transition-colors ${errors.languageId ? "border-red-400" : "border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500"}`}
              value={selectedLangId ?? ""}
              onChange={(e) => {
                const lang = LANGUAGES.find(
                  (l) => l.id === Number(e.target.value),
                );
                if (lang) {
                  setValue("languageId", lang.id);
                  setValue("languageName", lang.name);
                }
              }}
            >
              <option value="">Select language</option>
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
            {errors.languageId && (
              <p className="text-xs text-red-500">
                {errors.languageId.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-navy-dark dark:text-slate-200">
              Starts at
            </label>
            <input
              type="datetime-local"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white dark:bg-slate-900 text-navy-dark dark:text-white outline-none transition-colors ${errors.startsAt ? "border-red-400" : "border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500"}`}
              {...register("startsAt")}
            />
            {errors.startsAt && (
              <p className="text-xs text-red-500">{errors.startsAt.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-navy-dark dark:text-slate-200">
              Ends at
            </label>
            <input
              type="datetime-local"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white dark:bg-slate-900 text-navy-dark dark:text-white outline-none transition-colors ${errors.endsAt ? "border-red-400" : "border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500"}`}
              {...register("endsAt")}
            />
            {errors.endsAt && (
              <p className="text-xs text-red-500">{errors.endsAt.message}</p>
            )}
          </div>
        </div>

        {/* Hidden field for languageName */}
        <input type="hidden" {...register("languageName")} />

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-navy dark:bg-blue-600 text-white rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 disabled:opacity-60 transition-colors"
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            Create Exam
          </button>
        </div>
      </form>
    </Modal>
  );
}
