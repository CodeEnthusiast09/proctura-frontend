"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { InferType } from "yup";
import toast from "react-hot-toast";
import { authService } from "@/services/client/auth";
import { forgotPasswordSchema } from "@/validations/auth";
import type { ApiResponse } from "@/interfaces";

export function useForgotPassword() {
  const [submitted, setSubmitted] = useState(false);

  const { mutate, isPending } = useMutation<
    ApiResponse,
    Error,
    InferType<typeof forgotPasswordSchema>
  >({
    mutationFn: (data) => authService.forgotPassword(data),
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong.");
    },
  });

  return { mutate, isPending, submitted };
}
