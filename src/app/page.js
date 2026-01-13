"use client";

import ScrollToTop from "@/components/ScrollToTop";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Recommendations from "@/components/home/Recommendations";
import {
  FeaturesSection,
  ReadingSanctuary,
  TrendingGenres,
  HowItWorks,
  AppShowcase,
  Testimonials,
  FAQSection,
  CTASection,
} from "@/components/home/HomeSections";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {/* Scroll To Top Button */}
      <ScrollToTop />

      {/* 1. Hero */}
      <Hero />

      {/* 2. Stats */}
      <Stats />

      {/* 3. Recommendations (Personalized) */}
      <Recommendations />

      {/* 4. Features */}
      <FeaturesSection />
      <ReadingSanctuary />

      {/* 5. Trending Genres */}
      <TrendingGenres />

      {/* 6. How It Works */}
      <HowItWorks />

      {/* 7. App Showcase */}
      <AppShowcase />

      {/* 8. Testimonials */}
      <Testimonials />

      {/* 9. FAQ */}
      <FAQSection />

      {/* 10. CTA */}
      <CTASection />
    </div>
  );
}
