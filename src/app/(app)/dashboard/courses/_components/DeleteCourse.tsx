"use client";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useDeleteCourse } from "@/hooks/services/courses";
import type { Course } from "@/interfaces";

export function DeleteCourse({
  course,
  onClose,
}: {
  course: Course | null;
  onClose: () => void;
}) {
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
