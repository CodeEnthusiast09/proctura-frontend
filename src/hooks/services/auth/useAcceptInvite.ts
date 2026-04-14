"use client";
// src/hooks/services/auth/useAcceptInvite.ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { InferType } from "yup";
import toast from "react-hot-toast";
import { authService } from "@/services/client/auth";
import { acceptInviteSchema } from "@/validations/auth";
import type { ApiResponse } from "@/interfaces";

export function useAcceptInvite(token: string) {
  const router = useRouter();

  const { mutate, isPending } = useMutation<
    ApiResponse,
    Error,
    InferType<typeof acceptInviteSchema>
  >({
    mutationFn: ({ firstName, lastName, password }) =>
      authService.acceptInvite(token, { firstName, lastName, password }),
    onSuccess: () => {
      toast.success("Account activated! Please log in.");
      router.push("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong.");
    },
  });

  return { mutate, isPending };
}
