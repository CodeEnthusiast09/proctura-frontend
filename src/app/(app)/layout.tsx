"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/app/Sidebar";
import { Topbar } from "@/components/app/Topbar";
import { useCurrentUser } from "@/hooks/common/useCurrentUser";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const user = useCurrentUser();

  // Students don't have a dashboard. They authenticate on /exam via
  // StudentAuth, pick their exam, take it, log out. If a student token ends
  // up here (bookmark, manual URL), bounce them.
  useEffect(() => {
    if (user?.role === "student") {
      router.replace("/exam");
    }
  }, [user, router]);

  if (user?.role === "student") return null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0a0f1e]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
