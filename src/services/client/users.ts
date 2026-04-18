// src/services/client/users.ts
import { api } from "@/lib/axios";
import type { InferType } from "yup";
import type { inviteLecturerSchema, inviteStudentSchema } from "@/validations/user";

export const usersService = {
  list: (role?: string, page = 1, limit = 50) =>
    api.get("/users", { params: { ...(role ? { role } : {}), page, limit } }),

  inviteLecturer: (payload: InferType<typeof inviteLecturerSchema>) =>
    api.post("/users/invite-lecturer", payload),

  inviteStudent: (payload: InferType<typeof inviteStudentSchema>) =>
    api.post("/users/invite-student", payload),

  importStudents: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.post("/users/import-students", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update: (id: string, payload: { isActive: boolean }) =>
    api.put(`/users/${id}`, payload),

  delete: (id: string) => api.delete(`/users/${id}`),
};
