import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-light dark:bg-[#070d1a]">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-navy/5 dark:bg-navy/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-green/5 dark:bg-green/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#1e3a5f 1px, transparent 1px), linear-gradient(to right, #1e3a5f 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-green-pale dark:bg-green/10 border border-green/20 text-green text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
              Built for Nigerian Universities
            </div>

            <h1 className="font-plus text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-dark dark:text-white leading-[1.1] tracking-tight mb-6">
              The End of Writing{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-navy dark:text-blue-300">
                  Code on Paper.
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M2 9C50 4 150 1 298 9"
                    stroke="#16a34a"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-lg text-slate dark:text-slate-300 leading-relaxed mb-8 max-w-lg">
              Proctura gives Nigerian universities a real online coding exam
              platform — so students can write, run, and submit actual code
              instead of filling exam sheets by hand.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-navy dark:bg-blue-600 text-white font-semibold px-6 py-3.5 rounded-lg hover:bg-navy-light dark:hover:bg-blue-500 transition-colors text-sm"
              >
                Get Your School Onboarded
                <ArrowRight size={16} />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-navy-dark dark:text-white font-semibold px-6 py-3.5 rounded-lg hover:border-navy/30 dark:hover:border-slate-500 transition-colors text-sm"
              >
                <Play
                  size={14}
                  className="fill-navy dark:fill-white text-navy dark:text-white"
                />
                See How It Works
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-slate dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["#1e3a5f", "#16a34a", "#2d5a9e", "#0f172a"].map(
                    (color, i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-[10px] font-bold"
                        style={{ backgroundColor: color }}
                      >
                        {["U", "L", "S", "F"][i]}
                      </div>
                    ),
                  )}
                </div>
                <span>Built for your campus</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-slate-200 dark:bg-slate-700" />
              <span>No paper. No scanning. No guessing.</span>
            </div>
          </div>

          {/* Right — exam interface mockup */}
          <div className="relative hidden lg:block">
            <ExamMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function ExamMockup() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-navy/10 rounded-3xl blur-2xl transform scale-95" />

      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Browser bar */}
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 flex items-center gap-3 border-b border-slate-200 dark:border-slate-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white dark:bg-slate-700 rounded-md px-3 py-1 text-xs text-slate-400 dark:text-slate-400 font-mono">
            unilag.proctura.com/exams/midterm
          </div>
        </div>

        {/* Exam header */}
        <div className="bg-navy px-5 py-3 flex items-center justify-between">
          <div>
            <p className="text-white/60 text-xs">CSC301 — Data Structures</p>
            <p className="text-white font-semibold text-sm">
              Midterm Examination
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white font-mono text-sm font-bold">
              01:23:45
            </span>
          </div>
        </div>

        <div className="grid grid-cols-5">
          {/* Question panel */}
          <div className="col-span-2 p-4 border-r border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs font-semibold text-slate uppercase tracking-wide mb-2">
              Question 1 / 3
            </p>
            <p className="text-sm text-navy-dark dark:text-slate-200 font-medium leading-relaxed mb-3">
              Write a function that takes a string and returns it reversed.
            </p>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate mb-1 font-medium">
                Sample Input
              </p>
              <code className="text-xs font-mono text-green">hello</code>
              <p className="text-xs text-slate mt-2 mb-1 font-medium">
                Expected Output
              </p>
              <code className="text-xs font-mono text-navy dark:text-blue-300">
                olleh
              </code>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate">
              <span>20 points</span>
              <span className="text-green font-medium">● Saved</span>
            </div>
          </div>

          {/* Code editor panel */}
          <div className="col-span-3 bg-[#1e1e1e]">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-white/50 text-xs font-mono">
                solution.py
              </span>
            </div>
            <div className="p-4 font-mono text-xs leading-relaxed">
              <div>
                <span className="text-blue-400">def</span>{" "}
                <span className="text-yellow-300">reverse_string</span>
                <span className="text-white">(s):</span>
              </div>
              <div className="pl-4">
                <span className="text-blue-400">return</span>{" "}
                <span className="text-white">s</span>
                <span className="text-orange-400">[::-1]</span>
              </div>
              <div className="mt-2">
                <span className="text-yellow-300">print</span>
                <span className="text-white">(</span>
                <span className="text-yellow-300">reverse_string</span>
                <span className="text-white">(</span>
                <span className="text-yellow-300">input</span>
                <span className="text-white">()))</span>
              </div>
              <div className="mt-3 flex items-center gap-1">
                <span className="w-0.5 h-4 bg-white/70 animate-pulse inline-block" />
              </div>
            </div>
            <div className="px-4 pb-3 flex gap-2">
              <button className="bg-green text-white text-xs font-semibold px-4 py-1.5 rounded-md">
                Run Code
              </button>
              <button className="bg-white/10 text-white/70 text-xs font-semibold px-4 py-1.5 rounded-md">
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -top-4 -right-4 bg-green text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
        Live Grading
      </div>
      <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl px-4 py-2.5 text-xs">
        <div className="font-semibold text-navy-dark dark:text-white">
          Test Passed ✓
        </div>
        <div className="text-slate dark:text-slate-400">3 / 3 test cases</div>
      </div>
    </div>
  );
}
