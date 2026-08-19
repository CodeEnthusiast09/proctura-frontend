"use client";

import { useState, useMemo } from "react";
import { Building2, Plus, Loader2, Search } from "lucide-react";
import {
  useTenants,
  useBulkUpdateTenantActive,
} from "@/hooks/services/tenants";
import type { Tenant } from "@/interfaces";
import { TenantRow } from "./_components/TenantRow";
import { CreateTenantModal } from "./_components/CreateTenantModal";
import { EditTenantModal } from "./_components/EditTenantModal";
import { DeleteTenantDialog } from "./_components/DeleteTenantDialog";
import { RecoverAdminModal } from "./_components/RecoverAdminModal";
import { BulkActionBar } from "@/components/ui/BulkActionBar";

export default function SchoolsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Tenant | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Tenant | null>(null);
  const [recoverTarget, setRecoverTarget] = useState<Tenant | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const { data, isLoading } = useTenants();
  // ?? [] built a new array every render, so the useMemo below saw changed
  // deps every time and never actually memoised.
  const allTenants: Tenant[] = useMemo(() => data?.data?.data ?? [], [data]);

  const tenants = useMemo(() => {
    let list = allTenants;
    if (statusFilter === "active") list = list.filter((t) => t.isActive);
    if (statusFilter === "inactive") list = list.filter((t) => !t.isActive);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.subdomain.toLowerCase().includes(q),
      );
    }
    return list;
  }, [allTenants, search, statusFilter]);

  const { mutate: bulkUpdate, isPending: isBulkUpdating } =
    useBulkUpdateTenantActive(() => setSelectedIds(new Set()));

  const allOnPageSelected =
    tenants.length > 0 && tenants.every((t) => selectedIds.has(t.id));

  function toggleSelectAll(next: boolean) {
    if (next) setSelectedIds(new Set(tenants.map((t) => t.id)));
    else setSelectedIds(new Set());
  }

  function toggleRow(id: string, next: boolean) {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      if (next) copy.add(id);
      else copy.delete(id);
      return copy;
    });
  }

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

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate dark:text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by name or subdomain…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-navy-dark dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-navy dark:focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-sm shrink-0">
          {(["all", "active", "inactive"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 font-medium capitalize transition-colors
                ${statusFilter === s
                  ? "bg-navy dark:bg-blue-600 text-white"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <BulkActionBar
        selectedCount={selectedIds.size}
        noun="school"
        isPending={isBulkUpdating}
        onActivate={() =>
          bulkUpdate({ ids: Array.from(selectedIds), isActive: true })
        }
        onDeactivate={() =>
          bulkUpdate({ ids: Array.from(selectedIds), isActive: false })
        }
        onClear={() => setSelectedIds(new Set())}
      />

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
            {allTenants.length === 0 ? "No schools onboarded yet" : "No schools match your filter"}
          </h3>
          <p className="text-sm text-slate dark:text-slate-400">
            {allTenants.length === 0
              ? "Create a school workspace to get started."
              : "Try adjusting your search or status filter."}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={allOnPageSelected}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      aria-label="Select all"
                      className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-navy dark:text-blue-500 focus:ring-blue-500/40 cursor-pointer"
                    />
                  </th>
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
                    selected={selectedIds.has(tenant.id)}
                    onSelectChange={(next) => toggleRow(tenant.id, next)}
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
