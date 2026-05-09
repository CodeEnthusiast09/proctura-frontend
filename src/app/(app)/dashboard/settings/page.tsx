"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { Eye, EyeOff, Loader2, UserCircle, KeyRound } from "lucide-react";
import { FormField } from "@/components/auth";
import { useCurrentUser } from "@/hooks/common/useCurrentUser";
import { useUpdateMe, useChangePassword } from "@/hooks/services/profile";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "@/validations/profile";

type ProfileFormData = InferType<typeof updateProfileSchema>;
type PasswordFormData = InferType<typeof changePasswordSchema>;

export default function SettingsPage() {
  const user = useCurrentUser();

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-plus text-2xl font-bold text-navy-dark dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-slate dark:text-slate-400 mt-1">
          Update your profile and password
        </p>
      </div>

      <ProfileSection
        defaultFirstName={user?.firstName ?? ""}
        defaultLastName={user?.lastName ?? ""}
        email={user?.email ?? ""}
      />

      <PasswordSection />
    </div>
  );
}

function ProfileSection({
  defaultFirstName,
  defaultLastName,
  email,
}: {
  defaultFirstName: string;
  defaultLastName: string;
  email: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(updateProfileSchema),
    defaultValues: { firstName: defaultFirstName, lastName: defaultLastName },
  });

  const { mutate, isPending } = useUpdateMe((u) => {
    reset({ firstName: u.firstName, lastName: u.lastName });
  });

  return (
    <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-5">
        <UserCircle size={18} className="text-navy dark:text-blue-400" />
        <h2 className="font-plus font-semibold text-navy-dark dark:text-white">
          Profile
        </h2>
      </div>

      <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="First name"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <FormField
            label="Last name"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-navy-dark dark:text-slate-200">
            Email address
          </label>
          <input
            value={email}
            disabled
            className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-sm text-slate-500 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
            Contact your school admin to change your email.
          </p>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isPending || !isDirty}
            className="flex items-center gap-2 bg-navy dark:bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}

function PasswordSection() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: yupResolver(changePasswordSchema),
  });

  const { mutate, isPending } = useChangePassword(() => {
    reset();
  });

  return (
    <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <KeyRound size={18} className="text-navy dark:text-blue-400" />
        <h2 className="font-plus font-semibold text-navy-dark dark:text-white">
          Change password
        </h2>
      </div>

      <form
        onSubmit={handleSubmit((d) =>
          mutate({
            currentPassword: d.currentPassword,
            newPassword: d.newPassword,
          }),
        )}
        className="space-y-4"
      >
        <PasswordField
          id="currentPassword"
          label="Current password"
          show={showCurrent}
          onToggle={() => setShowCurrent((v) => !v)}
          error={errors.currentPassword?.message}
          {...register("currentPassword")}
        />
        <PasswordField
          id="newPassword"
          label="New password"
          show={showNew}
          onToggle={() => setShowNew((v) => !v)}
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm new password"
          show={showConfirm}
          onToggle={() => setShowConfirm((v) => !v)}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 bg-navy dark:bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 disabled:opacity-60 transition-colors"
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            Update password
          </button>
        </div>
      </form>
    </div>
  );
}

interface PasswordFieldProps extends React.ComponentProps<"input"> {
  label: string;
  show: boolean;
  onToggle: () => void;
  error?: string;
}

const PasswordField = ({
  label,
  show,
  onToggle,
  error,
  id,
  ...rest
}: PasswordFieldProps) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className="text-sm font-medium text-navy-dark dark:text-slate-200"
    >
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        placeholder="••••••••"
        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white dark:bg-slate-900 text-navy-dark dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-colors pr-10
          ${error
            ? "border-red-400 dark:border-red-500"
            : "border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500"
          }`}
        {...rest}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate dark:hover:text-slate-300 transition-colors"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
    {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
  </div>
);
