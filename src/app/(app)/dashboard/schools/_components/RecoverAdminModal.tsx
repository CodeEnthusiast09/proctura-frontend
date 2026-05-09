"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/auth/FormField";
import { useInviteAdminToTenant } from "@/hooks/services/users";
import { inviteAdminSchema } from "@/validations/user";
import type { Tenant } from "@/interfaces";

type FormData = InferType<typeof inviteAdminSchema>;

export function RecoverAdminModal({
  tenant,
  onClose,
}: {
  tenant: Tenant | null;
  onClose: () => void;
}) {
  const open = !!tenant;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(inviteAdminSchema) });

  const { mutate, isPending } = useInviteAdminToTenant(tenant?.id ?? "", () => {
    reset();
    onClose();
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Recover: Invite School Admin"
      size="md"
    >
      <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
        {tenant && (
          <p className="text-sm text-slate dark:text-slate-400">
            Inviting a school admin into{" "}
            <span className="font-semibold text-navy-dark dark:text-white">
              {tenant.name}
            </span>
            . Use this to recover a school whose admins are unavailable. Capped
            at 2 active admins.
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="First name"
            placeholder="Ada"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <FormField
            label="Last name"
            placeholder="Okonkwo"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>
        <FormField
          label="Email address"
          type="email"
          placeholder="ada@unilag.edu.ng"
          error={errors.email?.message}
          {...register("email")}
        />

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
