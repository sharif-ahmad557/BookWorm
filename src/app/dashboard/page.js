"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Components Imports
import UserCharts from "@/components/home/UserCharts";
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

export default function UserDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <ScrollToTop />
      <Hero />
      <UserCharts />
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
