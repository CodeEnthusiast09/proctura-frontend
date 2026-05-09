"use client";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useDeleteUser } from "@/hooks/services/users";
import type { User } from "@/interfaces";

export function DeleteUserDialog({
  user,
  onClose,
}: {
  user: User | null;
  onClose: () => void;
}) {
  const { mutate, isPending } = useDeleteUser(onClose);
  return (
    <ConfirmDialog
      open={!!user}
      onClose={onClose}
      onConfirm={() => user && mutate(user.id)}
      title="Remove user"
      message={`Remove ${user?.firstName} ${user?.lastName} from this school? This cannot be undone.`}
      isPending={isPending}
    />
  );
}
