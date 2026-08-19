import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main>
      {/* globals.css ships every landing section in its pre-animation state so
          the page never paints its finished form and then replays. Without JS
          the intros never run, so hand it all back. Keep this list in step with
          the motion query in globals.css. */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".hero-badge,.hero-heading,.hero-copy,.hero-cta,.hero-social,.hero-mockup,.mockup-line,.problem-card,.problem-solution,.step-card,.feature-card,.feature-lang,.pricing-card,.cta-heading,.cta-copy,.cta-button,.cta-stat{opacity:1}.hero-underline{stroke-dasharray:none;stroke-dashoffset:0}.step-connector{transform:translateY(-2px)}",
          }}
        />
      </noscript>
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
