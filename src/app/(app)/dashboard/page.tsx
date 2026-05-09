"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { retrieveFromLocalStorage } from "@/lib/localStorage";
import type { User, UserRole } from "@/interfaces";

const ROLE_REDIRECT: Record<UserRole, string> = {
  super_admin: "/dashboard/schools",
  school_admin: "/dashboard/users",
  lecturer: "/dashboard/exams",
  student: "/exam",
};

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const user = retrieveFromLocalStorage<User>("user");
    if (!user) {
      router.replace("/login");
      return;
    }
    router.replace(ROLE_REDIRECT[user.role] ?? "/dashboard/exams");
  }, [router]);

  return null;
}
