"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/auth/FormField";
import { useAddQuestion, useUpdateQuestion } from "@/hooks/services/exams";
import { questionSchema } from "@/validations/question";
import type { Question } from "@/interfaces";

type QuestionFormData = InferType<typeof questionSchema>;

export function QuestionModal({
  open,
  onClose,
  mode,
  examId,
  question,
}: {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  examId: string;
  question?: Question;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: yupResolver(questionSchema),
    defaultValues: question
      ? { body: question.body, points: question.points }
      : { points: 10 },
  });

  const add = useAddQuestion(examId, () => {
    reset();
    onClose();
  });
  const edit = useUpdateQuestion(examId, question?.id ?? "", onClose);
  const isPending = add.isPending || edit.isPending;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "add" ? "Add Question" : "Edit Question"}
      size="md"
    >
      <form
        onSubmit={handleSubmit((d) =>
          mode === "add" ? add.mutate(d) : edit.mutate(d),
        )}
        className="space-y-4"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-navy-dark dark:text-slate-200">
            Question
          </label>
          <textarea
            rows={4}
            placeholder="Write a function that reverses a string..."
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white dark:bg-slate-900 text-navy-dark dark:text-white placeholder:text-slate-400 outline-none transition-colors resize-none ${errors.body ? "border-red-400" : "border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500"}`}
            {...register("body")}
          />
          {errors.body && (
            <p className="text-xs text-red-500">{errors.body.message}</p>
          )}
        </div>
        <FormField
          label="Points"
          type="number"
          error={errors.points?.message}
          {...register("points", { valueAsNumber: true })}
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
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-navy dark:bg-blue-600 text-white rounded-lg hover:bg-navy-light disabled:opacity-60 transition-colors"
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            {mode === "add" ? "Add" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
