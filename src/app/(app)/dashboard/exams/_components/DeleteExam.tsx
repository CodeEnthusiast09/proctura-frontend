"use client";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useDeleteExam } from "@/hooks/services/exams";
import type { Exam } from "@/interfaces";

export function DeleteExam({
  exam,
  onClose,
}: {
  exam: Exam | null;
  onClose: () => void;
}) {
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
