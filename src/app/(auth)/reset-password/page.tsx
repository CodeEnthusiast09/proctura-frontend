"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { AuthCard } from "@/components/auth";
import { useResetPassword } from "@/hooks/services/auth";
import { resetPasswordSchema } from "@/validations/auth";

type FormData = InferType<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { mutate, isPending } = useResetPassword(token);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(resetPasswordSchema) });

  if (!token) {
    return (
      <AuthCard title="Invalid link" subtitle="">
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <p className="text-sm text-slate dark:text-slate-300 mb-6">
            This reset link is invalid or has expired. Request a new one.
          </p>
          <Link
            href="/forgot-password"
            className="text-sm text-navy dark:text-blue-400 font-medium hover:underline"
          >
            Request new link
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Set new password"
      subtitle="Choose a strong password for your account."
    >
      <form
        onSubmit={handleSubmit((data) => mutate(data))}
        className="space-y-5"
      >
        {(["password", "confirmPassword"] as const).map((field) => {
          const isConfirm = field === "confirmPassword";
          const show = isConfirm ? showConfirm : showPassword;
          const toggle = isConfirm
            ? () => setShowConfirm((v) => !v)
            : () => setShowPassword((v) => !v);
          const label = isConfirm ? "Confirm password" : "New password";
          const error = errors[field]?.message;

          return (
            <div key={field} className="flex flex-col gap-1.5">
              <label
                htmlFor={field}
                className="text-sm font-medium text-navy-dark dark:text-slate-200"
              >
                {label}
              </label>
              <div className="relative">
                <input
                  id={field}
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white dark:bg-slate-900 text-navy-dark dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-colors pr-10
                    ${error
                      ? "border-red-400 dark:border-red-500"
                      : "border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500"
                    }`}
                  {...register(field)}
                />
                <button
                  type="button"
                  onClick={toggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate dark:hover:text-slate-300 transition-colors"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>
          );
        })}

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-navy dark:bg-blue-600 text-white font-semibold text-sm px-5 py-3 rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          {isPending ? "Saving…" : "Reset Password"}
        </button>
      </form>
    </AuthCard>
  );
}
