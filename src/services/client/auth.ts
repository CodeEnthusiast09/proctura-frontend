import { InferType } from "yup";
import { publicApi } from "@/lib/axios";
import type {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  acceptInviteSchema,
} from "@/validations/auth";

export const authService = {
  login: (payload: InferType<typeof loginSchema>) =>
    publicApi.post("/auth/login", payload),

  forgotPassword: (payload: InferType<typeof forgotPasswordSchema>) =>
    publicApi.post("/auth/forgot-password", payload),

  resetPassword: (
    token: string,
    payload: Omit<InferType<typeof resetPasswordSchema>, "confirmPassword">,
  ) => publicApi.post("/auth/reset-password", { token, ...payload }),

  acceptInvite: (
    token: string,
    payload: Omit<InferType<typeof acceptInviteSchema>, "confirmPassword">,
  ) => publicApi.post("/auth/accept-invite", { token, ...payload }),
};
