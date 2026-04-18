"use client";
// src/hooks/services/courses/useCourses.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InferType } from "yup";
import toast from "react-hot-toast";
import { coursesService } from "@/services/client/courses";
import { courseSchema } from "@/validations/course";
import type { ApiResponse, PaginatedResponse } from "@/interfaces";
import type { Course, CourseEnrollment } from "@/interfaces";

export const COURSES_KEY = ["courses"] as const;

export function useCourses() {
  return useQuery<PaginatedResponse<Course>>({
    queryKey: COURSES_KEY,
    queryFn: () => coursesService.list(),
  });
}

export function useCreateCourse(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation<ApiResponse<Course>, Error, InferType<typeof courseSchema>>({
    mutationFn: (data) => coursesService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: COURSES_KEY });
      toast.success("Course created");
      onSuccess?.();
    },
    onError: () => {},
  });
}

export function useUpdateCourse(id: string, onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation<ApiResponse<Course>, Error, Partial<InferType<typeof courseSchema>>>({
    mutationFn: (data) => coursesService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: COURSES_KEY });
      toast.success("Course updated");
      onSuccess?.();
    },
    onError: () => {},
  });
}

export function useDeleteCourse(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation<ApiResponse, Error, string>({
    mutationFn: (id) => coursesService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: COURSES_KEY });
      toast.success("Course deleted");
      onSuccess?.();
    },
    onError: () => {},
  });
}

export const enrollmentKey = (courseId: string) =>
  ["courses", courseId, "enrollments"] as const;

export function useCourseEnrollments(courseId: string) {
  return useQuery<ApiResponse<CourseEnrollment[]>>({
    queryKey: enrollmentKey(courseId),
    queryFn: () => coursesService.listEnrollments(courseId),
    enabled: !!courseId,
  });
}

export function useEnrollStudents(courseId: string, onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation<ApiResponse, Error, string[]>({
    mutationFn: (matricNumbers) => coursesService.enroll(courseId, matricNumbers),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: enrollmentKey(courseId) });
      toast.success(res.data?.message ?? "Students enrolled");
      onSuccess?.();
    },
    onError: () => toast.error("Failed to enroll students"),
  });
}

export function useUnenrollStudent(courseId: string) {
  const qc = useQueryClient();
  return useMutation<ApiResponse, Error, string>({
    mutationFn: (studentId) => coursesService.unenroll(courseId, studentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: enrollmentKey(courseId) });
      toast.success("Student removed");
    },
    onError: () => toast.error("Failed to remove student"),
  });
}
