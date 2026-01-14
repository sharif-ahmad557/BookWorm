"use client";

import ScrollToTop from "@/components/ScrollToTop";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Recommendations from "@/components/home/Recommendations";
import {
  FeaturesSection,
  TrendingGenres,
  HowItWorks,
  AppShowcase,
  Testimonials,
  FAQSection,
  CTASection,
  ReadingSanctuary,
} from "@/components/home/HomeSections";

export default function VisualHomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <ScrollToTop />
      <Hero />
      <Stats />
      <Recommendations />
      <FeaturesSection />
      <ReadingSanctuary />
      <TrendingGenres />
      <HowItWorks />
      <AppShowcase />
      <Testimonials />
      <FAQSection />
      <CTASection />
    </div>
  );
}
