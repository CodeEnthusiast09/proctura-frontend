const PAIN_POINTS = [
  {
    who: "Students",
    color: "text-navy dark:text-blue-300",
    bg: "bg-navy/5 dark:bg-navy/20",
    border: "border-navy/10 dark:border-navy/30",
    points: [
      "Write Python, C++, and Java syntax on paper from memory",
      "Lose marks for missing semicolons — not logic errors",
      "Can't test if code actually runs",
      "Exam doesn't reflect real coding skills",
    ],
  },
  {
    who: "Lecturers",
    color: "text-green",
    bg: "bg-green-pale dark:bg-green/10",
    border: "border-green/20",
    points: [
      "Manually read and grade handwritten code",
      "Hard to distinguish logic errors from syntax errors",
      "No objective standard for partial marking",
      "Marking 200 scripts takes days",
    ],
  },
];

export function Problem() {
  return (
    <section className="py-24 bg-white dark:bg-[#0a0f1e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate uppercase tracking-widest mb-4">
            The Problem
          </div>
          <h2 className="font-plus text-3xl sm:text-4xl font-bold text-navy-dark dark:text-white mb-4">
            Students still write code on paper in 2025.
          </h2>
          <p className="text-slate dark:text-slate-400 text-lg leading-relaxed">
            In most Nigerian universities, programming exams happen on paper.
            Students memorize syntax instead of learning to code. Lecturers
            grade subjectively. Everyone loses.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {PAIN_POINTS.map((group) => (
            <div
              key={group.who}
              className={`${group.bg} border ${group.border} rounded-2xl p-8`}
            >
              <h3 className={`font-plus text-lg font-bold mb-5 ${group.color}`}>
                For {group.who}
              </h3>
              <ul className="space-y-3">
                {group.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300"
                  >
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 text-red-400 flex items-center justify-center flex-shrink-0 text-xs">
                      ✕
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-navy dark:bg-slate-800 rounded-2xl p-8 sm:p-12 text-center">
          <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-3">
            The Solution
          </p>
          <h3 className="font-plus text-2xl sm:text-3xl font-bold text-white mb-4">
            A real coding exam environment, built for your campus.
          </h3>
          <p className="text-white/70 text-base max-w-2xl mx-auto">
            Proctura gives students an actual code editor with a real execution
            engine. Code runs against automated test cases. Grading is
            objective, instant, and consistent — no matter who&apos;s marking.
          </p>
        </div>
      </div>
    </section>
  );
}
