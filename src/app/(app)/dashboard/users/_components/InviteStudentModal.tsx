"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/auth/FormField";
import { useInviteStudent } from "@/hooks/services/users";
import { inviteStudentSchema } from "@/validations/user";

type InviteStudentFormData = InferType<typeof inviteStudentSchema>;

export function InviteStudentModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteStudentFormData>({
    resolver: yupResolver(inviteStudentSchema),
  });

  const { mutate, isPending } = useInviteStudent(() => {
    reset();
    onClose();
  });

  return (
    <Modal open={open} onClose={onClose} title="Invite Student" size="md">
      <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="First name"
            placeholder="Chidi"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <FormField
            label="Last name"
            placeholder="Okeke"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>
        <FormField
          label="Email address"
          type="email"
          placeholder="chidi@ui.edu.ng"
          error={errors.email?.message}
          {...register("email")}
        />
        <FormField
          label="Matric number"
          placeholder="CSC/2021/001"
          error={errors.matricNumber?.message}
          {...register("matricNumber")}
        />
        <p className="text-xs text-slate dark:text-slate-400">
          The student will receive an email with a link to set up their
          password.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-navy dark:bg-blue-600 text-white rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 disabled:opacity-60 transition-colors"
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            Send Invitation
          </button>
        </div>
      </form>
    </Modal>
  );
}
