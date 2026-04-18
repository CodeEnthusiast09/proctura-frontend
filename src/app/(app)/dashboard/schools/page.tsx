"use client";
// src/app/(app)/dashboard/schools/page.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Copy,
  CheckCheck,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FormField } from "@/components/auth/FormField";
import {
  useTenants,
  useCreateTenant,
  useUpdateTenant,
  useDeleteTenant,
} from "@/hooks/services/tenants";
import { createTenantSchema, updateTenantSchema } from "@/validations/tenant";
import type { Tenant } from "@/interfaces";

type CreateFormData = InferType<typeof createTenantSchema>;
type UpdateFormData = InferType<typeof updateTenantSchema>;

export default function SchoolsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Tenant | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Tenant | null>(null);

  const { data, isLoading } = useTenants();
  const tenants: Tenant[] = data?.data?.data ?? [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-plus text-2xl font-bold text-navy-dark dark:text-white">Schools</h1>
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
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">School</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">Subdomain</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">Onboarded</th>
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
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CreateTenantModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {editTarget && (
        <EditTenantModal tenant={editTarget} onClose={() => setEditTarget(null)} />
      )}
      <DeleteTenantDialog tenant={deleteTarget} onClose={() => setDeleteTarget(null)} />
    </div>
  );
}

// ── Tenant Row ────────────────────────────────────────────────────────────────

function TenantRow({
  tenant,
  onEdit,
  onDelete,
}: {
  tenant: Tenant;
  onEdit: () => void;
  onDelete: () => void;
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
          className={`text-xs font-semibold px-2 py-0.5 rounded ${
            tenant.isActive
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
            onClick={() => update({ name: tenant.name, isActive: !tenant.isActive })}
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

// ── Create Tenant Modal ───────────────────────────────────────────────────────

function CreateTenantModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFormData>({ resolver: yupResolver(createTenantSchema) });

  const { mutate, isPending } = useCreateTenant((result) => {
    const token = result?.admin?.inviteToken;
    if (token) {
      setInviteLink(`${window.location.origin}/accept-invite?token=${token}`);
    }
    reset();
  });

  function handleClose() {
    setInviteLink(null);
    setCopied(false);
    onClose();
  }

  function copyLink() {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Success state ─────────────────────────────────────────────────────────
  if (inviteLink) {
    return (
      <Modal open={open} onClose={handleClose} title="School Onboarded" size="md">
        <div className="space-y-4">
          <p className="text-sm text-slate dark:text-slate-400">
            The school has been created. Share this invite link with the school admin so they can set up their password:
          </p>
          <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg">
            <p className="flex-1 text-xs font-mono text-navy-dark dark:text-slate-200 truncate">
              {inviteLink}
            </p>
            <button
              onClick={copyLink}
              className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-navy dark:text-blue-400 hover:text-navy-light transition-colors"
            >
              {copied ? <CheckCheck size={13} className="text-green" /> : <Copy size={13} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400">
            This link will not be shown again. Copy it before closing.
          </p>
          <div className="flex justify-end pt-1">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-semibold bg-navy dark:bg-blue-600 text-white rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  // ── Form state ────────────────────────────────────────────────────────────
  return (
    <Modal open={open} onClose={handleClose} title="Onboard School" size="lg">
      <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
        <FormField
          label="School name"
          placeholder="University of Lagos"
          error={errors.name?.message}
          {...register("name")}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-navy-dark dark:text-slate-200">
            Subdomain
          </label>
          <div className="flex items-center">
            <input
              placeholder="unilag"
              className={`flex-1 min-w-0 px-3.5 py-2.5 rounded-l-lg border-y border-l text-sm bg-white dark:bg-slate-900 text-navy-dark dark:text-white outline-none transition-colors ${
                errors.subdomain
                  ? "border-red-400"
                  : "border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500"
              }`}
              {...register("subdomain")}
            />
            <span className="px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate dark:text-slate-400 rounded-r-lg border-l-0 flex-shrink-0">
              .proctura.com
            </span>
          </div>
          {errors.subdomain && (
            <p className="text-xs text-red-500">{errors.subdomain.message}</p>
          )}
        </div>

        <p className="text-xs font-semibold text-slate uppercase tracking-wide pt-1">
          School Admin Account
        </p>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="First name"
            placeholder="Emeka"
            error={errors.adminFirstName?.message}
            {...register("adminFirstName")}
          />
          <FormField
            label="Last name"
            placeholder="Okafor"
            error={errors.adminLastName?.message}
            {...register("adminLastName")}
          />
        </div>

        <FormField
          label="Admin email"
          type="email"
          placeholder="admin@unilag.edu.ng"
          error={errors.adminEmail?.message}
          {...register("adminEmail")}
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
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
            Onboard School
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Edit Tenant Modal ─────────────────────────────────────────────────────────

function EditTenantModal({ tenant, onClose }: { tenant: Tenant; onClose: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateFormData>({
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

// ── Delete Tenant Dialog ──────────────────────────────────────────────────────

function DeleteTenantDialog({ tenant, onClose }: { tenant: Tenant | null; onClose: () => void }) {
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
