"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { InferType } from "yup";
import toast from "react-hot-toast";
import { authService } from "@/services/client/auth";
import { loginSchema } from "@/validations/auth";
import { storeInLocalStorage } from "@/lib/localStorage";
import type { ApiResponse, AuthResponse } from "@/interfaces";

export function useLogin() {
  const router = useRouter();

  const { mutate, isPending } = useMutation<
    ApiResponse<AuthResponse>,
    Error,
    InferType<typeof loginSchema>
  >({
    mutationFn: (data) => authService.login(data),
    onSuccess: (res) => {
      if (res.data.success && res.data.data) {
        const { accessToken: token, user } = res.data.data;

        if (user.role === "student") {
          toast.error("Student accounts can't sign in here.");
          return;
        }

        storeInLocalStorage("token", token);
        storeInLocalStorage("user", user);
        if (user.subdomain) {
          storeInLocalStorage("subdomain", user.subdomain);
        }
        toast.success(`Welcome back, ${user.firstName}`);

        const roleRedirect: Record<string, string> = {
          super_admin: "/dashboard/schools",
          school_admin: "/dashboard/users",
          lecturer: "/dashboard/exams",
        };
        router.push(roleRedirect[user.role] ?? "/dashboard/exams");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong.");
    },
  });

  return { mutate, isPending };
}
