import Link from "next/link";
import { ProcuturaLogo } from "@/components/landing/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-light dark:bg-[#070d1a] flex flex-col">
      {/* Header */}
      <header className="px-6 py-5">
        <Link href="/" className="inline-flex">
          <ProcuturaLogo />
        </Link>
      </header>

      {/* Centered content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="px-6 py-5 text-center text-xs text-slate dark:text-slate-500">
        © {new Date().getFullYear()} Proctura. All rights reserved.
      </footer>
    </div>
  );
}
