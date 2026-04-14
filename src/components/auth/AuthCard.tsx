// src/components/auth/AuthCard.tsx

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm p-8 sm:p-10">
        <div className="mb-8">
          <h1 className="font-plus text-2xl font-bold text-navy-dark dark:text-white mb-2">
            {title}
          </h1>
          <p className="text-sm text-slate dark:text-slate-400">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
