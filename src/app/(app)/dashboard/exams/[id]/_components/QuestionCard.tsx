"use client";

import {
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
} from "lucide-react";
import type { Question, TestCase } from "@/interfaces";

export function QuestionCard({
  question,
  index,
  examStatus,
  canManage,
  expanded,
  onToggle,
  onEdit,
  onDelete,
  onAddTestCase,
  onEditTestCase,
  onDeleteTestCase,
}: {
  question: Question;
  index: number;
  examId: string;
  examStatus: string;
  canManage: boolean;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddTestCase: () => void;
  onEditTestCase: (tc: TestCase) => void;
  onDeleteTestCase: (tc: TestCase) => void;
}) {
  const testCases = question.testCases ?? [];
  const isEditable = canManage && examStatus === "draft";

  return (
    <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
      {/* Question header */}
      <div
        className="flex items-start justify-between gap-4 p-5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="w-7 h-7 rounded-lg bg-navy dark:bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
            {index + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-navy-dark dark:text-white font-medium leading-relaxed line-clamp-2">
              {question.body}
            </p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate dark:text-slate-400">
              <span>{question.points} pts</span>
              <span>
                {testCases.length} test case{testCases.length !== 1 ? "s" : ""}
              </span>
              <span>{testCases.filter((tc) => tc.isHidden).length} hidden</span>
            </div>
          </div>
        </div>
        <div
          className="flex items-center gap-1 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {isEditable && (
            <>
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
            </>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-slate-400 hover:text-navy dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Test cases */}
      {expanded && (
        <div className="border-t border-slate-100 dark:border-slate-700 px-5 py-4 bg-slate-50 dark:bg-slate-800/30">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate uppercase tracking-wide">
              Test Cases
            </p>
            {isEditable && (
              <button
                onClick={onAddTestCase}
                className="flex items-center gap-1 text-xs font-semibold text-navy dark:text-blue-400 hover:underline"
              >
                <Plus size={12} /> Add test case
              </button>
            )}
          </div>

          {testCases.length === 0 ? (
            <p className="text-xs text-slate dark:text-slate-500 py-2">
              No test cases yet.
            </p>
          ) : (
            <div className="space-y-2">
              {testCases.map((tc) => (
                <div
                  key={tc.id}
                  className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0 font-mono text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-slate dark:text-slate-500 shrink-0">
                          in:
                        </span>
                        <span className="text-navy-dark dark:text-slate-200 truncate">
                          {tc.input ?? "(none)"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate dark:text-slate-500 shrink-0">
                          out:
                        </span>
                        <span className="text-green truncate">
                          {tc.expectedOutput}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-xs font-medium px-1.5 py-0.5 rounded flex items-center gap-1 ${tc.isHidden ? "bg-orange-50 dark:bg-orange-900/20 text-orange-500" : "bg-slate-100 dark:bg-slate-700 text-slate-500"}`}
                      >
                        {tc.isHidden ? (
                          <>
                            <EyeOff size={10} /> Hidden
                          </>
                        ) : (
                          <>
                            <Eye size={10} /> Visible
                          </>
                        )}
                      </span>
                      {isEditable && (
                        <>
                          <button
                            onClick={() => onEditTestCase(tc)}
                            className="p-1 rounded text-slate-400 hover:text-navy dark:hover:text-white transition-colors"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => onDeleteTestCase(tc)}
                            className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                          >
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
