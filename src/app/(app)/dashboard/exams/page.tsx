"use client";

import { useState } from "react";
import { BookOpen, Plus, Loader2 } from "lucide-react";
import { useExams, useAvailableExams } from "@/hooks/services/exams";
import { useCurrentUser } from "@/hooks/common/useCurrentUser";
import type { Exam } from "@/interfaces";
import { ExamCard } from "./_components/ExamCard";
import { CreateExamModal } from "./_components/CreateExamModal";
import { EditExamModal } from "./_components/EditExamModal";
import { DeleteExam } from "./_components/DeleteExam";

export default function ExamsPage() {
  const user = useCurrentUser();
  const isStudent = user?.role === "student";
  const canManage = user?.role === "lecturer";
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Exam | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Exam | null>(null);

  const { data: allExamsData, isLoading: allLoading } = useExams();
  const { data: availableData, isLoading: availableLoading } =
    useAvailableExams(isStudent);

  const isLoading = isStudent ? availableLoading : allLoading;
  const exams: Exam[] = isStudent
    ? (availableData?.data?.data ?? [])
    : (allExamsData?.data?.data ?? []);

  const subtitle = isStudent
    ? "View and take your scheduled exams"
    : canManage
      ? "Manage exams across your courses"
      : "All exams created by lecturers in your school";

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-plus text-2xl font-bold text-navy-dark dark:text-white">
            {isStudent ? "My Exams" : "Exams"}
          </h1>
          <p className="text-sm text-slate dark:text-slate-400 mt-1">{subtitle}</p>
        </div>
        {canManage && (
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 bg-navy dark:bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 transition-colors"
          >
            <Plus size={16} />
            New Exam
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-slate" />
        </div>
      ) : exams.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <BookOpen size={24} className="text-slate dark:text-slate-400" />
          </div>
          <h3 className="font-plus font-semibold text-navy-dark dark:text-white mb-2">
            No exams yet
          </h3>
          <p className="text-sm text-slate dark:text-slate-400">
            {isStudent
              ? "No exams have been scheduled for you yet."
              : "Create your first exam to get started."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              isStudent={isStudent}
              canManage={canManage}
              onEdit={() => setEditTarget(exam)}
              onDelete={() => setDeleteTarget(exam)}
            />
          ))}
        </div>
      )}

      <CreateExamModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {editTarget && (
        <EditExamModal exam={editTarget} onClose={() => setEditTarget(null)} />
      )}
      <DeleteExam exam={deleteTarget} onClose={() => setDeleteTarget(null)} />
    </div>
  );
}
