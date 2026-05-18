"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/client/dashboard";
import type {
  ApiResponse,
  LecturerDashboard,
  SchoolAdminDashboard,
  SuperAdminDashboard,
  ExamAnalytics,
} from "@/interfaces";

export const DASHBOARD_KEY = ["dashboard"] as const;
export const SUPER_ADMIN_DASHBOARD_KEY = ["dashboard", "super-admin"] as const;
export const examAnalyticsKey = (id: string) =>
  ["exams", id, "analytics"] as const;

export function useLecturerDashboard() {
  return useQuery<ApiResponse<LecturerDashboard>>({
    queryKey: DASHBOARD_KEY,
    queryFn: () => dashboardService.getDashboard(),
  });
}

export function useSchoolAdminDashboard() {
  return useQuery<ApiResponse<SchoolAdminDashboard>>({
    queryKey: DASHBOARD_KEY,
    queryFn: () => dashboardService.getDashboard(),
  });
}

export function useSuperAdminDashboard() {
  return useQuery<ApiResponse<SuperAdminDashboard>>({
    queryKey: SUPER_ADMIN_DASHBOARD_KEY,
    queryFn: () => dashboardService.getSuperAdminDashboard(),
  });
}

export function useExamAnalytics(examId: string) {
  return useQuery<ApiResponse<ExamAnalytics>>({
    queryKey: examAnalyticsKey(examId),
    queryFn: () => dashboardService.getExamAnalytics(examId),
    enabled: !!examId,
  });
}
