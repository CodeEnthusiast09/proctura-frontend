// src/interfaces/submission.ts

export type SubmissionStatus = "in_progress" | "submitted" | "graded";

export interface TestCaseResult {
  testCaseId: string;
  passed: boolean;
  isHidden: boolean;
  actualOutput?: string;
  expectedOutput?: string;
  statusDesc: string;
}

export interface SubmissionAnswer {
  id: string;
  submissionId: string;
  questionId: string;
  code: string;
  score: number;
  testResults?: string;
  createdAt: string;
  updatedAt: string;
  question?: {
    id: string;
    body: string;
    points: number;
    testCases?: { id: string; input?: string; expectedOutput: string; isHidden: boolean }[];
  };
}

export interface Submission {
  id: string;
  tenantId: string;
  examId: string;
  studentId: string;
  status: SubmissionStatus;
  startedAt: string;
  submittedAt?: string;
  totalScore: number;
  maxScore: number;
  violationCount: number;
  answers?: SubmissionAnswer[];
  exam?: { title: string; course?: { code: string } };
  student?: { firstName: string; lastName: string; matricNumber?: string };
  createdAt: string;
  updatedAt: string;
}

export interface AllResultsRow extends Submission {
  examTitle: string;
  courseCode: string;
}

export interface RunCodeResult {
  testCaseId: string;
  passed: boolean;
  input?: string;
  expectedOutput: string;
  actualOutput: string;
  statusDesc: string;
}

export interface AllResultsFilters {
  courseId?: string;
  examId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}
