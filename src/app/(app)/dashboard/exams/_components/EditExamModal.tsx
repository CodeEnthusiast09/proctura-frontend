"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/auth/FormField";
import { useUpdateExam } from "@/hooks/services/exams";
import { updateExamSchema } from "@/validations/exam";
import type { Exam } from "@/interfaces";

type UpdateFormData = InferType<typeof updateExamSchema>;

export function EditExamModal({
  exam,
  onClose,
}: {
  exam: Exam;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateFormData>({
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
        <FormField
          label="Exam title"
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
            className="w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white dark:bg-slate-900 text-navy-dark dark:text-white outline-none border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500 resize-none"
            {...register("instructions")}
          />
        </div>
        <FormField
          label="Duration (minutes)"
          type="number"
          error={errors.durationMinutes?.message}
          {...register("durationMinutes", { valueAsNumber: true })}
        />
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
            {isPending && <Loader2 size={14} className="animate-spin" />}Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
