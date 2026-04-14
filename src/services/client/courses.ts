// src/services/client/courses.ts
import { api } from "@/lib/axios";
import { InferType } from "yup";
import type { courseSchema } from "@/validations/course";

export const coursesService = {
  list: () => api.get("/api/courses"),

  create: (payload: InferType<typeof courseSchema>) =>
    api.post("/api/courses", payload),

  update: (id: string, payload: Partial<InferType<typeof courseSchema>>) =>
    api.put(`/api/courses/${id}`, payload),

  delete: (id: string) => api.delete(`/api/courses/${id}`),
};
