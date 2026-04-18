"use client";
// src/app/(app)/dashboard/exams/[id]/page.tsx
import { useState, useCallback } from "react";
import { use } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import Link from "next/link";
import {
  ArrowLeft, Plus, Pencil, Trash2, Loader2,
  ChevronDown, ChevronUp, Eye, EyeOff,
  Clock, BarChart3,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FormField } from "@/components/auth/FormField";
import {
  useExam,
  useAddQuestion, useUpdateQuestion, useDeleteQuestion,
  useAddTestCase, useUpdateTestCase, useDeleteTestCase,
  useUpdateExamStatus,
} from "@/hooks/services/exams";
import { questionSchema } from "@/validations/question";
import { testCaseSchema } from "@/validations/testCase";
import type { Question, TestCase } from "@/interfaces";

type QuestionFormData = InferType<typeof questionSchema>;
type TestCaseFormData = InferType<typeof testCaseSchema>;

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

export default function ExamBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading } = useExam(id);
  const exam = data?.data?.data;
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [addQOpen, setAddQOpen] = useState(false);
  const [editQ, setEditQ] = useState<Question | null>(null);
  const [deleteQ, setDeleteQ] = useState<Question | null>(null);
  const [addTCFor, setAddTCFor] = useState<string | null>(null);
  const [editTC, setEditTC] = useState<{ tc: TestCase; questionId: string } | null>(null);
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
                <span className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${STATUS_STYLES[exam.status]}`}>
                  {exam.status}
                </span>
              </div>
              <h1 className="font-plus text-xl font-bold text-navy-dark dark:text-white mb-2">
                {exam.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-xs text-slate dark:text-slate-400">
                <span className="flex items-center gap-1"><Clock size={12} />{exam.durationMinutes} min</span>
                <span className="flex items-center gap-1"><BarChart3 size={12} />{totalPoints} pts total</span>
                <span className="font-mono">{exam.languageName}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {STATUS_TRANSITIONS[exam.status] && (
                <button
                  onClick={advanceStatus}
                  disabled={updateExamStatus.isPending}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-navy dark:bg-blue-600 text-white rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 disabled:opacity-60 transition-colors"
                >
                  {updateExamStatus.isPending && <Loader2 size={14} className="animate-spin" />}
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
              <p className="text-xs text-slate dark:text-slate-400 font-medium mb-1">Instructions</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{exam.instructions}</p>
            </div>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-plus font-bold text-navy-dark dark:text-white">
          Questions <span className="text-slate dark:text-slate-400 font-normal">({questions.length})</span>
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
          <p className="text-sm text-slate dark:text-slate-400 mb-3">No questions yet.</p>
          {exam.status === "draft" && (
            <button onClick={() => setAddQOpen(true)} className="text-sm font-semibold text-navy dark:text-blue-400 hover:underline">
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

// ── QuestionCard ──────────────────────────────────────────────────────────────

function QuestionCard({
  question, index, examId, examStatus, expanded, onToggle,
  onEdit, onDelete, onAddTestCase, onEditTestCase, onDeleteTestCase,
}: {
  question: Question;
  index: number;
  examId: string;
  examStatus: string;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddTestCase: () => void;
  onEditTestCase: (tc: TestCase) => void;
  onDeleteTestCase: (tc: TestCase) => void;
}) {
  const testCases = question.testCases ?? [];
  const isDraft = examStatus === "draft";

  return (
    <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
      {/* Question header */}
      <div
        className="flex items-start justify-between gap-4 p-5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="w-7 h-7 rounded-lg bg-navy dark:bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            {index + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-navy-dark dark:text-white font-medium leading-relaxed line-clamp-2">
              {question.body}
            </p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate dark:text-slate-400">
              <span>{question.points} pts</span>
              <span>{testCases.length} test case{testCases.length !== 1 ? "s" : ""}</span>
              <span>{testCases.filter((tc) => tc.isHidden).length} hidden</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          {isDraft && (
            <>
              <button onClick={onEdit} className="p-1.5 rounded-lg text-slate-400 hover:text-navy dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Pencil size={14} />
              </button>
              <button onClick={onDelete} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <Trash2 size={14} />
              </button>
            </>
          )}
          <button onClick={onToggle} className="p-1.5 rounded-lg text-slate-400 hover:text-navy dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Test cases */}
      {expanded && (
        <div className="border-t border-slate-100 dark:border-slate-700 px-5 py-4 bg-slate-50 dark:bg-slate-800/30">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate uppercase tracking-wide">Test Cases</p>
            {isDraft && (
              <button
                onClick={onAddTestCase}
                className="flex items-center gap-1 text-xs font-semibold text-navy dark:text-blue-400 hover:underline"
              >
                <Plus size={12} /> Add test case
              </button>
            )}
          </div>

          {testCases.length === 0 ? (
            <p className="text-xs text-slate dark:text-slate-500 py-2">No test cases yet.</p>
          ) : (
            <div className="space-y-2">
              {testCases.map((tc, i) => (
                <div
                  key={tc.id}
                  className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0 font-mono text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-slate dark:text-slate-500 flex-shrink-0">in:</span>
                        <span className="text-navy-dark dark:text-slate-200 truncate">{tc.input ?? "(none)"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate dark:text-slate-500 flex-shrink-0">out:</span>
                        <span className="text-green truncate">{tc.expectedOutput}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded flex items-center gap-1 ${tc.isHidden ? "bg-orange-50 dark:bg-orange-900/20 text-orange-500" : "bg-slate-100 dark:bg-slate-700 text-slate-500"}`}>
                        {tc.isHidden ? <><EyeOff size={10} /> Hidden</> : <><Eye size={10} /> Visible</>}
                      </span>
                      {isDraft && (
                        <>
                          <button onClick={() => onEditTestCase(tc)} className="p-1 rounded text-slate-400 hover:text-navy dark:hover:text-white transition-colors">
                            <Pencil size={12} />
                          </button>
                          <button onClick={() => onDeleteTestCase(tc)} className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── QuestionModal ─────────────────────────────────────────────────────────────

function QuestionModal({
  open, onClose, mode, examId, question,
}: {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  examId: string;
  question?: Question;
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<QuestionFormData>({
    resolver: yupResolver(questionSchema),
    defaultValues: question ? { body: question.body, points: question.points } : { points: 10 },
  });

  const add = useAddQuestion(examId, () => { reset(); onClose(); });
  const edit = useUpdateQuestion(examId, question?.id ?? "", onClose);
  const isPending = add.isPending || edit.isPending;

  return (
    <Modal open={open} onClose={onClose} title={mode === "add" ? "Add Question" : "Edit Question"} size="md">
      <form onSubmit={handleSubmit((d) => mode === "add" ? add.mutate(d) : edit.mutate(d))} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-navy-dark dark:text-slate-200">Question</label>
          <textarea
            rows={4}
            placeholder="Write a function that reverses a string..."
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white dark:bg-slate-900 text-navy-dark dark:text-white placeholder:text-slate-400 outline-none transition-colors resize-none ${errors.body ? "border-red-400" : "border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500"}`}
            {...register("body")}
          />
          {errors.body && <p className="text-xs text-red-500">{errors.body.message}</p>}
        </div>
        <FormField label="Points" type="number" error={errors.points?.message} {...register("points", { valueAsNumber: true })} />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
          <button type="submit" disabled={isPending} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-navy dark:bg-blue-600 text-white rounded-lg hover:bg-navy-light disabled:opacity-60 transition-colors">
            {isPending && <Loader2 size={14} className="animate-spin" />}
            {mode === "add" ? "Add" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── TestCaseModal ─────────────────────────────────────────────────────────────

type TestCaseRow = { input: string; expectedOutput: string; isHidden: boolean };

const emptyRow = (): TestCaseRow => ({ input: "", expectedOutput: "", isHidden: false });

function TestCaseModal({
  open, onClose, mode, examId, questionId, testCase,
}: {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  examId: string;
  questionId: string;
  testCase?: TestCase;
}) {
  const [rows, setRows] = useState<TestCaseRow[]>([emptyRow()]);
  const [errors, setErrors] = useState<string[]>([]);

  const resetRows = useCallback(() => { setRows([emptyRow()]); setErrors([]); }, []);

  const add = useAddTestCase(examId, questionId, () => { resetRows(); onClose(); });

  const { register, handleSubmit, reset, formState: { errors: editErrors } } = useForm<TestCaseFormData>({
    resolver: yupResolver(testCaseSchema),
    defaultValues: testCase
      ? { input: testCase.input ?? "", expectedOutput: testCase.expectedOutput, isHidden: testCase.isHidden }
      : { isHidden: false },
  });
  const edit = useUpdateTestCase(examId, testCase?.id ?? "", onClose);

  function updateRow(i: number, field: keyof TestCaseRow, value: string | boolean) {
    setRows((prev) => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  }

  function addRow() { setRows((prev) => [...prev, emptyRow()]); }

  function removeRow(i: number) { setRows((prev) => prev.filter((_, idx) => idx !== i)); }

  function submitAdd() {
    const errs = rows.map((r) => r.expectedOutput.trim() === "" ? "Expected output is required" : "");
    setErrors(errs);
    if (errs.some(Boolean)) return;
    add.mutate(rows.map((r) => ({ input: r.input, expectedOutput: r.expectedOutput, isHidden: r.isHidden })));
  }

  if (mode === "edit") {
    return (
      <Modal open={open} onClose={onClose} title="Edit Test Case" size="sm">
        <form onSubmit={handleSubmit((d) => edit.mutate(d))} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-navy-dark dark:text-slate-200">Input <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea rows={2} placeholder="hello" className="w-full px-3.5 py-2.5 rounded-lg border text-sm font-mono bg-white dark:bg-slate-900 text-navy-dark dark:text-white placeholder:text-slate-400 outline-none border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500 resize-none" {...register("input")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-navy-dark dark:text-slate-200">Expected Output</label>
            <textarea rows={2} placeholder="olleh" className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-mono bg-white dark:bg-slate-900 text-navy-dark dark:text-white placeholder:text-slate-400 outline-none resize-none ${editErrors.expectedOutput ? "border-red-400" : "border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500"}`} {...register("expectedOutput")} />
            {editErrors.expectedOutput && <p className="text-xs text-red-500">{editErrors.expectedOutput.message}</p>}
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded accent-navy" {...register("isHidden")} />
            <div>
              <p className="text-sm font-medium text-navy-dark dark:text-white">Hidden test case</p>
              <p className="text-xs text-slate dark:text-slate-400">Students won't see this input/output during the exam</p>
            </div>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => { reset(); onClose(); }} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
            <button type="submit" disabled={edit.isPending} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-navy dark:bg-blue-600 text-white rounded-lg hover:bg-navy-light disabled:opacity-60 transition-colors">
              {edit.isPending && <Loader2 size={14} className="animate-spin" />}
              Save
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={() => { resetRows(); onClose(); }} title="Add Test Cases" size="md">
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3 relative">
            {rows.length > 1 && (
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="absolute top-3 right-3 p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate dark:text-slate-400">Input <span className="font-normal">(optional)</span></label>
                <textarea
                  rows={2}
                  placeholder="hello"
                  value={row.input}
                  onChange={(e) => updateRow(i, "input", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-xs font-mono bg-white dark:bg-slate-900 text-navy-dark dark:text-white placeholder:text-slate-400 outline-none border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500 resize-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate dark:text-slate-400">Expected Output</label>
                <textarea
                  rows={2}
                  placeholder="olleh"
                  value={row.expectedOutput}
                  onChange={(e) => updateRow(i, "expectedOutput", e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-xs font-mono bg-white dark:bg-slate-900 text-navy-dark dark:text-white placeholder:text-slate-400 outline-none resize-none ${errors[i] ? "border-red-400" : "border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500"}`}
                />
                {errors[i] && <p className="text-xs text-red-500">{errors[i]}</p>}
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={row.isHidden}
                onChange={(e) => updateRow(i, "isHidden", e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-navy"
              />
              <span className="text-xs text-slate dark:text-slate-400">Hidden — students won't see this case</span>
            </label>
          </div>
        ))}

        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1.5 text-sm font-semibold text-navy dark:text-blue-400 hover:underline"
        >
          <Plus size={14} /> Add another
        </button>
      </div>

      <div className="flex justify-end gap-2 pt-4 mt-2 border-t border-slate-100 dark:border-slate-700">
        <button type="button" onClick={() => { resetRows(); onClose(); }} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
        <button type="button" onClick={submitAdd} disabled={add.isPending} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-navy dark:bg-blue-600 text-white rounded-lg hover:bg-navy-light disabled:opacity-60 transition-colors">
          {add.isPending && <Loader2 size={14} className="animate-spin" />}
          Add {rows.length > 1 ? `${rows.length} Test Cases` : "Test Case"}
        </button>
      </div>
    </Modal>
  );
}

// ── Delete dialogs ────────────────────────────────────────────────────────────

function DeleteQuestionDialog({ question, examId, onClose }: { question: Question | null; examId: string; onClose: () => void }) {
  const { mutate, isPending } = useDeleteQuestion(examId, onClose);
  return (
    <ConfirmDialog
      open={!!question}
      onClose={onClose}
      onConfirm={() => question && mutate(question.id)}
      title="Delete question"
      message="This question and all its test cases will be permanently deleted."
      isPending={isPending}
    />
  );
}

function DeleteTestCaseDialog({ testCase, examId, onClose }: { testCase: TestCase | null; examId: string; onClose: () => void }) {
  const { mutate, isPending } = useDeleteTestCase(examId, onClose);
  return (
    <ConfirmDialog
      open={!!testCase}
      onClose={onClose}
      onConfirm={() => testCase && mutate(testCase.id)}
      title="Delete test case"
      message="This test case will be permanently deleted."
      isPending={isPending}
    />
  );
}
