import { Building2, CheckCircle2, XCircle } from "lucide-react";
import type { SuperAdminDashboard } from "@/interfaces";
import { StatCard } from "./StatCard";
import { GrowthChart } from "./GrowthChart";

interface SuperAdminViewProps {
  data: SuperAdminDashboard;
}

export function SuperAdminView({ data }: SuperAdminViewProps) {
  const { summary, growth } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-plus text-2xl font-bold text-navy-dark dark:text-white">
          Overview
        </h1>
        <p className="text-sm text-slate dark:text-slate-400 mt-1">
          Platform health at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Schools"
          value={summary.totalSchools}
          icon={Building2}
          iconClassName="bg-navy/10 dark:bg-navy-light/20 text-navy dark:text-blue-400"
        />
        <StatCard
          label="Active Schools"
          value={summary.activeSchools}
          icon={CheckCircle2}
          iconClassName="bg-green/10 dark:bg-green/20 text-green dark:text-green-light"
        />
        <StatCard
          label="Inactive Schools"
          value={summary.inactiveSchools}
          icon={XCircle}
          iconClassName="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400"
        />
      </div>

      <GrowthChart data={growth} />
    </div>
  );
}
