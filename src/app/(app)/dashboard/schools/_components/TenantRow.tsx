"use client";

import {
  Loader2,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  ShieldPlus,
} from "lucide-react";
import { useUpdateTenant } from "@/hooks/services/tenants";
import type { Tenant } from "@/interfaces";

export function TenantRow({
  tenant,
  onEdit,
  onDelete,
  onRecoverAdmin,
}: {
  tenant: Tenant;
  onEdit: () => void;
  onDelete: () => void;
  onRecoverAdmin: () => void;
}) {
  const { mutate: update, isPending } = useUpdateTenant(tenant.id);

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td className="px-5 py-3.5 font-semibold text-navy-dark dark:text-white">
        {tenant.name}
      </td>
      <td className="px-5 py-3.5">
        <span className="flex items-center gap-1.5 font-mono text-xs text-slate dark:text-slate-400">
          {tenant.subdomain}.proctura.com
          <ExternalLink size={11} className="opacity-50" />
        </span>
      </td>
      <td className="px-5 py-3.5">
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded ${tenant.isActive
              ? "bg-green-pale dark:bg-green/10 text-green"
              : "bg-red-50 dark:bg-red-900/20 text-red-500"
            }`}
        >
          {tenant.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-5 py-3.5 text-slate dark:text-slate-400 text-xs">
        {new Date(tenant.createdAt).toLocaleDateString()}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() =>
              update({ name: tenant.name, isActive: !tenant.isActive })
            }
            disabled={isPending}
            title={tenant.isActive ? "Deactivate" : "Activate"}
            className="p-1.5 rounded-lg text-slate-400 hover:text-navy dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : tenant.isActive ? (
              <ToggleRight size={16} className="text-green" />
            ) : (
              <ToggleLeft size={16} />
            )}
          </button>
          <button
            onClick={onRecoverAdmin}
            title="Invite school admin (recovery)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-navy dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <ShieldPlus size={14} />
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-slate-400 hover:text-navy dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
