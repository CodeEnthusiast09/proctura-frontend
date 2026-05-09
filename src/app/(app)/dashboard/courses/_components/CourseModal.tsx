"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/auth/FormField";
import { useCreateCourse, useUpdateCourse } from "@/hooks/services/courses";
import { courseSchema } from "@/validations/course";
import type { Course } from "@/interfaces";

type FormData = InferType<typeof courseSchema>;

export function CourseModal({
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

  const create = useCreateCourse(() => {
    reset();
    onClose();
  });
  const update = useUpdateCourse(course?.id ?? "", onClose);

  function onSubmit(data: FormData) {
    if (mode === "create") create.mutate(data);
    else update.mutate(data);
  }

  const isPending = create.isPending || update.isPending;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "New Course" : "Edit Course"}
      size="sm"
    >
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
            {mode === "create" ? "Create" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
