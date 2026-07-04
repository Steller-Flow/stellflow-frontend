import { LandingNav } from "./components/LandingNav";
import { HeroSection } from "./components/landing/HeroSection";
import { MetricsSection } from "./components/landing/MetricsSection";
import { ProblemsSection } from "./components/landing/ProblemsSection";
import { FeaturesSection } from "./components/landing/FeaturesSection";
import { HowItWorksSection } from "./components/landing/HowItWorksSection";
import { UseCasesSection } from "./components/landing/UseCasesSection";
import { CTASection } from "./components/landing/CTASection";
import { FooterSection } from "./components/landing/FooterSection";

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-background text-text-primary">
      <LandingNav />
      <HeroSection />
      <MetricsSection />
      <ProblemsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <UseCasesSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
