"use client";

import {
  Code2,
  Shield,
  Zap,
  Users,
  FileSpreadsheet,
  Eye,
  Timer,
  BarChart3,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    icon: Code2,
    title: "Real Code Editor",
    description:
      "Students code in a full VS Code-like editor with syntax highlighting, line numbers, and language-aware formatting.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Zap,
    title: "Instant Grading",
    description:
      "Code runs against automated test cases via Judge0. Partial scoring per question based on how many tests pass.",
    color: "text-yellow-500",
    bg: "bg-yellow-50",
  },
  {
    icon: Eye,
    title: "Hidden Test Cases",
    description:
      "Lecturers can mark test cases as hidden — students see sample inputs but not the full grading suite.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: Shield,
    title: "Anti-Cheat Built In",
    description:
      "Tab switching and clipboard events are tracked. After 3 violations, the exam is automatically submitted.",
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    icon: Timer,
    title: "Personal Timer",
    description:
      "Each student gets their own countdown from the moment they start — not a shared class-wide timer.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: Users,
    title: "Multi-School Support",
    description:
      "Each university gets its own isolated workspace at a dedicated subdomain. Data is fully separated.",
    color: "text-navy",
    bg: "bg-navy/5",
  },
  {
    icon: FileSpreadsheet,
    title: "CSV Student Import",
    description:
      "School admins upload a CSV to bulk-create student accounts. No manual registration per student.",
    color: "text-green",
    bg: "bg-green-pale",
  },
  {
    icon: BarChart3,
    title: "Lecturer Results Dashboard",
    description:
      "Lecturers see all submissions, scores, and per-question breakdowns the moment grading completes.",
    color: "text-teal-500",
    bg: "bg-teal-50",
  },
];

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const scope = sectionRef.current;
      if (!scope) return;

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: scope, start: "top 60%" },
      });

      tl.from(scope.querySelectorAll(".feature-card"), {
        y: 24,
        opacity: 0,
        duration: 0.45,
        stagger: 0.06,
      }).from(
        scope.querySelectorAll(".feature-lang"),
        { scale: 0.8, opacity: 0, duration: 0.3, stagger: 0.06 },
        "-=0.2",
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="py-24 bg-white dark:bg-[#0a0f1e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate uppercase tracking-widest mb-4">
            Features
          </div>
          <h2 className="font-plus text-3xl sm:text-4xl font-bold text-navy-dark dark:text-white mb-4">
            Everything a coding exam needs.
          </h2>
          <p className="text-slate dark:text-slate-400 text-lg">
            Built specifically for the way universities run programming courses
            — not a generic quiz tool bolted onto a code editor.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="feature-card group bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600 transition-[box-shadow,border-color] duration-200"
              >
                <div
                  className={`${feature.bg} dark:bg-white/5 ${feature.color} w-11 h-11 rounded-xl flex items-center justify-center mb-4`}
                >
                  <Icon size={20} />
                </div>
                <h3 className="font-plus font-semibold text-navy-dark dark:text-white text-base mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Language support */}
        <div className="mt-16 bg-navy-dark dark:bg-slate-800 rounded-2xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <h3 className="font-plus text-xl font-bold text-white mb-2">
              Supports the languages your CS department uses
            </h3>
            <p className="text-white/60 text-sm">
              More languages can be added on request.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: "Python 3", id: 71 },
              { name: "C", id: 50 },
              { name: "C++", id: 54 },
              { name: "C#", id: 51 },
              { name: "Java", id: 62 },
            ].map((lang) => (
              <div
                key={lang.id}
                className="feature-lang bg-white/10 border border-white/10 text-white text-sm font-medium px-4 py-2 rounded-lg font-mono"
              >
                {lang.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
