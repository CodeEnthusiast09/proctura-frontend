// src/services/client/users.ts
import { api } from "@/lib/axios";
import type { InferType } from "yup";
import type { inviteLecturerSchema } from "@/validations/user";

export const usersService = {
  list: (role?: string, page = 1, limit = 50) =>
    api.get("/api/users", { params: { ...(role ? { role } : {}), page, limit } }),

  inviteLecturer: (payload: InferType<typeof inviteLecturerSchema>) =>
    api.post("/api/users/invite-lecturer", payload),

  importStudents: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.post("/api/users/import-students", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update: (id: string, payload: { isActive: boolean }) =>
    api.put(`/api/users/${id}`, payload),

  delete: (id: string) => api.delete(`/api/users/${id}`),
};
