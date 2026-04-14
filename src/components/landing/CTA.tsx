// src/components/landing/CTA.tsx
import { ArrowRight, Mail, MessageSquare } from "lucide-react";

export function CTA() {
  return (
    <section id="contact" className="py-24 bg-white dark:bg-[#0a0f1e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy rounded-3xl px-8 sm:px-12 lg:px-16 py-16 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-green/10" />
          </div>

          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="font-plus text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
              Ready to move your exams online?
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
              We&apos;ll set up your school&apos;s workspace, onboard your admin team, and have
              you running your first online exam in days — not weeks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="mailto:hello@proctura.com"
                className="inline-flex items-center justify-center gap-2 bg-green text-white font-semibold px-8 py-4 rounded-xl hover:bg-green-light transition-colors text-sm"
              >
                <Mail size={16} />
                Email Us to Get Started
                <ArrowRight size={16} />
              </a>
              <a
                href="https://wa.me/234XXXXXXXXXX"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors text-sm"
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
                <div key={stat.label} className="text-center">
                  <div className="font-plus text-2xl font-bold text-white mb-1">{stat.value}</div>
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
