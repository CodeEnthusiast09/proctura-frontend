"use client";
// src/app/(app)/dashboard/users/page.tsx
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import {
  Users,
  UserPlus,
  Upload,
  Loader2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  GraduationCap,
  BookUser,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FormField } from "@/components/auth/FormField";
import {
  useUsers,
  useInviteLecturer,
  useInviteStudent,
  useImportStudents,
  useToggleUserActive,
  useDeleteUser,
} from "@/hooks/services/users";
import { inviteLecturerSchema, inviteStudentSchema } from "@/validations/user";
import type { User } from "@/interfaces";

type Tab = "lecturer" | "student";
type InviteLecturerFormData = InferType<typeof inviteLecturerSchema>;
type InviteStudentFormData = InferType<typeof inviteStudentSchema>;

const ROLE_LABEL: Record<string, string> = {
  lecturer: "Lecturer",
  student: "Student",
  school_admin: "Admin",
};

export default function UsersPage() {
  const [tab, setTab] = useState<Tab>("lecturer");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteStudentOpen, setInviteStudentOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useUsers(tab);
  const users: User[] = data?.data?.data ?? [];

  const { mutate: importStudents, isPending: isImporting } = useImportStudents();

  function handleCsvChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    importStudents(file);
    // Reset so the same file can be re-uploaded if needed
    e.target.value = "";
  }

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-plus text-2xl font-bold text-navy-dark dark:text-white">Users</h1>
          <p className="text-sm text-slate dark:text-slate-400 mt-1">
            Manage lecturers and students in your school
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Students tab actions */}
          {tab === "student" && (
            <>
              <input
                ref={csvInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleCsvChange}
              />
              <button
                onClick={() => csvInputRef.current?.click()}
                disabled={isImporting}
                className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-navy-dark dark:text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:border-navy/30 dark:hover:border-slate-500 disabled:opacity-60 transition-colors"
              >
                {isImporting ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                Import CSV
              </button>
              <button
                onClick={() => setInviteStudentOpen(true)}
                className="flex items-center gap-2 bg-navy dark:bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 transition-colors"
              >
                <UserPlus size={15} />
                Invite Student
              </button>
            </>
          )}

          {/* Invite — only on lecturers tab */}
          {tab === "lecturer" && (
            <button
              onClick={() => setInviteOpen(true)}
              className="flex items-center gap-2 bg-navy dark:bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 transition-colors"
            >
              <UserPlus size={15} />
              Invite Lecturer
            </button>
          )}
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl w-fit mb-5">
        {(["lecturer", "student"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors capitalize ${
              tab === t
                ? "bg-white dark:bg-slate-700 text-navy-dark dark:text-white shadow-sm"
                : "text-slate dark:text-slate-400 hover:text-navy-dark dark:hover:text-white"
            }`}
          >
            {t === "lecturer" ? <BookUser size={14} /> : <GraduationCap size={14} />}
            {t === "lecturer" ? "Lecturers" : "Students"}
          </button>
        ))}
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-slate" />
        </div>
      ) : users.length === 0 ? (
        <EmptyState tab={tab} />
      ) : (
        <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">Email</th>
                  {tab === "student" && (
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">Matric No.</th>
                  )}
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">Role</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">Joined</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {users.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    showMatric={tab === "student"}
                    onDelete={() => setDeleteTarget(user)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <InviteLecturerModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
      <InviteStudentModal open={inviteStudentOpen} onClose={() => setInviteStudentOpen(false)} />
      <DeleteUserDialog user={deleteTarget} onClose={() => setDeleteTarget(null)} />
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ tab }: { tab: Tab }) {
  return (
    <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
        <Users size={24} className="text-slate dark:text-slate-400" />
      </div>
      <h3 className="font-plus font-semibold text-navy-dark dark:text-white mb-2">
        No {tab === "lecturer" ? "lecturers" : "students"} yet
      </h3>
      <p className="text-sm text-slate dark:text-slate-400">
        {tab === "lecturer"
          ? "Invite lecturers to give them access to create courses and exams."
          : "Import a CSV file with student details to add students to your school."}
      </p>
    </div>
  );
}

// ── User Row ──────────────────────────────────────────────────────────────────

function UserRow({
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
      <td className="px-5 py-3.5 text-slate dark:text-slate-400">{user.email}</td>
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
            className={`text-xs font-semibold px-2 py-0.5 rounded w-fit ${
              user.isActive
                ? "bg-green-pale dark:bg-green/10 text-green"
                : "bg-red-50 dark:bg-red-900/20 text-red-500"
            }`}
          >
            {user.isActive ? "Active" : "Inactive"}
          </span>
          {!user.isVerified && (
            <span className="text-xs text-amber-500 font-medium">Pending invite</span>
          )}
        </div>
      </td>
      <td className="px-5 py-3.5 text-slate dark:text-slate-400 text-xs">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => toggleActive({ id: user.id, isActive: !user.isActive })}
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

// ── Invite Lecturer Modal ─────────────────────────────────────────────────────

function InviteLecturerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteLecturerFormData>({ resolver: yupResolver(inviteLecturerSchema) });

  const { mutate, isPending } = useInviteLecturer(() => {
    reset();
    onClose();
  });

  return (
    <Modal open={open} onClose={onClose} title="Invite Lecturer" size="md">
      <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
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

        <p className="text-xs text-slate dark:text-slate-400">
          The lecturer will receive an email with a link to set up their password.
        </p>

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

// ── Invite Student Modal ──────────────────────────────────────────────────────

function InviteStudentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteStudentFormData>({ resolver: yupResolver(inviteStudentSchema) });

  const { mutate, isPending } = useInviteStudent(() => {
    reset();
    onClose();
  });

  return (
    <Modal open={open} onClose={onClose} title="Invite Student" size="md">
      <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="First name"
            placeholder="Chidi"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <FormField
            label="Last name"
            placeholder="Okeke"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>
        <FormField
          label="Email address"
          type="email"
          placeholder="chidi@ui.edu.ng"
          error={errors.email?.message}
          {...register("email")}
        />
        <FormField
          label="Matric number"
          placeholder="CSC/2021/001"
          error={errors.matricNumber?.message}
          {...register("matricNumber")}
        />
        <p className="text-xs text-slate dark:text-slate-400">
          The student will receive an email with a link to set up their password.
        </p>
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

// ── Delete User Dialog ────────────────────────────────────────────────────────

function DeleteUserDialog({ user, onClose }: { user: User | null; onClose: () => void }) {
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
