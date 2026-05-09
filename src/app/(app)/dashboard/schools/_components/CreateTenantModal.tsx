"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { Loader2, Copy, CheckCheck } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/auth/FormField";
import { useCreateTenant } from "@/hooks/services/tenants";
import { createTenantSchema } from "@/validations/tenant";

type CreateFormData = InferType<typeof createTenantSchema>;

export function CreateTenantModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
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
      <Modal
        open={open}
        onClose={handleClose}
        title="School Onboarded"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate dark:text-slate-400">
            The school has been created. Share this invite link with the school
            admin so they can set up their password:
          </p>
          <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg">
            <p className="flex-1 text-xs font-mono text-navy-dark dark:text-slate-200 truncate">
              {inviteLink}
            </p>
            <button
              onClick={copyLink}
              className="shrink-0 flex items-center gap-1 text-xs font-semibold text-navy dark:text-blue-400 hover:text-navy-light transition-colors"
            >
              {copied ? (
                <CheckCheck size={13} className="text-green" />
              ) : (
                <Copy size={13} />
              )}
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
              className={`flex-1 min-w-0 px-3.5 py-2.5 rounded-l-lg border-y border-l text-sm bg-white dark:bg-slate-900 text-navy-dark dark:text-white outline-none transition-colors ${errors.subdomain
                  ? "border-red-400"
                  : "border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500"
                }`}
              {...register("subdomain")}
            />
            <span className="px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate dark:text-slate-400 rounded-r-lg border-l-0 shrink-0">
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
