"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  ChevronDown,
  ChevronUp,
  CircleCheck,
  CircleX,
  Loader2,
} from "lucide-react";
import type { SubmissionAnswer } from "@/interfaces";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-[#1e1e1e] h-48">
      <Loader2 size={18} className="animate-spin text-slate-500" />
    </div>
  ),
});

export function AnswerPanel({
  answer,
  index,
  monacoLang,
  localScore,
  canOverride,
  onScoreChange,
}: {
  answer: SubmissionAnswer;
  index: number;
  monacoLang: string;
  localScore: number;
  canOverride: boolean;
  onScoreChange: (answerId: string, score: number) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [scoreInput, setScoreInput] = useState(String(localScore));
  const maxPoints = answer.question?.points ?? 0;

  useEffect(() => {
    setScoreInput(String(localScore));
  }, [localScore]);

  // Parse test results JSON stored as string
  type TestResult = {
    testCaseId: string;
    passed: boolean;
    actualOutput: string;
    expectedOutput: string;
    statusDesc: string;
  };
  let testResults: TestResult[] = [];
  if (answer.testResults) {
    try {
      testResults = JSON.parse(answer.testResults);
    } catch {
      /* empty */
    }
  }

  function handleScoreChange(value: string) {
    setScoreInput(value);
    const n = parseInt(value, 10);
    if (!isNaN(n) && n >= 0 && (maxPoints === 0 || n <= maxPoints)) {
      onScoreChange(answer.id, n);
    }
  }

  return (
    <div className="px-5 py-4">
      {/* Question header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-2 mb-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Question {index + 1}
          </span>
          <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded">
            {maxPoints} pts
          </span>
        </div>
        {expanded ? (
          <ChevronUp size={14} className="text-slate-500" />
        ) : (
          <ChevronDown size={14} className="text-slate-500" />
        )}
      </button>

      {expanded && (
        <>
          {/* Question body */}
          {answer.question?.body && (
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap mb-3 bg-slate-800/50 rounded-lg px-3 py-2.5">
              {answer.question.body}
            </p>
          )}

          {/* Code */}
          <div className="rounded-lg overflow-hidden border border-slate-700/60 mb-3">
            <MonacoEditor
              height="240px"
              language={monacoLang}
              theme="vs-dark"
              value={answer.code || "// No code submitted"}
              options={{
                readOnly: true,
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbersMinChars: 3,
                contextmenu: false,
              }}
            />
          </div>

          {/* Test results */}
          {testResults.length > 0 && (
            <div className="mb-3 space-y-1.5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Test Results
              </p>
              {testResults.map((r, i) => (
                <div
                  key={r.testCaseId ?? i}
                  className={`flex items-start gap-2.5 px-3 py-2 rounded-lg text-xs font-mono border ${r.passed
                      ? "bg-green-500/5 border-green-500/20 text-green-400"
                      : "bg-red-500/5 border-red-500/20"
                    }`}
                >
                  {r.passed ? (
                    <CircleCheck size={13} className="mt-0.5 shrink-0" />
                  ) : (
                    <CircleX
                      size={13}
                      className="mt-0.5 shrink-0 text-red-400"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <span
                      className={r.passed ? "text-green-400" : "text-red-400"}
                    >
                      Test {i + 1} — {r.passed ? "Passed" : r.statusDesc}
                    </span>
                    {!r.passed && r.expectedOutput && (
                      <div className="mt-1 grid grid-cols-2 gap-2 text-slate-400">
                        <div>
                          <p className="text-slate-500 mb-0.5">Expected</p>
                          <pre className="text-slate-300 whitespace-pre-wrap break-all">
                            {r.expectedOutput}
                          </pre>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-0.5">Got</p>
                          <pre className="text-red-300 whitespace-pre-wrap break-all">
                            {r.actualOutput || "—"}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Score (read-only for non-lecturers) */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-700/40">
            <span className="text-xs text-slate-400 font-semibold">Score:</span>
            {canOverride ? (
              <>
                <input
                  type="number"
                  min={0}
                  max={maxPoints}
                  value={scoreInput}
                  onChange={(e) => handleScoreChange(e.target.value)}
                  className="w-20 px-2.5 py-1.5 text-sm font-mono bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
                <span className="text-xs text-slate-500">/ {maxPoints}</span>
                {localScore !== answer.score && (
                  <span
                    className="w-2 h-2 rounded-full bg-amber-400 inline-block shrink-0"
                    title="Unsaved change"
                  />
                )}
              </>
            ) : (
              <span className="text-sm font-mono text-white">
                {localScore} / {maxPoints}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
