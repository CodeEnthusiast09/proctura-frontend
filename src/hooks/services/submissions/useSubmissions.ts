"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { submissionsService } from "@/services/client/submissions";
import type {
  ApiResponse,
  PaginatedResponse,
  Submission,
  SubmissionAnswer,
  AllResultsRow,
  AllResultsFilters,
  RunCodeResult,
} from "@/interfaces";

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

export function useSubmitExam(onSuccess?: (submissionId: string) => void) {
  return useMutation<ApiResponse<Submission>, Error, string>({
    mutationFn: (submissionId) => submissionsService.submit(submissionId),
    onSuccess: (_, submissionId) => onSuccess?.(submissionId),
  });
}

export function useLogViolation() {
  return useMutation<
    ApiResponse,
    Error,
    { submissionId: string; reason: string }
  >({
    mutationFn: ({ submissionId, reason }) =>
      submissionsService.logViolation(submissionId, reason),
  });
}

export function useSubmissionResult(submissionId: string | null) {
  return useQuery<ApiResponse<Submission>>({
    queryKey: submissionResultKey(submissionId ?? ""),
    queryFn: () => submissionsService.getResult(submissionId!),
    enabled: !!submissionId,
    refetchInterval: (query) => {
      const status = query.state.data?.data?.data?.status;
      return status === "graded" ? false : 2000;
    },
  });
}

export function useMySubmissions() {
  return useQuery<ApiResponse<Submission[]>>({
    queryKey: ["submissions", "my"],
    queryFn: () => submissionsService.getMySubmissions(),
  });
}

export function useMySubmission(examId: string) {
  return useQuery<ApiResponse<Submission>>({
    queryKey: ["submissions", "my", examId],
    queryFn: () => submissionsService.getMySubmission(examId),
    retry: false, // 404 = no submission, don't retry
  });
}

export function useRunCode() {
  return useMutation<
    ApiResponse<RunCodeResult[]>,
    Error,
    { submissionId: string; questionId: string; code: string }
  >({
    mutationFn: ({ submissionId, questionId, code }) =>
      submissionsService.runCode(submissionId, {
        question_id: questionId,
        code,
      }),
  });
}

export function useSubmissionDetail(submissionId: string | null) {
  return useQuery<ApiResponse<Submission>>({
    queryKey: ["submissions", submissionId, "detail"],
    queryFn: () => submissionsService.getDetail(submissionId!),
    enabled: !!submissionId,
  });
}

export function useOverrideScore(submissionId: string, examId?: string) {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<Submission>,
    Error,
    { answerId: string; score: number }
  >({
    mutationFn: ({ answerId, score }) =>
      submissionsService.overrideScore(submissionId, answerId, score),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["submissions", submissionId, "detail"] });
      qc.invalidateQueries({ queryKey: ["results"] });
      if (examId) {
        qc.invalidateQueries({ queryKey: ["exams", examId, "results"] });
      }
    },
  });
}

export function useAllResults(filters: AllResultsFilters) {
  return useQuery<PaginatedResponse<AllResultsRow>>({
    queryKey: ["results", filters],
    queryFn: () =>
      submissionsService.getAllResults({
        course_id: filters.courseId,
        exam_id: filters.examId,
        status: filters.status,
        search: filters.search,
        page: filters.page,
        limit: filters.limit,
      }),
  });
}
