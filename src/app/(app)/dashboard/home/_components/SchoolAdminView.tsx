import {
  BookOpen,
  GraduationCap,
  Users,
  UserCheck,
  Zap,
  TrendingUp,
  CheckCircle2,
  Award,
} from "lucide-react";
import type { SchoolAdminDashboard } from "@/interfaces";
import { StatCard } from "./StatCard";
import { ExamStatusBreakdown } from "./ExamStatusBreakdown";

interface SchoolAdminViewProps {
  data: SchoolAdminDashboard;
}

export function SchoolAdminView({ data }: SchoolAdminViewProps) {
  const { summary, examStatusBreakdown, schoolPerformance } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-plus text-2xl font-bold text-navy-dark dark:text-white">
          Overview
        </h1>
        <p className="text-sm text-slate dark:text-slate-400 mt-1">
          Your school at a glance
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Lecturers"
          value={summary.totalLecturers}
          icon={BookOpen}
          iconClassName="bg-navy/10 dark:bg-navy-light/20 text-navy dark:text-blue-400"
        />
        <StatCard
          label="Total Students"
          value={summary.totalStudents}
          icon={Users}
          iconClassName="bg-navy/10 dark:bg-navy-light/20 text-navy dark:text-blue-400"
        />
        <StatCard
          label="Active Students"
          value={summary.activeStudents}
          icon={UserCheck}
          iconClassName="bg-green/10 dark:bg-green/20 text-green dark:text-green-light"
        />
        <StatCard
          label="Total Courses"
          value={summary.totalCourses}
          icon={GraduationCap}
          iconClassName="bg-navy/10 dark:bg-navy-light/20 text-navy dark:text-blue-400"
        />
        <StatCard
          label="Active Exams"
          value={summary.activeExams}
          icon={Zap}
          iconClassName="bg-green/10 dark:bg-green/20 text-green dark:text-green-light"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExamStatusBreakdown breakdown={examStatusBreakdown} />

        <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-5">
          <h2 className="font-plus font-semibold text-navy-dark dark:text-white mb-5">
            School Performance
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-navy/10 dark:bg-navy-light/20 text-navy dark:text-blue-400 shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="text-xl font-bold font-plus text-navy-dark dark:text-white">
                  {schoolPerformance.gradedSubmissions.toLocaleString()}
                </p>
                <p className="text-xs text-slate dark:text-slate-400">
                  Graded Submissions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green/10 dark:bg-green/20 text-green dark:text-green-light shrink-0">
                <TrendingUp size={18} />
              </div>
              <div>
                <p className="text-xl font-bold font-plus text-navy-dark dark:text-white">
                  {schoolPerformance.averageScorePct.toFixed(1)}%
                </p>
                <p className="text-xs text-slate dark:text-slate-400">
                  Average Score
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green/10 dark:bg-green/20 text-green dark:text-green-light shrink-0">
                <Award size={18} />
              </div>
              <div>
                <p className="text-xl font-bold font-plus text-navy-dark dark:text-white">
                  {schoolPerformance.passRate.toFixed(1)}%
                </p>
                <p className="text-xs text-slate dark:text-slate-400">
                  Pass Rate
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
