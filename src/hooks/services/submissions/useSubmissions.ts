"use client";
// src/hooks/services/submissions/useSubmissions.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { submissionsService } from "@/services/client/submissions";
import type { ApiResponse, Submission, SubmissionAnswer } from "@/interfaces";

export const submissionResultKey = (id: string) =>
  ["submissions", id, "result"] as const;

export function useStartExam(onSuccess?: (submission: Submission) => void) {
  return useMutation<ApiResponse<Submission>, Error, string>({
    mutationFn: (examId) => submissionsService.start(examId),
    onSuccess: (res) => {
      const submission = res.data?.data;
      if (submission) onSuccess?.(submission);
    },
  });
}

export function useSaveAnswer() {
  return useMutation<
    ApiResponse<SubmissionAnswer>,
    Error,
    { submissionId: string; questionId: string; code: string }
  >({
    mutationFn: ({ submissionId, questionId, code }) =>
      submissionsService.saveAnswer(submissionId, { questionId, code }),
  });
}

export function useSubmitExam(onSuccess?: () => void) {
  return useMutation<ApiResponse<Submission>, Error, string>({
    mutationFn: (submissionId) => submissionsService.submit(submissionId),
    onSuccess: () => onSuccess?.(),
  });
}

export function useLogViolation() {
  return useMutation<ApiResponse, Error, { submissionId: string; reason: string }>({
    mutationFn: ({ submissionId, reason }) =>
      submissionsService.logViolation(submissionId, reason),
  });
}

export function useSubmissionResult(submissionId: string | null) {
  return useQuery<ApiResponse<Submission>>({
    queryKey: submissionResultKey(submissionId ?? ""),
    queryFn: () => submissionsService.getResult(submissionId!),
    enabled: !!submissionId,
  });
}
