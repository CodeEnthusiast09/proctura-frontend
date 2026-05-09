"use client";
// src/components/ui/BulkActionBar.tsx
// Sticky toolbar that shows when one or more table rows are selected and
// offers Activate / Deactivate as bulk actions.

import { Loader2, ToggleLeft, ToggleRight, X } from "lucide-react";

export function BulkActionBar({
  selectedCount,
  noun,
  isPending,
  onActivate,
  onDeactivate,
  onClear,
}: {
  selectedCount: number;
  noun: string;
  isPending: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onClear: () => void;
}) {
  if (selectedCount === 0) return null;
  const label = `${selectedCount} ${selectedCount === 1 ? noun : noun + "s"} selected`;
  return (
    <div className="mb-4 flex items-center gap-3 px-4 py-2.5 bg-navy/5 dark:bg-blue-900/20 border border-navy/15 dark:border-blue-800/40 rounded-xl">
      <span className="text-sm font-semibold text-navy-dark dark:text-white">
        {label}
      </span>
      <div className="flex-1" />
      <button
        onClick={onActivate}
        disabled={isPending}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green bg-green-pale dark:bg-green/15 dark:text-green-light rounded-lg hover:bg-green/20 dark:hover:bg-green/25 disabled:opacity-50 transition-colors"
      >
        {isPending ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <ToggleRight size={13} />
        )}
        Activate
      </button>
      <button
        onClick={onDeactivate}
        disabled={isPending}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 transition-colors"
      >
        {isPending ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <ToggleLeft size={13} />
        )}
        Deactivate
      </button>
      <button
        onClick={onClear}
        disabled={isPending}
        title="Clear selection"
        className="p-1.5 rounded-lg text-slate-400 hover:text-navy dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
