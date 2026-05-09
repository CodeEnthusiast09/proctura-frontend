import { Check, ArrowRight } from "lucide-react";

const PLANS = [
  {
    name: "Institution",
    price: "Custom",
    description:
      "For a single university or department ready to go fully digital.",
    cta: "Contact Us",
    ctaHref: "#contact",
    featured: false,
    features: [
      "One school workspace",
      "Unlimited lecturers",
      "Up to 5,000 students",
      "All programming languages",
      "Anti-cheat monitoring",
      "CSV bulk student import",
      "Results dashboard",
      "Email support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description:
      "For university consortiums, state systems, or large deployments.",
    cta: "Let's Talk",
    ctaHref: "#contact",
    featured: true,
    features: [
      "Multiple school workspaces",
      "Unlimited students & lecturers",
      "Custom subdomain per school",
      "Dedicated support",
      "API access",
      "Custom language additions",
      "SLA guarantees",
      "On-premise option available",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-slate-light dark:bg-[#070d1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate uppercase tracking-widest mb-4">
            Pricing
          </div>
          <h2 className="font-plus text-3xl sm:text-4xl font-bold text-navy-dark dark:text-white mb-4">
            Priced for Nigerian universities.
          </h2>
          <p className="text-slate dark:text-slate-400 text-lg">
            No per-student subscriptions. Flat institution pricing so your
            school knows exactly what it&apos;s paying.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 border ${plan.featured
                  ? "bg-navy border-navy shadow-2xl"
                  : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 shadow-sm"
                }`}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-green text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`font-plus text-xl font-bold mb-1 ${plan.featured
                      ? "text-white"
                      : "text-navy-dark dark:text-white"
                    }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-4 ${plan.featured
                      ? "text-white/60"
                      : "text-slate dark:text-slate-400"
                    }`}
                >
                  {plan.description}
                </p>
                <div
                  className={`text-3xl font-plus font-bold ${plan.featured ? "text-white" : "text-navy-dark dark:text-white"}`}
                >
                  {plan.price}
                </div>
                <p
                  className={`text-xs mt-1 ${plan.featured ? "text-white/50" : "text-slate dark:text-slate-500"}`}
                >
                  Pricing based on school size and requirements
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check
                      size={16}
                      className={`mt-0.5 flex-shrink-0 ${plan.featured ? "text-green-light" : "text-green"
                        }`}
                    />
                    <span
                      className={
                        plan.featured
                          ? "text-white/80"
                          : "text-slate-600 dark:text-slate-300"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.ctaHref}
                className={`flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3 rounded-lg transition-colors w-full ${plan.featured
                    ? "bg-green text-white hover:bg-green-light"
                    : "bg-navy text-white hover:bg-navy-light"
                  }`}
              >
                {plan.cta}
                <ArrowRight size={15} />
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-slate dark:text-slate-400 mt-8">
          Not sure which plan fits?{" "}
          <a
            href="#contact"
            className="text-navy dark:text-blue-400 font-semibold hover:underline"
          >
            Talk to us
          </a>{" "}
          &nbsp;and we&apos;ll figure it out together.
        </p>
      </div>
    </section>
  );
}
