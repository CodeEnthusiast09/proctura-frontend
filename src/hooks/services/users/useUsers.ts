"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InferType } from "yup";
import toast from "react-hot-toast";
import { usersService } from "@/services/client/users";
import {
  inviteAdminSchema,
  inviteLecturerSchema,
  inviteStudentSchema,
} from "@/validations/user";
import type { ApiResponse, PaginatedResponse, User } from "@/interfaces";

export const USERS_KEY = ["users"] as const;
export const usersKey = (role?: string) =>
  role ? [...USERS_KEY, { role }] : USERS_KEY;

// ── Queries ───────────────────────────────────────────────────────────────────

export function useUsers(role?: string) {
  return useQuery<PaginatedResponse<User>>({
    queryKey: usersKey(role),
    queryFn: () => usersService.list(role),
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

interface InviteResult {
  id: string;
  email: string;
  inviteToken: string;
}

export function useInviteAdmin(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<InviteResult>,
    Error,
    InferType<typeof inviteAdminSchema>
  >({
    mutationFn: (data) => usersService.inviteAdmin(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEY });
      toast.success("Admin invited — they will receive an email");
      onSuccess?.();
    },
    onError: () => {},
  });
}

export function useInviteAdminToTenant(tenantId: string, onSuccess?: () => void) {
  return useMutation<
    ApiResponse<InviteResult>,
    Error,
    InferType<typeof inviteAdminSchema>
  >({
    mutationFn: (data) => usersService.inviteAdminToTenant(tenantId, data),
    onSuccess: () => {
      toast.success("Admin invited — they will receive an email");
      onSuccess?.();
    },
    onError: () => {},
  });
}

export function useInviteLecturer(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<InviteResult>,
    Error,
    InferType<typeof inviteLecturerSchema>
  >({
    mutationFn: (data) => usersService.inviteLecturer(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEY });
      toast.success("Invitation sent — lecturer will receive an email");
      onSuccess?.();
    },
    onError: () => { },
  });
}

interface ImportResult {
  created: number;
  skipped: number;
}

export function useInviteStudent(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<InviteResult>,
    Error,
    InferType<typeof inviteStudentSchema>
  >({
    mutationFn: (data) => usersService.inviteStudent(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEY });
      toast.success("Invitation sent — student will receive an email");
      onSuccess?.();
    },
    onError: () => { },
  });
}

export function useImportStudents(onSuccess?: (result: ImportResult) => void) {
  const qc = useQueryClient();
  return useMutation<ApiResponse<ImportResult>, Error, File>({
    mutationFn: (file) => usersService.importStudents(file),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: USERS_KEY });
      const result = res.data?.data;
      if (result) {
        toast.success(
          `Import complete: ${result.created} created, ${result.skipped} skipped`,
        );
        onSuccess?.(result);
      }
    },
    onError: () => { },
  });
}

export function useBulkUpdateUserActive(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<{ updated: number }>,
    Error,
    { ids: string[]; isActive: boolean }
  >({
    mutationFn: ({ ids, isActive }) => usersService.bulkActive(ids, isActive),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: USERS_KEY });
      const verb = vars.isActive ? "activated" : "deactivated";
      const noun = vars.ids.length === 1 ? "user" : "users";
      toast.success(`${vars.ids.length} ${noun} ${verb}`);
      onSuccess?.();
    },
    onError: () => {},
  });
}

export function useToggleUserActive(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<User>,
    Error,
    { id: string; isActive: boolean }
  >({
    mutationFn: ({ id, isActive }) => usersService.update(id, { isActive }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: USERS_KEY });
      toast.success(vars.isActive ? "User activated" : "User deactivated");
      onSuccess?.();
    },
    onError: () => { },
  });
}

export function useDeleteUser(onSuccess?: () => void) {
  const qc = useQueryClient();
  return useMutation<ApiResponse, Error, string>({
    mutationFn: (id) => usersService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEY });
      toast.success("User removed");
      onSuccess?.();
    },
    onError: () => { },
  });
}
