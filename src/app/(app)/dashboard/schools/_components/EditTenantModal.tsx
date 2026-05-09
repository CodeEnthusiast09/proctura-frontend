"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/auth/FormField";
import { useUpdateTenant } from "@/hooks/services/tenants";
import { updateTenantSchema } from "@/validations/tenant";
import type { Tenant } from "@/interfaces";

type UpdateFormData = InferType<typeof updateTenantSchema>;

export function EditTenantModal({
  tenant,
  onClose,
}: {
  tenant: Tenant;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateFormData>({
    resolver: yupResolver(updateTenantSchema),
    defaultValues: { name: tenant.name },
  });
  const { mutate, isPending } = useUpdateTenant(tenant.id, onClose);

  return (
    <Modal open onClose={onClose} title="Edit School" size="sm">
      <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
        <FormField
          label="School name"
          error={errors.name?.message}
          {...register("name")}
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
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
