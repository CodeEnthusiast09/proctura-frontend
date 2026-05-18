import { api } from "@/lib/axios";

export const dashboardService = {
  getDashboard: () => api.get("/dashboard"),
  getSuperAdminDashboard: () => api.get("/admin/dashboard"),
  getExamAnalytics: (examId: string) => api.get(`/exams/${examId}/analytics`),
};
