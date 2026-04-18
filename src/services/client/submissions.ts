import { api } from "@/lib/axios";

export const submissionsService = {
  start: (examId: string) => api.post(`/exams/${examId}/start`),

  saveAnswer: (
    submissionId: string,
    payload: { questionId: string; code: string },
  ) => api.put(`/submissions/${submissionId}/answer`, payload),

  submit: (submissionId: string) =>
    api.post(`/submissions/${submissionId}/submit`),

  logViolation: (submissionId: string, reason: string) =>
    api.post(`/submissions/${submissionId}/violation`, { reason }),

  getResult: (submissionId: string) =>
    api.get(`/submissions/${submissionId}/result`),

  getMySubmissions: () => api.get("/my-submissions"),

  getMySubmission: (examId: string) =>
    api.get(`/exams/${examId}/my-submission`),

  getAllResults: (params: {
    course_id?: string;
    exam_id?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => api.get("/results", { params }),

  runCode: (
    submissionId: string,
    payload: { question_id: string; code: string },
  ) => api.post(`/submissions/${submissionId}/run`, payload),

  getDetail: (submissionId: string) =>
    api.get(`/submissions/${submissionId}`),

  overrideScore: (submissionId: string, answerId: string, score: number) =>
    api.patch(`/submissions/${submissionId}/answers/${answerId}/score`, { score }),
};
