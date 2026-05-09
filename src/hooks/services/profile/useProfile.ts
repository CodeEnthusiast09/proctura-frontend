"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  profileService,
  type UpdateMePayload,
  type ChangePasswordPayload,
} from "@/services/client/profile";
import {
  retrieveFromLocalStorage,
  storeInLocalStorage,
} from "@/lib/localStorage";
import type { ApiResponse, User } from "@/interfaces";

export function useUpdateMe(onSuccess?: (user: User) => void) {
  return useMutation<ApiResponse<User>, Error, UpdateMePayload>({
    mutationFn: (data) => profileService.updateMe(data),
    onSuccess: (res) => {
      const updated = res.data?.data;
      if (updated) {
        const stored = retrieveFromLocalStorage<User>("user");
        if (stored) {
          storeInLocalStorage("user", {
            ...stored,
            firstName: updated.firstName,
            lastName: updated.lastName,
          });
        }
        toast.success("Profile updated");
        onSuccess?.(updated);
      }
    },
    onError: () => {},
  });
}

export function useChangePassword(onSuccess?: () => void) {
  return useMutation<ApiResponse, Error, ChangePasswordPayload>({
    mutationFn: (data) => profileService.changePassword(data),
    onSuccess: () => {
      toast.success("Password changed");
      onSuccess?.();
    },
    onError: () => {},
  });
}
