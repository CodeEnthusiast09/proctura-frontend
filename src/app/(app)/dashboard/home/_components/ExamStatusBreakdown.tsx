interface StatusConfig {
  label: string;
  barColor: string;
  textColor: string;
  dotColor: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  draft: {
    label: "Draft",
    barColor: "bg-slate-300 dark:bg-slate-600",
    textColor: "text-slate-500 dark:text-slate-400",
    dotColor: "bg-slate-400",
  },
  scheduled: {
    label: "Scheduled",
    barColor: "bg-navy-light dark:bg-blue-500",
    textColor: "text-navy-light dark:text-blue-400",
    dotColor: "bg-navy-light dark:bg-blue-500",
  },
  active: {
    label: "Active",
    barColor: "bg-green dark:bg-green-light",
    textColor: "text-green dark:text-green-light",
    dotColor: "bg-green dark:bg-green-light",
  },
  closed: {
    label: "Closed",
    barColor: "bg-slate-400 dark:bg-slate-500",
    textColor: "text-slate dark:text-slate-400",
    dotColor: "bg-slate-400 dark:bg-slate-500",
  },
};

const STATUS_ORDER = ["active", "scheduled", "draft", "closed"] as const;

interface ExamStatusBreakdownProps {
  breakdown: Record<string, number>;
}

export function ExamStatusBreakdown({ breakdown }: ExamStatusBreakdownProps) {
  const total = Object.values(breakdown).reduce((sum, n) => sum + n, 0);

  return (
    <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-5">
      <h2 className="font-plus font-semibold text-navy-dark dark:text-white mb-5">
        Exam Status Breakdown
      </h2>

      {total === 0 ? (
        <p className="text-sm text-slate dark:text-slate-400">
          No exams created yet.
        </p>
      ) : (
        <div className="space-y-4">
          {STATUS_ORDER.map((status) => {
            const count = breakdown[status] ?? 0;
            const pct = total > 0 ? (count / total) * 100 : 0;
            const cfg = STATUS_CONFIG[status];

            return (
              <div key={status}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${cfg.dotColor}`}
                    />
                    <span className={`text-sm font-medium ${cfg.textColor}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-navy-dark dark:text-white">
                    {count}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${cfg.barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-slate dark:text-slate-500 mt-5">
        {total} exam{total !== 1 ? "s" : ""} total
      </p>
    </div>
  );
}
