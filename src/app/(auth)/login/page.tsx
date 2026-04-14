"use client";
// src/app/(auth)/login/page.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { AuthCard, FormField } from "@/components/auth";
import { useLogin } from "@/hooks/services/auth";
import { loginSchema } from "@/validations/auth";

type FormData = InferType<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(loginSchema) });

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your Proctura account"
    >
      <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-5">
        <FormField
          label="Email address"
          type="email"
          placeholder="you@university.edu"
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium text-navy-dark dark:text-slate-200"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white dark:bg-slate-900 text-navy-dark dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-colors pr-10
                ${errors.password
                  ? "border-red-400 dark:border-red-500 focus:border-red-400"
                  : "border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500"
                }`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate dark:hover:text-slate-300 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 dark:text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs text-navy dark:text-blue-400 font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-navy dark:bg-blue-600 text-white font-semibold text-sm px-5 py-3 rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          {isPending ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </AuthCard>
  );
}
