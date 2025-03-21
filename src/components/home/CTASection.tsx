
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Rocket, Zap, Users, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const CTASection = () => {
  const benefits = [
    { text: "No coding required", icon: CheckCircle },
    { text: "Deploy in minutes", icon: CheckCircle },
    { text: "Scale automatically", icon: CheckCircle },
    { text: "Pay as you grow", icon: CheckCircle },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />
      
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-400/20 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-4xl mx-auto overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 relative z-10"
          >
            <span className="text-blue-600 font-semibold mb-2 inline-block">GET STARTED TODAY</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-primary/70 max-w-2xl mx-auto mb-8 text-lg">
              Join thousands of businesses already using our AI agents to automate and scale their operations.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-center sm:justify-start gap-2"
                >
                  <benefit.icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-primary/80 text-sm font-medium">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                variant="primary"
                className="text-base shadow-lg hover:shadow-blue-200/50 transition-all duration-300 hover:scale-105 group"
                asChild
              >
                <Link to="/auth/register">
                  Get Started Free
                  <Rocket className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-blue-600 bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg transition-all duration-300 group"
                asChild
              >
                <Link to="/contact">
                  Schedule Demo
                  <Zap className="ml-2 w-4 h-4 group-hover:text-blue-700 transition-colors" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
