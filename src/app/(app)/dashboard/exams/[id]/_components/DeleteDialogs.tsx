"use client";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useDeleteQuestion, useDeleteTestCase } from "@/hooks/services/exams";
import type { Question, TestCase } from "@/interfaces";

export function DeleteQuestionDialog({
  question,
  examId,
  onClose,
}: {
  question: Question | null;
  examId: string;
  onClose: () => void;
}) {
  const { mutate, isPending } = useDeleteQuestion(examId, onClose);
  return (
    <ConfirmDialog
      open={!!question}
      onClose={onClose}
      onConfirm={() => question && mutate(question.id)}
      title="Delete question"
      message="This question and all its test cases will be permanently deleted."
      isPending={isPending}
    />
  );
}

export function DeleteTestCaseDialog({
  testCase,
  examId,
  onClose,
}: {
  testCase: TestCase | null;
  examId: string;
  onClose: () => void;
}) {
  const { mutate, isPending } = useDeleteTestCase(examId, onClose);
  return (
    <ConfirmDialog
      open={!!testCase}
      onClose={onClose}
      onConfirm={() => testCase && mutate(testCase.id)}
      title="Delete test case"
      message="This test case will be permanently deleted."
      isPending={isPending}
    />
  );
}
