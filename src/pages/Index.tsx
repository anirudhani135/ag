
import { lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { CTASection } from "@/components/home/CTASection";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load testimonials for better performance
const TestimonialsSection = lazy(() => import("@/components/home/TestimonialsSection").then(mod => ({ default: mod.TestimonialsSection })));

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="overflow-hidden">
        <HeroSection />
        <FeaturesGrid />
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><Skeleton className="h-80 w-full max-w-4xl mx-auto" /></div>}>
          <TestimonialsSection />
        </Suspense>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
