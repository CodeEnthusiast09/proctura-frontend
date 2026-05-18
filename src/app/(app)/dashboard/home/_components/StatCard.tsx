import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName?: string;
  suffix?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName = "bg-navy/10 dark:bg-navy-light/20 text-navy dark:text-blue-400",
  suffix,
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-5">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${iconClassName}`}
      >
        <Icon size={18} />
      </div>
      <p className="text-2xl font-bold font-plus text-navy-dark dark:text-white">
        {value}
        {suffix && (
          <span className="text-base font-medium text-slate dark:text-slate-400 ml-1">
            {suffix}
          </span>
        )}
      </p>
      <p className="text-sm text-slate dark:text-slate-400 mt-1">{label}</p>
    </div>
  );
}
