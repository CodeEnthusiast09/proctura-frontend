"use client";
// src/hooks/services/courses/useCourses.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InferType } from "yup";
import toast from "react-hot-toast";
import { coursesService } from "@/services/client/courses";
import { courseSchema } from "@/validations/course";
import type { ApiResponse, PaginatedResponse } from "@/interfaces";
import type { Course } from "@/interfaces";

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
    onError: (e) => toast.error(e.message || "Failed to create course"),
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
    onError: (e) => toast.error(e.message || "Failed to update course"),
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
    onError: (e) => toast.error(e.message || "Failed to delete course"),
  });
}
