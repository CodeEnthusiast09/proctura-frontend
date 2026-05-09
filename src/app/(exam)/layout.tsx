"use client";

import { useState } from "react";
import { retrieveFromLocalStorage } from "@/lib/localStorage";
import { StudentAuth } from "@/components/auth";
import type { User } from "@/interfaces";

// Exam routes are student-only territory. A non-student token (a lecturer or
// admin signed in on the same browser) must NOT pass through, otherwise the
// student-only API calls inside the exam page (e.g. /exams/available) 403 and
// fire confusing toasts. We gate on role here, not just token presence.
function readStudentSession(): boolean {
  if (typeof window === "undefined") return false;
  const token = retrieveFromLocalStorage<string>("token");
  if (!token) return false;
  const user = retrieveFromLocalStorage<User>("user");
  return user?.role === "student";
}

export default function ExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isStudent, setIsStudent] = useState(readStudentSession);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {isStudent ? (
        children
      ) : (
        <StudentAuth onAuthenticated={() => setIsStudent(true)} />
      )}
    </div>
  );
}
