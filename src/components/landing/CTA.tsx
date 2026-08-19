"use client";

import { ArrowRight, Mail, MessageSquare } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function CTA() {
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

      tl.fromTo(
        scope.querySelectorAll(".cta-heading"),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
      )
        .fromTo(
          scope.querySelectorAll(".cta-copy"),
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.3",
        )
        .fromTo(
          scope.querySelectorAll(".cta-button"),
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
          "-=0.3",
        )
        .fromTo(
          scope.querySelectorAll(".cta-stat"),
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, stagger: 0.1 },
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
    <section ref={sectionRef} id="contact" className="py-24 bg-white dark:bg-[#0a0f1e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy rounded-3xl px-8 sm:px-12 lg:px-16 py-16 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-green/10" />
          </div>

          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="cta-heading font-plus text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
              Ready to move your exams online?
            </h2>
            <p className="cta-copy text-white/70 text-lg mb-10 max-w-xl mx-auto">
              We&apos;ll set up your school&apos;s workspace, onboard your admin
              team, and have you running your first online exam in days — not
              weeks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="mailto:hello@proctura.com"
                className="cta-button inline-flex items-center justify-center gap-2 bg-green text-white font-semibold px-8 py-4 rounded-xl hover:bg-green-light transition-colors text-sm"
              >
                <Mail size={16} />
                Email Us to Get Started
                <ArrowRight size={16} />
              </a>
              <a
                href="https://wa.me/234XXXXXXXXXX"
                className="cta-button inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors text-sm"
              >
                <MessageSquare size={16} />
                Chat on WhatsApp
              </a>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                { value: "< 48hrs", label: "Setup time" },
                { value: "5 langs", label: "Supported" },
                { value: "100%", label: "Automated grading" },
              ].map((stat) => (
                <div key={stat.label} className="cta-stat text-center">
                  <div className="font-plus text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white/50 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
