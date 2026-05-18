"use client";

import { Loader2 } from "lucide-react";
import { useCurrentUser } from "@/hooks/common/useCurrentUser";
import {
  useLecturerDashboard,
  useSchoolAdminDashboard,
  useSuperAdminDashboard,
} from "@/hooks/services/dashboard";
import { LecturerView } from "./_components/LecturerView";
import { SchoolAdminView } from "./_components/SchoolAdminView";
import { SuperAdminView } from "./_components/SuperAdminView";

export default function DashboardHomePage() {
  const user = useCurrentUser();

  if (user?.role === "lecturer") return <LecturerDashboard />;
  if (user?.role === "school_admin") return <SchoolAdminDashboard />;
  if (user?.role === "super_admin") return <SuperAdminDashboard />;

  return null;
}

function LecturerDashboard() {
  const { data, isLoading } = useLecturerDashboard();
  if (isLoading) return <LoadingSpinner />;
  if (!data?.data?.data) return null;
  return <LecturerView data={data.data.data} />;
}

function SchoolAdminDashboard() {
  const { data, isLoading } = useSchoolAdminDashboard();
  if (isLoading) return <LoadingSpinner />;
  if (!data?.data?.data) return null;
  return <SchoolAdminView data={data.data.data} />;
}

function SuperAdminDashboard() {
  const { data, isLoading } = useSuperAdminDashboard();
  if (isLoading) return <LoadingSpinner />;
  if (!data?.data?.data) return null;
  return <SuperAdminView data={data.data.data} />;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={24} className="animate-spin text-slate" />
    </div>
  );
}
