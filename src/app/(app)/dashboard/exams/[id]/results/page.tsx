"use client";
// src/app/(app)/dashboard/exams/[id]/results/page.tsx
import { use, useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft, Loader2, Users, Search, Code2,
  CircleCheck, CircleX, X, ChevronDown, ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { useExam, useExamResults } from "@/hooks/services/exams";
import { useSubmissionDetail, useOverrideScore } from "@/hooks/services/submissions";
import type { Submission, SubmissionAnswer } from "@/interfaces";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-[#1e1e1e] h-48">
      <Loader2 size={18} className="animate-spin text-slate-500" />
    </div>
  ),
});

const STATUS_STYLES: Record<string, string> = {
  in_progress: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
  submitted: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300",
  graded: "bg-green-pale dark:bg-green/10 text-green",
};

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [search, setSearch] = useState("");
  const [reviewId, setReviewId] = useState<string | null>(null);

  const { data: examData } = useExam(id);
  const { data: resultsData, isLoading } = useExamResults(id);

  const exam = examData?.data?.data;
  const allSubmissions: Submission[] = resultsData?.data?.data ?? [];

  const q = search.toLowerCase();
  const submissions = q
    ? allSubmissions.filter((s) => {
        const name = `${s.student?.firstName ?? ""} ${s.student?.lastName ?? ""}`.toLowerCase();
        const matric = (s.student?.matricNumber ?? "").toLowerCase();
        return name.includes(q) || matric.includes(q);
      })
    : allSubmissions;

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/dashboard/exams/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate dark:text-slate-400 hover:text-navy dark:hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={14} /> Back to Builder
        </Link>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-plus text-2xl font-bold text-navy-dark dark:text-white">Results</h1>
            {exam && (
              <p className="text-sm text-slate dark:text-slate-400 mt-1">
                {exam.title} · {submissions.length} of {allSubmissions.length} submission{allSubmissions.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search student name or matric…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-navy-dark dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 w-64"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-slate" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-slate dark:text-slate-400" />
          </div>
          <h3 className="font-plus font-semibold text-navy-dark dark:text-white mb-2">No submissions yet</h3>
          <p className="text-sm text-slate dark:text-slate-400">
            Results will appear here once students start and submit the exam.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">Student</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">Matric No.</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">Score</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">Violations</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate uppercase tracking-wide">Submitted</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {submissions.map((sub) => (
                  <ResultRow key={sub.id} submission={sub} onReview={() => setReviewId(sub.id)} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reviewId && (
        <ReviewDrawer
          submissionId={reviewId}
          examId={id}
          examLanguage={exam?.languageName ?? ""}
          onClose={() => setReviewId(null)}
        />
      )}
    </div>
  );
}

// ── Result Row ────────────────────────────────────────────────────────────────

