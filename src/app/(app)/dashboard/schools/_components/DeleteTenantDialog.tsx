"use client";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useDeleteTenant } from "@/hooks/services/tenants";
import type { Tenant } from "@/interfaces";

export function DeleteTenantDialog({
  tenant,
  onClose,
}: {
  tenant: Tenant | null;
  onClose: () => void;
}) {
  const { mutate, isPending } = useDeleteTenant(onClose);
  return (
    <ConfirmDialog
      open={!!tenant}
      onClose={onClose}
      onConfirm={() => tenant && mutate(tenant.id)}
      title="Delete school"
      message={`Delete "${tenant?.name}"? This will remove all users, courses, and exams for this school. This cannot be undone.`}
      isPending={isPending}
    />
  );
}
