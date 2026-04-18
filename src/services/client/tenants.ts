// src/services/client/tenants.ts
import { api } from "@/lib/axios";
import type { InferType } from "yup";
import type { createTenantSchema, updateTenantSchema } from "@/validations/tenant";

export const tenantsService = {
  list: (page = 1, limit = 50) =>
    api.get("/admin/tenants", { params: { page, limit } }),

  create: (payload: InferType<typeof createTenantSchema>) =>
    api.post("/admin/tenants", payload),

  update: (id: string, payload: InferType<typeof updateTenantSchema> & { isActive?: boolean }) =>
    api.put(`/admin/tenants/${id}`, payload),

  delete: (id: string) => api.delete(`/admin/tenants/${id}`),
};
