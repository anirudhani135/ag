import Navigation from "@/components/Navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturesGrid />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;