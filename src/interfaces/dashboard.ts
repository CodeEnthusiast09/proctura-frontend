export interface LecturerSummary {
  totalCourses: number;
  totalExams: number;
  activeExams: number;
  enrolledStudents: number;
  gradedSubmissions: number;
  averageScorePct: number;
}

export interface LecturerDashboard {
  summary: LecturerSummary;
  examStatusBreakdown: Record<string, number>;
}

export interface SchoolAdminSummary {
  totalLecturers: number;
  totalStudents: number;
  activeStudents: number;
  totalCourses: number;
  activeExams: number;
}

export interface SchoolPerformance {
  gradedSubmissions: number;
  averageScorePct: number;
  passRate: number;
}

export interface SchoolAdminDashboard {
  summary: SchoolAdminSummary;
  examStatusBreakdown: Record<string, number>;
  schoolPerformance: SchoolPerformance;
}

export interface SuperAdminSummary {
  totalSchools: number;
  activeSchools: number;
  inactiveSchools: number;
}

export interface GrowthPoint {
  month: string;
  count: number;
}

export interface SuperAdminDashboard {
  summary: SuperAdminSummary;
  growth: GrowthPoint[];
}

export interface ScoreBucket {
  range: string;
  count: number;
}

export interface ExamAnalytics {
  totalSubmissions: number;
  graded: number;
  passRate: number;
  averageScorePct: number;
  scoreDistribution: ScoreBucket[];
}
