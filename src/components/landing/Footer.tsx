import { ProcuturaLogo } from "./Logo";

const FOOTER_LINKS = {
  Product: ["Features", "How It Works", "Pricing"],
  Support: ["Contact Us", "Documentation", "FAQ"],
  Legal: ["Privacy Policy", "Terms of Service"],
};

export function Footer() {
  return (
    <footer className="bg-navy-dark dark:bg-[#050810] text-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <ProcuturaLogo variant="light" />
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Giving Nigerian universities a real online coding exam platform —
              so students can write, run, and submit actual code.
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Proctura. All rights reserved.
          </p>
          <p className="text-sm">Built for Nigerian universities 🇳🇬</p>
        </div>
      </div>
    </footer>
  );
}
