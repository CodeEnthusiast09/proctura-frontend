"use client";

import { useState } from "react";
import { retrieveFromLocalStorage } from "@/lib/localStorage";
import { StudentAuth } from "@/components/auth";

export default function ExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!retrieveFromLocalStorage<string>("token");
  });

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {isAuthenticated ? (
        children
      ) : (
        <StudentAuth onAuthenticated={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}