function ResultRow({ submission, onReview }: { submission: Submission; onReview: () => void }) {
  const pct = submission.maxScore > 0
    ? Math.round((submission.totalScore / submission.maxScore) * 100)
    : 0;

  const canReview = submission.status === "submitted" || submission.status === "graded";

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td className="px-5 py-3.5 font-medium text-navy-dark dark:text-white">
        {submission.student
          ? `${submission.student.firstName} ${submission.student.lastName}`
          : "—"}
      </td>
      <td className="px-5 py-3.5 text-slate dark:text-slate-400 font-mono text-xs">
        {submission.student?.matricNumber ?? "—"}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-navy-dark dark:text-white">
            {submission.totalScore}/{submission.maxScore}
          </span>
          <span className={`text-xs font-medium ${pct >= 50 ? "text-green" : "text-red-500"}`}>
            {pct}%
          </span>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded capitalize ${STATUS_STYLES[submission.status]}`}>
          {submission.status.replace("_", " ")}
        </span>
      </td>
      <td className="px-5 py-3.5 text-slate dark:text-slate-400">
        {submission.violationCount > 0 ? (
          <span className="text-orange-500 font-semibold">{submission.violationCount}</span>
        ) : "0"}
      </td>
      <td className="px-5 py-3.5 text-slate dark:text-slate-400">
        {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : "—"}
      </td>
      <td className="px-5 py-3.5">
        {canReview && (
          <button
            onClick={onReview}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            <Code2 size={12} /> Review Code
          </button>
        )}
      </td>
    </tr>
  );
}

// ── Review Drawer ─────────────────────────────────────────────────────────────

const LANGUAGE_MAP: Record<string, string> = {
  "python 3": "python", c: "c", "c++": "cpp", "c#": "csharp", java: "java",
};

function ReviewDrawer({
  submissionId,
  examId,
  examLanguage,
  onClose,
}: {
  submissionId: string;
  examId: string;
  examLanguage: string;
  onClose: () => void;
}) {
  const { data, isLoading } = useSubmissionDetail(submissionId);
  const { mutate: override, isPending: isSaving } = useOverrideScore(submissionId, examId);

  const sub = data?.data?.data;
  const monacoLang = LANGUAGE_MAP[examLanguage.toLowerCase()] ?? "plaintext";

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="w-full max-w-3xl bg-[#0d1117] border-l border-slate-700 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700 flex-shrink-0">
          <div>
            <h2 className="font-plus font-semibold text-white text-base">Review Submission</h2>
            {sub?.student && (
              <p className="text-xs text-slate-400 mt-0.5">
                {sub.student.firstName} {sub.student.lastName}
                {sub.student.matricNumber && <span className="font-mono ml-2">{sub.student.matricNumber}</span>}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {sub && (
              <div className="text-sm font-semibold text-white">
                Total: <span className="text-blue-400">{sub.totalScore}/{sub.maxScore}</span>
              </div>
            )}
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 size={24} className="animate-spin text-slate-500" />
            </div>
          ) : !sub?.answers?.length ? (
            <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
              No answers submitted.
            </div>
          ) : (
            <div className="divide-y divide-slate-700/60">
              {sub.answers.map((answer, i) => (
                <AnswerPanel
                  key={answer.id}
                  answer={answer}
                  index={i}
                  monacoLang={monacoLang}
                  isSaving={isSaving}
                  onOverride={(score) =>
                    override(
                      { answerId: answer.id, score },
                      { onSuccess: () => toast.success("Score updated") }
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Answer Panel ──────────────────────────────────────────────────────────────

function AnswerPanel({
  answer,
  index,
  monacoLang,
  isSaving,
  onOverride,
}: {
  answer: SubmissionAnswer;
  index: number;
  monacoLang: string;
  isSaving: boolean;
  onOverride: (score: number) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [scoreInput, setScoreInput] = useState(String(answer.score));
  const maxPoints = answer.question?.points ?? 0;

  useEffect(() => {
    setScoreInput(String(answer.score));
  }, [answer.score]);

  // Parse test results JSON stored as string
  type TestResult = { testCaseId: string; passed: boolean; actualOutput: string; expectedOutput: string; statusDesc: string };
  let testResults: TestResult[] = [];
  if (answer.testResults) {
    try { testResults = JSON.parse(answer.testResults); } catch { /* empty */ }
  }

  function handleScoreSave() {
    const n = parseInt(scoreInput, 10);
    if (isNaN(n) || n < 0 || n > maxPoints) {
      toast.error(`Score must be between 0 and ${maxPoints}`);
      return;
    }
    onOverride(n);
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
        {expanded ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
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
                  className={`flex items-start gap-2.5 px-3 py-2 rounded-lg text-xs font-mono border ${
                    r.passed
                      ? "bg-green-500/5 border-green-500/20 text-green-400"
                      : "bg-red-500/5 border-red-500/20"
                  }`}
                >
                  {r.passed ? (
                    <CircleCheck size={13} className="mt-0.5 flex-shrink-0" />
                  ) : (
                    <CircleX size={13} className="mt-0.5 flex-shrink-0 text-red-400" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className={r.passed ? "text-green-400" : "text-red-400"}>
                      Test {i + 1} — {r.passed ? "Passed" : r.statusDesc}
                    </span>
                    {!r.passed && r.expectedOutput && (
                      <div className="mt-1 grid grid-cols-2 gap-2 text-slate-400">
                        <div>
                          <p className="text-slate-500 mb-0.5">Expected</p>
                          <pre className="text-slate-300 whitespace-pre-wrap break-all">{r.expectedOutput}</pre>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-0.5">Got</p>
                          <pre className="text-red-300 whitespace-pre-wrap break-all">{r.actualOutput || "—"}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Score override */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-700/40">
            <span className="text-xs text-slate-400 font-semibold">Score:</span>
            <input
              type="number"
              min={0}
              max={maxPoints}
              value={scoreInput}
              onChange={(e) => setScoreInput(e.target.value)}
              className="w-20 px-2.5 py-1.5 text-sm font-mono bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <span className="text-xs text-slate-500">/ {maxPoints}</span>
            <button
              onClick={handleScoreSave}
              disabled={isSaving || scoreInput === String(answer.score)}
              className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center gap-1.5"
            >
              {isSaving && <Loader2 size={11} className="animate-spin" />}
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
}
