
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Rocket, Zap } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient background instead of grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100" />
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12 text-lg">
            Join thousands of businesses already using our AI agents to automate and scale their operations.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transition-all duration-300 hover:scale-105 group"
            >
              Get Started 
              <Rocket className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-blue-600 bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg transition-all duration-300 group"
            >
              Schedule Demo
              <Zap className="ml-2 w-4 h-4 group-hover:text-blue-700 transition-colors" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
