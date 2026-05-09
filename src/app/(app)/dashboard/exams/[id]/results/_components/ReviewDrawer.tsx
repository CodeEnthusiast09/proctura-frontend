"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Video } from "lucide-react";
import { useSubmissionDetail } from "@/hooks/services/submissions";
import { useQueryClient } from "@tanstack/react-query";
import { submissionsService } from "@/services/client/submissions";
import { AnswerPanel } from "./AnswerPanel";
import toast from "react-hot-toast";

const LANGUAGE_MAP: Record<string, string> = {
  "python 3": "python",
  c: "c",
  "c++": "cpp",
  "c#": "csharp",
  java: "java",
};

export function ReviewDrawer({
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
  const qc = useQueryClient();
  const { data, isLoading } = useSubmissionDetail(submissionId);
  const [localScores, setLocalScores] = useState<Record<string, number>>({});
  const [isSavingAll, setIsSavingAll] = useState(false);

  const sub = data?.data?.data;
  const monacoLang = LANGUAGE_MAP[examLanguage.toLowerCase()] ?? "plaintext";

  useEffect(() => {
    if (!sub?.answers) return;
    setLocalScores((prev) => {
      const next = { ...prev };
      for (const a of sub.answers!) {
        if (!(a.id in next)) next[a.id] = a.score;
      }
      return next;
    });
  }, [sub?.answers]);

  const dirtyAnswers =
    sub?.answers?.filter(
      (a) => localScores[a.id] !== undefined && localScores[a.id] !== a.score,
    ) ?? [];

  async function handleSaveAll() {
    if (!dirtyAnswers.length) return;
    setIsSavingAll(true);
    try {
      await Promise.all(
        dirtyAnswers.map((a) =>
          submissionsService.overrideScore(
            submissionId,
            a.id,
            localScores[a.id],
          ),
        ),
      );
      qc.invalidateQueries({
        queryKey: ["submissions", submissionId, "detail"],
      });
      qc.invalidateQueries({ queryKey: ["results"] });
      qc.invalidateQueries({ queryKey: ["exams", examId, "results"] });
      toast.success("Scores saved");
    } catch {
      toast.error("Failed to save some scores");
    } finally {
      setIsSavingAll(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="w-full max-w-3xl bg-[#0d1117] border-l border-slate-700 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700 shrink-0">
          <div>
            <h2 className="font-plus font-semibold text-white text-base">
              Review Submission
            </h2>
            {sub?.student && (
              <p className="text-xs text-slate-400 mt-0.5">
                {sub.student.firstName} {sub.student.lastName}
                {sub.student.matricNumber && (
                  <span className="font-mono ml-2">
                    {sub.student.matricNumber}
                  </span>
                )}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {sub && (
              <div className="text-sm font-semibold text-white">
                Total:{" "}
                <span className="text-blue-400">
                  {sub.totalScore}/{sub.maxScore}
                </span>
              </div>
            )}
            {dirtyAnswers.length > 0 && (
              <button
                onClick={handleSaveAll}
                disabled={isSavingAll}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isSavingAll && <Loader2 size={11} className="animate-spin" />}
                Save Scores ({dirtyAnswers.length})
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
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
            <>
              {/* Recording */}
              {sub.recordingUrl && (
                <div className="px-5 py-4 border-b border-slate-700/60">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                    <Video size={12} /> Exam Recording
                  </p>
                  <video
                    src={sub.recordingUrl}
                    controls
                    preload="metadata"
                    className="w-full rounded-lg bg-black border border-slate-700/60"
                  />
                </div>
              )}

              <div className="divide-y divide-slate-700/60">
                {sub.answers.map((answer, i) => (
                  <AnswerPanel
                    key={answer.id}
                    answer={answer}
                    index={i}
                    monacoLang={monacoLang}
                    localScore={localScores[answer.id] ?? answer.score}
                    onScoreChange={(answerId, score) =>
                      setLocalScores((prev) => ({ ...prev, [answerId]: score }))
                    }
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
