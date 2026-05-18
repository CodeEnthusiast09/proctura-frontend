import type { GrowthPoint } from "@/interfaces";

interface GrowthChartProps {
  data: GrowthPoint[];
}

function getLast12Months(): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    months.push(`${d.getFullYear()}-${month}`);
  }
  return months;
}

export function GrowthChart({ data }: GrowthChartProps) {
  const dataMap = new Map(data.map((d) => [d.month, d.count]));
  const slots = getLast12Months().map((month) => ({
    month,
    count: dataMap.get(month) ?? 0,
  }));

  const max = Math.max(...slots.map((s) => s.count), 1);

  return (
    <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-5">
      <h2 className="font-plus font-semibold text-navy-dark dark:text-white mb-6">
        Schools Onboarded (Last 12 Months)
      </h2>

      <div className="flex gap-2">
        {slots.map(({ month, count }) => {
          const heightPct = (count / max) * 100;
          const shortMonth = month.slice(5);

          return (
            <div key={month} className="flex-1 flex flex-col items-center gap-1">
              {/* count label — fixed height row so it never clips */}
              <span className="h-4 text-xs font-semibold text-navy-dark dark:text-white leading-none">
                {count > 0 ? count : ""}
              </span>
              {/* bar area */}
              <div className="w-full flex items-end" style={{ height: "96px" }}>
                <div
                  className="w-full rounded-t-sm transition-all duration-500 hover:opacity-80"
                  style={{
                    height: count > 0 ? `${Math.max(heightPct, 6)}%` : "3px",
                    backgroundColor:
                      count > 0
                        ? "var(--color-navy)"
                        : "var(--color-slate-light)",
                  }}
                  title={`${month}: ${count}`}
                />
              </div>
              {/* month label */}
              <span className="text-xs text-slate dark:text-slate-500 mt-1">
                {shortMonth}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
