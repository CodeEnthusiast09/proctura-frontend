"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InferType } from "yup";
import toast from "react-hot-toast";
import { examsService } from "@/services/client/exams";
import { examSchema, updateExamSchema } from "@/validations/exam";
import { questionSchema } from "@/validations/question";
import { testCaseSchema } from "@/validations/testCase";
import type {
  ApiResponse,
  PaginatedResponse,
  Exam,
  Question,
  TestCase,
  Submission,
} from "@/interfaces";

export const EXAMS_KEY = ["exams"] as const;
export const examKey = (id: string) => ["exams", id] as const;
export const examResultsKey = (id: string) => ["exams", id, "results"] as const;

// ── Exam queries ──────────────────────────────────────────────────────────────

export function useExams(courseId?: string) {
  return useQuery<PaginatedResponse<Exam>>({
    queryKey: courseId ? [...EXAMS_KEY, { courseId }] : EXAMS_KEY,
    queryFn: () => examsService.list(courseId),
  });
}

export function useAvailableExams(enabled = true) {
  return useQuery<ApiResponse<Exam[]>>({
    queryKey: ["exams", "available"],
    queryFn: () => examsService.getAvailable(),
    enabled,
  });
}

export function useExam(id: string) {
  return useQuery<ApiResponse<Exam>>({
    queryKey: examKey(id),
    queryFn: () => examsService.get(id),
    enabled: !!id,
  });
}

export function useExamResults(id: string) {
  return useQuery<ApiResponse<Submission[]>>({
    queryKey: examResultsKey(id),
    queryFn: () => examsService.results(id),
    enabled: !!id,
  });
}

// ── Exam mutations ────────────────────────────────────────────────────────────

export function useCreateExam(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation<ApiResponse<Exam>, Error, InferType<typeof examSchema>>({
    mutationFn: (data) => examsService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXAMS_KEY });
      toast.success("Exam created");
      onSuccess?.();
    },
    onError: () => {},
  });
}

export function useUpdateExam(id: string, onSuccess?: () => void) {
  const qc = useQueryClient();
  type Payload = InferType<typeof updateExamSchema> & { status?: string };
  return useMutation<ApiResponse<Exam>, Error, Payload>({
    mutationFn: (data) => examsService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: examKey(id) });
      qc.invalidateQueries({ queryKey: EXAMS_KEY });
      toast.success("Exam updated");
      onSuccess?.();
    },
    onError: () => {},
  });
}

export function useUpdateExamStatus(id: string, onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation<ApiResponse<Exam>, Error, string>({
    mutationFn: (status) => examsService.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: examKey(id) });
      qc.invalidateQueries({ queryKey: EXAMS_KEY });
      toast.success("Exam status updated");
      onSuccess?.();
    },
    onError: () => {},
  });
}

export function useDeleteExam(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation<ApiResponse, Error, string>({
    mutationFn: (id) => examsService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXAMS_KEY });
      toast.success("Exam deleted");
      onSuccess?.();
    },
    onError: () => {},
  });
}

// ── Question mutations ────────────────────────────────────────────────────────

export function useAddQuestion(examId: string, onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<Question>,
    Error,
    InferType<typeof questionSchema>
  >({
    mutationFn: (data) => examsService.addQuestion(examId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: examKey(examId) });
      toast.success("Question added");
      onSuccess?.();
    },
    onError: () => {},
  });
}

export function useUpdateQuestion(
  examId: string,
  questionId: string,
  onSuccess?: () => void,
) {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<Question>,
    Error,
    Partial<InferType<typeof questionSchema>>
  >({
    mutationFn: (data) => examsService.updateQuestion(questionId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: examKey(examId) });
      toast.success("Question updated");
      onSuccess?.();
    },
    onError: () => {},
  });
}

export function useDeleteQuestion(examId: string, onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation<ApiResponse, Error, string>({
    mutationFn: (questionId) => examsService.deleteQuestion(questionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: examKey(examId) });
      toast.success("Question deleted");
      onSuccess?.();
    },
    onError: () => {},
  });
}

// ── Test case mutations ───────────────────────────────────────────────────────

export function useAddTestCase(
  examId: string,
  questionId: string,
  onSuccess?: () => void,
) {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<TestCase[]>,
    Error,
    InferType<typeof testCaseSchema>[]
  >({
    mutationFn: (data) => examsService.addTestCase(questionId, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: examKey(examId) });
      toast.success(
        `${vars.length} test case${vars.length !== 1 ? "s" : ""} added`,
      );
      onSuccess?.();
    },
    onError: () => {},
  });
}

export function useUpdateTestCase(
  examId: string,
  testCaseId: string,
  onSuccess?: () => void,
) {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<TestCase>,
    Error,
    Partial<InferType<typeof testCaseSchema>>
  >({
    mutationFn: (data) => examsService.updateTestCase(testCaseId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: examKey(examId) });
      toast.success("Test case updated");
      onSuccess?.();
    },
    onError: () => {},
  });
}

export function useDeleteTestCase(examId: string, onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation<ApiResponse, Error, string>({
    mutationFn: (testCaseId) => examsService.deleteTestCase(testCaseId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: examKey(examId) });
      toast.success("Test case deleted");
      onSuccess?.();
    },
    onError: () => {},
  });
}
