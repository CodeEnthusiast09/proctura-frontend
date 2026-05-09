"use client";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { publicApi } from "@/lib/axios";
import { storeInLocalStorage } from "@/lib/localStorage";

interface StudentAuthProps {
  onAuthenticated: () => void;
}

export function StudentAuth({ onAuthenticated }: StudentAuthProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function submit() {
    if (!identifier || !password) return;
    setIsPending(true);

    try {
      const res = await publicApi.post("/auth/login", { identifier, password });
      const data = res.data?.data;

      if (!data?.accessToken || !data?.user) {
        toast.error("Login failed. Please try again.");
        return;
      }

      if (data.user.role !== "student") {
        toast.error("Only student accounts can access exams here.");
        return;
      }

      storeInLocalStorage("token", data.accessToken);
      storeInLocalStorage("user", data.user);
      if (data.user.subdomain) {
        storeInLocalStorage("subdomain", data.user.subdomain);
      }

      onAuthenticated();
    } catch {
      // Error toast already handled by axios interceptor
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <p className="text-center text-sm font-bold tracking-widest text-slate-500 uppercase mb-8">
          Proctura
        </p>

        <div className="bg-[#161b22] border border-slate-700/60 rounded-2xl p-8">
          <h1 className="font-plus text-xl font-bold text-white mb-1">
            Sign in to take your exam
          </h1>
          <p className="text-sm text-slate-400 mb-6">
            Enter your credentials to continue.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="space-y-4"
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="student-identifier"
                className="text-sm font-medium text-slate-300"
              >
                Email or Matric Number
              </label>
              <input
                id="student-identifier"
                type="text"
                required
                placeholder="you@university.edu or CSC/2020/001"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-800/60 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="student-password"
                className="text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="student-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-800/60 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
