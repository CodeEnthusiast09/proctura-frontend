"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: "01",
    title: "School Gets Onboarded",
    description:
      "The Proctura team sets up your school's workspace. Your IT admin gets a school_admin account to manage lecturers and students.",
    details: [
      "Unique subdomain (yourschool.proctura.com)",
      "School admin account created",
      "Bulk student import via CSV",
    ],
    color: "bg-navy",
  },
  {
    number: "02",
    title: "Lecturer Sets Up the Exam",
    description:
      "Lecturers create exams with questions, set the time window, pick the programming language, and add test cases — visible and hidden.",
    details: [
      "Create courses and exams",
      "Add questions with point values",
      "Write test cases (some hidden from students)",
    ],
    color: "bg-green",
  },
  {
    number: "03",
    title: "Student Takes the Exam",
    description:
      "Students log in during the exam window, write real code in the browser editor, and submit. Grading happens automatically.",
    details: [
      "VS Code-like code editor in the browser",
      "Personal countdown timer per student",
      "Code runs against all test cases",
    ],
    color: "bg-navy-light",
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const scope = sectionRef.current;
      if (!scope) return;

      const cards = scope.querySelectorAll<HTMLElement>(".step-card");
      const connectors = scope.querySelectorAll<HTMLElement>(".step-connector");

      gsap.set(connectors, { y: -2, scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: scope, start: "top 65%" },
      });

      cards.forEach((card, i) => {
        tl.fromTo(
          card,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          i === 0 ? undefined : "-=0.1",
        );
        if (connectors[i]) {
          tl.to(connectors[i], { scaleX: 1, duration: 0.4, ease: "power2.inOut" }, "-=0.1");
        }
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="py-24 bg-slate-light dark:bg-[#070d1a]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate uppercase tracking-widest mb-4">
            How It Works
          </div>
          <h2 className="font-plus text-3xl sm:text-4xl font-bold text-navy-dark dark:text-white mb-4">
            From setup to graded results in three steps.
          </h2>
          <p className="text-slate dark:text-slate-400 text-lg">
            Proctura is built around how universities actually work — schools,
            lecturers, and students each get the right tools.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {STEPS.map((step, idx) => (
            <div key={step.number} className="relative">
              {idx < STEPS.length - 1 && (
                <div
                  className="step-connector hidden lg:block absolute top-8 left-full w-full h-px border-t-2 border-dashed border-slate-200 dark:border-slate-700 z-0"
                />
              )}
              <div className="step-card relative bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 rounded-2xl p-8 shadow-sm h-full">
                <div
                  className={`${step.color} text-white font-plus font-bold text-sm w-10 h-10 rounded-xl flex items-center justify-center mb-6`}
                >
                  {step.number}
                </div>
                <h3 className="font-plus text-xl font-bold text-navy-dark dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-slate dark:text-slate-400 text-sm leading-relaxed mb-6">
                  {step.description}
                </p>
                <ul className="space-y-2.5">
                  {step.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300"
                    >
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-green-pale dark:bg-green/10 border border-green/30 text-green flex items-center justify-center flex-shrink-0 text-[10px]">
                        ✓
                      </span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
