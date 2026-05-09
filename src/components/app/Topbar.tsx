"use client";

import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCurrentUser } from "@/hooks/common/useCurrentUser";

interface TopbarProps {
  onMenuClick: () => void;
  title?: string;
}

export function Topbar({ onMenuClick, title }: TopbarProps) {
  const user = useCurrentUser();

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-1 text-slate-500 hover:text-navy dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        {title && (
          <h1 className="font-plus font-bold text-navy-dark dark:text-white text-lg hidden sm:block">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        {user && (
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-navy dark:bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <span className="text-sm font-medium text-navy-dark dark:text-white">
              {user.firstName}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
