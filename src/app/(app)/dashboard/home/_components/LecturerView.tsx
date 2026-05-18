import {
  GraduationCap,
  BookOpen,
  Zap,
  Users,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import type { LecturerDashboard } from "@/interfaces";
import { StatCard } from "./StatCard";
import { ExamStatusBreakdown } from "./ExamStatusBreakdown";

interface LecturerViewProps {
  data: LecturerDashboard;
}

export function LecturerView({ data }: LecturerViewProps) {
  const { summary, examStatusBreakdown } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-plus text-2xl font-bold text-navy-dark dark:text-white">
          Overview
        </h1>
        <p className="text-sm text-slate dark:text-slate-400 mt-1">
          Your teaching activity at a glance
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Courses"
          value={summary.totalCourses}
          icon={GraduationCap}
          iconClassName="bg-navy/10 dark:bg-navy-light/20 text-navy dark:text-blue-400"
        />
        <StatCard
          label="Total Exams"
          value={summary.totalExams}
          icon={BookOpen}
          iconClassName="bg-navy/10 dark:bg-navy-light/20 text-navy dark:text-blue-400"
        />
        <StatCard
          label="Active Exams"
          value={summary.activeExams}
          icon={Zap}
          iconClassName="bg-green/10 dark:bg-green/20 text-green dark:text-green-light"
        />
        <StatCard
          label="Enrolled Students"
          value={summary.enrolledStudents}
          icon={Users}
          iconClassName="bg-navy/10 dark:bg-navy-light/20 text-navy dark:text-blue-400"
        />
        <StatCard
          label="Graded Submissions"
          value={summary.gradedSubmissions}
          icon={CheckCircle2}
          iconClassName="bg-green/10 dark:bg-green/20 text-green dark:text-green-light"
        />
        <StatCard
          label="Average Score"
          value={summary.averageScorePct.toFixed(1)}
          icon={TrendingUp}
          iconClassName="bg-navy/10 dark:bg-navy-light/20 text-navy dark:text-blue-400"
          suffix="%"
        />
      </div>

      <div className="max-w-md">
        <ExamStatusBreakdown breakdown={examStatusBreakdown} />
      </div>
    </div>
  );
}
