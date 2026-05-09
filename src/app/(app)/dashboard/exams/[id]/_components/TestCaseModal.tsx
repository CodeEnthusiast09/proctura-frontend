"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useAddTestCase, useUpdateTestCase } from "@/hooks/services/exams";
import { testCaseSchema } from "@/validations/testCase";
import type { TestCase } from "@/interfaces";

type TestCaseFormData = InferType<typeof testCaseSchema>;

type TestCaseRow = { input: string; expectedOutput: string; isHidden: boolean };

const emptyRow = (): TestCaseRow => ({
  input: "",
  expectedOutput: "",
  isHidden: false,
});

export function TestCaseModal({
  open,
  onClose,
  mode,
  examId,
  questionId,
  testCase,
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

  const resetRows = useCallback(() => {
    setRows([emptyRow()]);
    setErrors([]);
  }, []);

  const add = useAddTestCase(examId, questionId, () => {
    resetRows();
    onClose();
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: editErrors },
  } = useForm<TestCaseFormData>({
    resolver: yupResolver(testCaseSchema),
    defaultValues: testCase
      ? {
        input: testCase.input ?? "",
        expectedOutput: testCase.expectedOutput,
        isHidden: testCase.isHidden,
      }
      : { isHidden: false },
  });
  const edit = useUpdateTestCase(examId, testCase?.id ?? "", onClose);

  function updateRow(
    i: number,
    field: keyof TestCaseRow,
    value: string | boolean,
  ) {
    setRows((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)),
    );
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow()]);
  }

  function removeRow(i: number) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  function submitAdd() {
    const errs = rows.map((r) =>
      r.expectedOutput.trim() === "" ? "Expected output is required" : "",
    );
    setErrors(errs);
    if (errs.some(Boolean)) return;
    add.mutate(
      rows.map((r) => ({
        input: r.input,
        expectedOutput: r.expectedOutput,
        isHidden: r.isHidden,
      })),
    );
  }

  if (mode === "edit") {
    return (
      <Modal open={open} onClose={onClose} title="Edit Test Case" size="sm">
        <form
          onSubmit={handleSubmit((d) => edit.mutate(d))}
          className="space-y-4"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-navy-dark dark:text-slate-200">
              Input{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="hello"
              className="w-full px-3.5 py-2.5 rounded-lg border text-sm font-mono bg-white dark:bg-slate-900 text-navy-dark dark:text-white placeholder:text-slate-400 outline-none border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500 resize-none"
              {...register("input")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-navy-dark dark:text-slate-200">
              Expected Output
            </label>
            <textarea
              rows={2}
              placeholder="olleh"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-mono bg-white dark:bg-slate-900 text-navy-dark dark:text-white placeholder:text-slate-400 outline-none resize-none ${editErrors.expectedOutput ? "border-red-400" : "border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500"}`}
              {...register("expectedOutput")}
            />
            {editErrors.expectedOutput && (
              <p className="text-xs text-red-500">
                {editErrors.expectedOutput.message}
              </p>
            )}
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded accent-navy"
              {...register("isHidden")}
            />
            <div>
              <p className="text-sm font-medium text-navy-dark dark:text-white">
                Hidden test case
              </p>
              <p className="text-xs text-slate dark:text-slate-400">
                Students won't see this input/output during the exam
              </p>
            </div>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={edit.isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-navy dark:bg-blue-600 text-white rounded-lg hover:bg-navy-light disabled:opacity-60 transition-colors"
            >
              {edit.isPending && <Loader2 size={14} className="animate-spin" />}
              Save
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        resetRows();
        onClose();
      }}
      title="Add Test Cases"
      size="md"
    >
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div
            key={i}
            className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3 relative"
          >
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
                <label className="text-xs font-medium text-slate dark:text-slate-400">
                  Input <span className="font-normal">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="hello"
                  value={row.input}
                  onChange={(e) => updateRow(i, "input", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-xs font-mono bg-white dark:bg-slate-900 text-navy-dark dark:text-white placeholder:text-slate-400 outline-none border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500 resize-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate dark:text-slate-400">
                  Expected Output
                </label>
                <textarea
                  rows={2}
                  placeholder="olleh"
                  value={row.expectedOutput}
                  onChange={(e) =>
                    updateRow(i, "expectedOutput", e.target.value)
                  }
                  className={`w-full px-3 py-2 rounded-lg border text-xs font-mono bg-white dark:bg-slate-900 text-navy-dark dark:text-white placeholder:text-slate-400 outline-none resize-none ${errors[i] ? "border-red-400" : "border-slate-200 dark:border-slate-700 focus:border-navy dark:focus:border-blue-500"}`}
                />
                {errors[i] && (
                  <p className="text-xs text-red-500">{errors[i]}</p>
                )}
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={row.isHidden}
                onChange={(e) => updateRow(i, "isHidden", e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-navy"
              />
              <span className="text-xs text-slate dark:text-slate-400">
                Hidden — students won't see this case
              </span>
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
        <button
          type="button"
          onClick={() => {
            resetRows();
            onClose();
          }}
          className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submitAdd}
          disabled={add.isPending}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-navy dark:bg-blue-600 text-white rounded-lg hover:bg-navy-light disabled:opacity-60 transition-colors"
        >
          {add.isPending && <Loader2 size={14} className="animate-spin" />}
          Add {rows.length > 1 ? `${rows.length} Test Cases` : "Test Case"}
        </button>
      </div>
    </Modal>
  );
}
