// src/services/client/submissions.ts
import { api } from "@/lib/axios";

export const submissionsService = {
  start: (examId: string) =>
    api.post(`/exams/${examId}/start`),

  saveAnswer: (submissionId: string, payload: { questionId: string; code: string }) =>
    api.put(`/submissions/${submissionId}/answer`, payload),

  submit: (submissionId: string) =>
    api.post(`/submissions/${submissionId}/submit`),

  logViolation: (submissionId: string, reason: string) =>
    api.post(`/submissions/${submissionId}/violation`, { reason }),

  getResult: (submissionId: string) =>
    api.get(`/submissions/${submissionId}/result`),
};
