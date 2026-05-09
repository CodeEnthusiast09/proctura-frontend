"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Building2,
  GraduationCap,
  LogOut,
  X,
  Settings,
} from "lucide-react";
import { ProcuturaLogo } from "@/components/landing/Logo";
import { useCurrentUser } from "@/hooks/common/useCurrentUser";
import { clearLocalStorage } from "@/lib/localStorage";
import type { UserRole } from "@/interfaces";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Schools",
    href: "/dashboard/schools",
    icon: Building2,
    roles: ["super_admin"],
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: Users,
    roles: ["school_admin"],
  },
  {
    label: "Exams",
    href: "/dashboard/exams",
    icon: BookOpen,
    roles: ["lecturer", "school_admin"],
  },
  {
    label: "Courses",
    href: "/dashboard/courses",
    icon: GraduationCap,
    roles: ["lecturer", "school_admin"],
  },
  {
    label: "Results",
    href: "/dashboard/results",
    icon: LayoutDashboard,
    roles: ["lecturer", "school_admin"],
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["super_admin", "school_admin", "lecturer"],
  },
];

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  school_admin: "School Admin",
  lecturer: "Lecturer",
  student: "Student",
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const user = useCurrentUser();

  function handleLogout() {
    clearLocalStorage();
    window.location.href = "/login";
  }

  const visibleItems = NAV_ITEMS.filter(
    (item) => user && item.roles.includes(user.role),
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100 dark:border-slate-800">
          <ProcuturaLogo />
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-slate-400 hover:text-slate dark:hover:text-white"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${active
                        ? "bg-navy dark:bg-blue-600 text-white"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-navy-dark dark:hover:text-white"
                      }`}
                  >
                    <Icon size={17} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-800">
          {user && (
            <div className="px-3 py-2 mb-2">
              <p className="text-sm font-semibold text-navy-dark dark:text-white truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-slate dark:text-slate-400">
                {ROLE_LABELS[user.role]}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
