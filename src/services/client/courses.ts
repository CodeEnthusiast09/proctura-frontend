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
};
