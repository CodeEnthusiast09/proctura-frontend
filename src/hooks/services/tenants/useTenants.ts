"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InferType } from "yup";
import toast from "react-hot-toast";
import { tenantsService } from "@/services/client/tenants";
import { createTenantSchema, updateTenantSchema } from "@/validations/tenant";
import type { ApiResponse, PaginatedResponse, Tenant } from "@/interfaces";

export const TENANTS_KEY = ["tenants"] as const;

interface CreateTenantResult {
  tenant: Tenant;
  admin: { id: string; email: string; inviteToken: string };
}

export function useTenants() {
  return useQuery<PaginatedResponse<Tenant>>({
    queryKey: TENANTS_KEY,
    queryFn: () => tenantsService.list(),
  });
}

export function useCreateTenant(
  onSuccess?: (result: CreateTenantResult) => void,
) {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<CreateTenantResult>,
    Error,
    InferType<typeof createTenantSchema>
  >({
    mutationFn: (data) => tenantsService.create(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: TENANTS_KEY });
      toast.success("School onboarded successfully");
      const result = res.data?.data;
      if (result) onSuccess?.(result);
    },
    onError: () => { },
  });
}

export function useUpdateTenant(id: string, onSuccess?: () => void) {
  const qc = useQueryClient();
  type Payload = InferType<typeof updateTenantSchema> & { isActive?: boolean };
  return useMutation<ApiResponse<Tenant>, Error, Payload>({
    mutationFn: (data) => tenantsService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TENANTS_KEY });
      toast.success("School updated");
      onSuccess?.();
    },
    onError: () => { },
  });
}

export function useDeleteTenant(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation<ApiResponse, Error, string>({
    mutationFn: (id) => tenantsService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TENANTS_KEY });
      toast.success("School deleted");
      onSuccess?.();
    },
    onError: () => { },
  });
}
