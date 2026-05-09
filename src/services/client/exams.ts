import { api } from "@/lib/axios";
import { InferType } from "yup";
import type { examSchema, updateExamSchema } from "@/validations/exam";
import type { questionSchema } from "@/validations/question";
import type { testCaseSchema } from "@/validations/testCase";

export const examsService = {
  // Exams
  list: (courseId?: string) =>
    api.get("/exams", { params: courseId ? { course_id: courseId } : {} }),

  getAvailable: () => api.get("/exams/available"),

  get: (id: string) => api.get(`/exams/${id}`),

  create: (payload: InferType<typeof examSchema>) =>
    api.post("/exams", payload),

  update: (
    id: string,
    payload: InferType<typeof updateExamSchema> & { status?: string },
  ) => api.put(`/exams/${id}`, payload),

  updateStatus: (id: string, status: string) =>
    api.patch(`/exams/${id}/status`, { status }),

  delete: (id: string) => api.delete(`/exams/${id}`),

  results: (id: string) => api.get(`/exams/${id}/results`),

  releaseResults: (id: string, released: boolean) =>
    api.patch(`/exams/${id}/release-results`, { released }),

  // Questions
  addQuestion: (examId: string, payload: InferType<typeof questionSchema>) =>
    api.post(`/exams/${examId}/questions`, payload),

  updateQuestion: (
    questionId: string,
    payload: Partial<InferType<typeof questionSchema>>,
  ) => api.put(`/questions/${questionId}`, payload),

  deleteQuestion: (questionId: string) =>
    api.delete(`/questions/${questionId}`),

  // Test cases
  addTestCase: (
    questionId: string,
    payload: InferType<typeof testCaseSchema>[],
  ) => api.post(`/questions/${questionId}/test-cases`, payload),

  updateTestCase: (
    testCaseId: string,
    payload: Partial<InferType<typeof testCaseSchema>>,
  ) => api.put(`/test-cases/${testCaseId}`, payload),

  deleteTestCase: (testCaseId: string) =>
    api.delete(`/test-cases/${testCaseId}`),
};
