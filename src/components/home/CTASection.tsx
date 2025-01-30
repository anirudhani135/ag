import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-24 bg-accent px-6">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-primary/80 max-w-2xl mx-auto mb-8 text-lg">
            Join thousands of businesses already using our AI agents to automate and scale their operations.
          </p>
          <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
            Get Started <Rocket className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};