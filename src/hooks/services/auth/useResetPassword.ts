"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { InferType } from "yup";
import toast from "react-hot-toast";
import { authService } from "@/services/client/auth";
import { resetPasswordSchema } from "@/validations/auth";
import type { ApiResponse } from "@/interfaces";

export function useResetPassword(token: string) {
  const router = useRouter();

  const { mutate, isPending } = useMutation<
    ApiResponse,
    Error,
    InferType<typeof resetPasswordSchema>
  >({
    mutationFn: ({ password }) =>
      authService.resetPassword(token, { password }),
    onSuccess: () => {
      toast.success("Password reset! You can now log in.");
      router.push("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong.");
    },
  });

  return { mutate, isPending };
}
