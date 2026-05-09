"use client";

import { Loader2, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useToggleUserActive } from "@/hooks/services/users";
import type { User } from "@/interfaces";

export const ROLE_LABEL: Record<string, string> = {
  lecturer: "Lecturer",
  student: "Student",
  school_admin: "Admin",
};

export function UserRow({
  user,
  showMatric,
  onDelete,
}: {
  user: User;
  showMatric: boolean;
  onDelete: () => void;
}) {
  const { mutate: toggleActive, isPending: isToggling } = useToggleUserActive();

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td className="px-5 py-3.5 font-medium text-navy-dark dark:text-white">
        {user.firstName} {user.lastName}
      </td>
      <td className="px-5 py-3.5 text-slate dark:text-slate-400">
        {user.email}
      </td>
      {showMatric && (
        <td className="px-5 py-3.5 text-slate dark:text-slate-400 font-mono text-xs">
          {user.matricNumber ?? "—"}
        </td>
      )}
      <td className="px-5 py-3.5">
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-navy/10 dark:bg-navy/20 text-navy dark:text-blue-300">
          {ROLE_LABEL[user.role] ?? user.role}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex flex-col gap-1">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded w-fit ${user.isActive
                ? "bg-green-pale dark:bg-green/10 text-green"
                : "bg-red-50 dark:bg-red-900/20 text-red-500"
              }`}
          >
            {user.isActive ? "Active" : "Inactive"}
          </span>
          {!user.isVerified && (
            <span className="text-xs text-amber-500 font-medium">
              Pending invite
            </span>
          )}
        </div>
      </td>
      <td className="px-5 py-3.5 text-slate dark:text-slate-400 text-xs">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() =>
              toggleActive({ id: user.id, isActive: !user.isActive })
            }
            disabled={isToggling}
            title={user.isActive ? "Deactivate" : "Activate"}
            className="p-1.5 rounded-lg text-slate-400 hover:text-navy dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            {isToggling ? (
              <Loader2 size={14} className="animate-spin" />
            ) : user.isActive ? (
              <ToggleRight size={16} className="text-green" />
            ) : (
              <ToggleLeft size={16} />
            )}
          </button>
          <button
            onClick={onDelete}
            title="Remove user"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
