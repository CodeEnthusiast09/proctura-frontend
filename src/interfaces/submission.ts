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
  testResults?: string[];
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
}
