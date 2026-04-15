// src/app/(exam)/layout.tsx
export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {children}
    </div>
  );
}
