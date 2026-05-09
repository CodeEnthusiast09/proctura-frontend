export type ExamStatus = "draft" | "scheduled" | "active" | "closed";

export interface TestCase {
  id: string;
  questionId: string;
  input?: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Question {
  id: string;
  examId: string;
  body: string;
  orderIndex: number;
  points: number;
  testCases?: TestCase[];
}

export interface Course {
  id: string;
  tenantId: string;
  lecturerId: string;
  title: string;
  code: string;
  createdAt: string;
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  studentId: string;
  enrolledAt: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    matricNumber?: string;
    email: string;
  };
}

export interface Exam {
  id: string;
  tenantId: string;
  courseId: string;
  title: string;
  instructions?: string;
  durationMinutes: number;
  startsAt: string;
  endsAt: string;
  languageId: number;
  languageName: string;
  status: ExamStatus;
  course?: Course;
  questions?: Question[];
  createdAt: string;
  updatedAt: string;
}
