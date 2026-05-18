"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { InferType } from "yup";
import toast from "react-hot-toast";
import { authService } from "@/services/client/auth";
import { acceptInviteSchema } from "@/validations/auth";
import { storeInLocalStorage } from "@/lib/localStorage";
import type { ApiResponse, AuthResponse } from "@/interfaces";

export function useAcceptInvite(token: string) {
  const [activated, setActivated] = useState(false);
  const [activatedRole, setActivatedRole] = useState<string | null>(null);

  const { mutate, isPending } = useMutation<
    ApiResponse<AuthResponse>,
    Error,
    InferType<typeof acceptInviteSchema>
  >({
    mutationFn: ({ firstName, lastName, password }) =>
      authService.acceptInvite(token, { firstName, lastName, password }),
    onSuccess: (res) => {
      if (res.data.success && res.data.data) {
        const { accessToken: accessTokenValue, user } = res.data.data;
        storeInLocalStorage("token", accessTokenValue);
        storeInLocalStorage("user", user);
        if (user.subdomain) {
          storeInLocalStorage("subdomain", user.subdomain);
        }
        setActivatedRole(user.role);
      }
      toast.success("Account activated!");
      setActivated(true);
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong.");
    },
  });

  return { mutate, isPending, activated, activatedRole };
}
