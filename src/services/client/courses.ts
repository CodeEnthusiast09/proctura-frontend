// src/services/client/courses.ts
import { api } from "@/lib/axios";
import { InferType } from "yup";
import type { courseSchema } from "@/validations/course";

export const coursesService = {
  list: () => api.get("/courses"),

  create: (payload: InferType<typeof courseSchema>) =>
    api.post("/courses", payload),

  update: (id: string, payload: Partial<InferType<typeof courseSchema>>) =>
    api.put(`/courses/${id}`, payload),

  delete: (id: string) => api.delete(`/courses/${id}`),

  listEnrollments: (courseId: string) =>
    api.get(`/courses/${courseId}/enrollments`),

  enroll: (courseId: string, matricNumbers: string[]) =>
    api.post(`/courses/${courseId}/enroll`, { matric_numbers: matricNumbers }),

  unenroll: (courseId: string, studentId: string) =>
    api.delete(`/courses/${courseId}/enrollments/${studentId}`),
};
