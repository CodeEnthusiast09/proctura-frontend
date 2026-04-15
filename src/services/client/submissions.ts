// src/services/client/submissions.ts
import { api } from "@/lib/axios";

export const submissionsService = {
  start: (examId: string) =>
    api.post(`/api/exams/${examId}/start`),

  saveAnswer: (submissionId: string, payload: { questionId: string; code: string }) =>
    api.put(`/api/submissions/${submissionId}/answer`, payload),

  submit: (submissionId: string) =>
    api.post(`/api/submissions/${submissionId}/submit`),

  logViolation: (submissionId: string, reason: string) =>
    api.post(`/api/submissions/${submissionId}/violation`, { reason }),

  getResult: (submissionId: string) =>
    api.get(`/api/submissions/${submissionId}/result`),
};
