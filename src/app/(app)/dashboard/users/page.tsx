"use client";

import { useRef, useState } from "react";
import {
  Users,
  UserPlus,
  Upload,
  Loader2,
  GraduationCap,
  BookUser,
  ShieldCheck,
} from "lucide-react";
import { useUsers, useImportStudents } from "@/hooks/services/users";
import type { User } from "@/interfaces";
import { UserRow } from "./_components/UserRow";
import { InviteAdminModal } from "./_components/InviteAdminModal";
import { InviteLecturerModal } from "./_components/InviteLecturerModal";
import { InviteStudentModal } from "./_components/InviteStudentModal";
import { DeleteUserDialog } from "./_components/DeleteUserDialog";

type Tab = "school_admin" | "lecturer" | "student";

export default function UsersPage() {
  const [tab, setTab] = useState<Tab>("lecturer");
  const [inviteAdminOpen, setInviteAdminOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteStudentOpen, setInviteStudentOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useUsers(tab);
  const users: User[] = data?.data?.data ?? [];

  const { mutate: importStudents, isPending: isImporting } =
    useImportStudents();

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
          <h1 className="font-plus text-2xl font-bold text-navy-dark dark:text-white">
            Users
          </h1>
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
                {isImporting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Upload size={15} />
                )}
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

          {/* Invite Co-Admin — only on admins tab */}
          {tab === "school_admin" && (
            <button
              onClick={() => setInviteAdminOpen(true)}
              className="flex items-center gap-2 bg-navy dark:bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 transition-colors"
            >
              <UserPlus size={15} />
              Invite Co-Admin
            </button>
          )}
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl w-fit mb-5">
        {(["school_admin", "lecturer", "student"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors capitalize ${tab === t
                ? "bg-white dark:bg-slate-700 text-navy-dark dark:text-white shadow-sm"
                : "text-slate dark:text-slate-400 hover:text-navy-dark dark:hover:text-white"
              }`}
          >
            {t === "school_admin" ? (
              <ShieldCheck size={14} />
            ) : t === "lecturer" ? (
              <BookUser size={14} />
            ) : (
              <GraduationCap size={14} />
            )}
            {t === "school_admin"
              ? "Admins"
              : t === "lecturer"
                ? "Lecturers"
                : "Students"}
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
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">
                    Name
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">
                    Email
                  </th>
                  {tab === "student" && (
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">
                      Matric No.
                    </th>
                  )}
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">
                    Role
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">
                    Joined
                  </th>
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
      <InviteAdminModal
        open={inviteAdminOpen}
        onClose={() => setInviteAdminOpen(false)}
      />
      <InviteLecturerModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />
      <InviteStudentModal
        open={inviteStudentOpen}
        onClose={() => setInviteStudentOpen(false)}
      />
      <DeleteUserDialog
        user={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ tab }: { tab: Tab }) {
  const label =
    tab === "school_admin"
      ? "admins"
      : tab === "lecturer"
        ? "lecturers"
        : "students";
  const hint =
    tab === "school_admin"
      ? "Invite a co-admin to share school management duties."
      : tab === "lecturer"
        ? "Invite lecturers to give them access to create courses and exams."
        : "Import a CSV file with student details to add students to your school.";

  return (
    <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
        <Users size={24} className="text-slate dark:text-slate-400" />
      </div>
      <h3 className="font-plus font-semibold text-navy-dark dark:text-white mb-2">
        No {label} yet
      </h3>
      <p className="text-sm text-slate dark:text-slate-400">{hint}</p>
    </div>
  );
}
