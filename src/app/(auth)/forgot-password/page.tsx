"use client";
// src/app/(auth)/forgot-password/page.tsx
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { Loader2, MailCheck } from "lucide-react";
import Link from "next/link";
import { AuthCard, FormField } from "@/components/auth";
import { useForgotPassword } from "@/hooks/services/auth";
import { forgotPasswordSchema } from "@/validations/auth";

type FormData = InferType<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { mutate, isPending, submitted } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(forgotPasswordSchema) });

  if (submitted) {
    return (
      <AuthCard title="Check your email" subtitle="">
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full bg-green-pale dark:bg-green/10 border border-green/20 flex items-center justify-center mx-auto mb-5">
            <MailCheck size={24} className="text-green" />
          </div>
          <p className="text-sm text-slate dark:text-slate-300 leading-relaxed mb-6">
            If that email is registered, you&apos;ll receive a password reset link shortly.
            Check your inbox and spam folder.
          </p>
          <Link
            href="/login"
            className="text-sm text-navy dark:text-blue-400 font-medium hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset link."
    >
      <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-5">
        <FormField
          label="Email address"
          type="email"
          placeholder="you@university.edu"
          error={errors.email?.message}
          {...register("email")}
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-navy dark:bg-blue-600 text-white font-semibold text-sm px-5 py-3 rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          {isPending ? "Sending…" : "Send Reset Link"}
        </button>

        <div className="text-center">
          <Link
            href="/login"
            className="text-xs text-slate dark:text-slate-400 hover:text-navy dark:hover:text-white transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
