"use client";

import { useState } from "react";
import { Building2, Plus, Loader2 } from "lucide-react";
import { useTenants } from "@/hooks/services/tenants";
import type { Tenant } from "@/interfaces";
import { TenantRow } from "./_components/TenantRow";
import { CreateTenantModal } from "./_components/CreateTenantModal";
import { EditTenantModal } from "./_components/EditTenantModal";
import { DeleteTenantDialog } from "./_components/DeleteTenantDialog";
import { RecoverAdminModal } from "./_components/RecoverAdminModal";

export default function SchoolsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Tenant | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Tenant | null>(null);
  const [recoverTarget, setRecoverTarget] = useState<Tenant | null>(null);

  const { data, isLoading } = useTenants();
  const tenants: Tenant[] = data?.data?.data ?? [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-plus text-2xl font-bold text-navy-dark dark:text-white">
            Schools
          </h1>
          <p className="text-sm text-slate dark:text-slate-400 mt-1">
            All onboarded schools and their workspaces
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 bg-navy dark:bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 transition-colors"
        >
          <Plus size={16} />
          Onboard School
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-slate" />
        </div>
      ) : tenants.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <Building2 size={24} className="text-slate dark:text-slate-400" />
          </div>
          <h3 className="font-plus font-semibold text-navy-dark dark:text-white mb-2">
            No schools onboarded yet
          </h3>
          <p className="text-sm text-slate dark:text-slate-400">
            Create a school workspace to get started.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">
                    School
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">
                    Subdomain
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">
                    Onboarded
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {tenants.map((tenant) => (
                  <TenantRow
                    key={tenant.id}
                    tenant={tenant}
                    onEdit={() => setEditTarget(tenant)}
                    onDelete={() => setDeleteTarget(tenant)}
                    onRecoverAdmin={() => setRecoverTarget(tenant)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CreateTenantModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      {editTarget && (
        <EditTenantModal
          tenant={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}
      <DeleteTenantDialog
        tenant={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
      <RecoverAdminModal
        tenant={recoverTarget}
        onClose={() => setRecoverTarget(null)}
      />
    </div>
  );
}
