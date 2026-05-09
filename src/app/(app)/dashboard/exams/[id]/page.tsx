"use client";

import { useState } from "react";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Loader2, Clock, BarChart3 } from "lucide-react";
import { useExam, useUpdateExamStatus } from "@/hooks/services/exams";
import type { Question, TestCase } from "@/interfaces";
import { QuestionCard } from "./_components/QuestionCard";
import { QuestionModal } from "./_components/QuestionModal";
import { TestCaseModal } from "./_components/TestCaseModal";
import {
  DeleteQuestionDialog,
  DeleteTestCaseDialog,
} from "./_components/DeleteDialogs";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
  scheduled: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300",
  active: "bg-green-pale dark:bg-green/10 text-green",
  closed: "bg-red-50 dark:bg-red-900/20 text-red-500",
};

const STATUS_TRANSITIONS: Record<string, string> = {
  draft: "scheduled",
  scheduled: "active",
  active: "closed",
  closed: "draft",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Mark as Scheduled",
  scheduled: "Open Exam",
  active: "Close Exam",
  closed: "Reset to Draft",
};

export default function ExamBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useExam(id);
  const exam = data?.data?.data;
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [addQOpen, setAddQOpen] = useState(false);
  const [editQ, setEditQ] = useState<Question | null>(null);
  const [deleteQ, setDeleteQ] = useState<Question | null>(null);
  const [addTCFor, setAddTCFor] = useState<string | null>(null);
  const [editTC, setEditTC] = useState<{
    tc: TestCase;
    questionId: string;
  } | null>(null);
  const [deleteTC, setDeleteTC] = useState<TestCase | null>(null);

  const updateExamStatus = useUpdateExamStatus(id);

  function advanceStatus() {
    if (!exam) return;
    const next = STATUS_TRANSITIONS[exam.status];
    if (next) updateExamStatus.mutate(next);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-slate" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-center py-20 text-slate dark:text-slate-400">
        Exam not found.
      </div>
    );
  }

  const questions = exam.questions ?? [];
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/exams"
          className="inline-flex items-center gap-1.5 text-sm text-slate dark:text-slate-400 hover:text-navy dark:hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={14} /> Back to Exams
        </Link>

        <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                {exam.course && (
                  <span className="text-xs font-bold font-mono bg-navy/10 dark:bg-navy/30 text-navy dark:text-blue-300 px-2 py-0.5 rounded">
                    {exam.course.code}
                  </span>
                )}
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${STATUS_STYLES[exam.status]}`}
                >
                  {exam.status}
                </span>
              </div>
              <h1 className="font-plus text-xl font-bold text-navy-dark dark:text-white mb-2">
                {exam.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-xs text-slate dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {exam.durationMinutes} min
                </span>
                <span className="flex items-center gap-1">
                  <BarChart3 size={12} />
                  {totalPoints} pts total
                </span>
                <span className="font-mono">{exam.languageName}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {STATUS_TRANSITIONS[exam.status] && (
                <button
                  onClick={advanceStatus}
                  disabled={updateExamStatus.isPending}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-navy dark:bg-blue-600 text-white rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 disabled:opacity-60 transition-colors"
                >
                  {updateExamStatus.isPending && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  {STATUS_LABELS[exam.status]}
                </button>
              )}
              <Link
                href={`/dashboard/exams/${id}/results`}
                className="px-4 py-2 text-sm font-semibold text-navy dark:text-blue-300 bg-navy/5 dark:bg-navy/20 rounded-lg hover:bg-navy/10 transition-colors"
              >
                View Results
              </Link>
            </div>
          </div>

          {exam.instructions && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate dark:text-slate-400 font-medium mb-1">
                Instructions
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {exam.instructions}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-plus font-bold text-navy-dark dark:text-white">
          Questions{" "}
          <span className="text-slate dark:text-slate-400 font-normal">
            ({questions.length})
          </span>
        </h2>
        {exam.status === "draft" && (
          <button
            onClick={() => setAddQOpen(true)}
            className="flex items-center gap-2 bg-navy dark:bg-blue-600 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 transition-colors"
          >
            <Plus size={15} />
            Add Question
          </button>
        )}
      </div>

      {questions.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/60 border border-dashed border-slate-200 dark:border-slate-600 rounded-2xl p-12 text-center">
          <p className="text-sm text-slate dark:text-slate-400 mb-3">
            No questions yet.
          </p>
          {exam.status === "draft" && (
            <button
              onClick={() => setAddQOpen(true)}
              className="text-sm font-semibold text-navy dark:text-blue-400 hover:underline"
            >
              Add the first question
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={idx}
              examId={id}
              examStatus={exam.status}
              expanded={expandedQ === q.id}
              onToggle={() => setExpandedQ(expandedQ === q.id ? null : q.id)}
              onEdit={() => setEditQ(q)}
              onDelete={() => setDeleteQ(q)}
              onAddTestCase={() => setAddTCFor(q.id)}
              onEditTestCase={(tc) => setEditTC({ tc, questionId: q.id })}
              onDeleteTestCase={(tc) => setDeleteTC(tc)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <QuestionModal
        open={addQOpen}
        onClose={() => setAddQOpen(false)}
        mode="add"
        examId={id}
      />
      {editQ && (
        <QuestionModal
          open
          onClose={() => setEditQ(null)}
          mode="edit"
          examId={id}
          question={editQ}
        />
      )}

      {addTCFor && (
        <TestCaseModal
          open
          onClose={() => setAddTCFor(null)}
          mode="add"
          examId={id}
          questionId={addTCFor}
        />
      )}
      {editTC && (
        <TestCaseModal
          open
          onClose={() => setEditTC(null)}
          mode="edit"
          examId={id}
          questionId={editTC.questionId}
          testCase={editTC.tc}
        />
      )}
      <DeleteTestCaseDialog
        testCase={deleteTC}
        examId={id}
        onClose={() => setDeleteTC(null)}
      />
      <DeleteQuestionDialog
        question={deleteQ}
        examId={id}
        onClose={() => setDeleteQ(null)}
      />
    </div>
  );
}
