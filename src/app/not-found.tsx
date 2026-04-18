// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] p-6">
      <div className="text-center">
        <p className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-8">
          Proctura
        </p>

        <div className="bg-[#161b22] border border-slate-700/60 rounded-2xl p-10 max-w-sm mx-auto">
          <p className="text-7xl font-plus font-extrabold text-slate-700 mb-4">
            404
          </p>
          <h1 className="text-xl font-plus font-bold text-white mb-2">
            Page not found
          </h1>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard/exams"
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="w-full flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
