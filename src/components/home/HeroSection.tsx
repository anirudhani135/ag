
import { motion } from "framer-motion";
import { ArrowRight, Play, Bot, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative pt-40 pb-32 overflow-hidden">
      {/* Enhanced gradient background with more contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-blue-50/30 opacity-90" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6 relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center"
        >
          <span className="text-blue-600 font-semibold mb-3 inline-flex items-center">
            <Bot className="mr-2 h-5 w-5" /> AI Agent Platform
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-primary">
            Transform Your <span className="text-blue-600">Business</span> with AI Agents
          </h1>
          <p className="text-xl text-primary/80 mb-12 max-w-xl">
            Deploy powerful AI solutions in minutes. Access a marketplace of pre-trained agents ready to revolutionize your workflow.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-16">
            <Button 
              size="lg" 
              variant="primary"
              className="text-base shadow-lg hover:shadow-blue-200/50 transition-all duration-300 hover:scale-105 group"
            >
              Get Started 
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300"
            >
              Watch Demo <Play className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              asChild
              className="text-base text-primary/80 hover:text-primary hover:bg-gray-100 transition-all duration-300"
            >
              <Link to="/marketplace">
                Browse Marketplace <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {[
              { label: "Active Users", value: "10K+", description: "Globally" },
              { label: "AI Agents", value: "500+", description: "Ready to deploy" },
              { label: "Success Rate", value: "98%", description: "Customer satisfaction" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ y: -5 }}
                className="transition-all duration-300"
              >
                <Card className="p-6 border-border hover:border-blue-200 hover:shadow-lg transition-all duration-300 bg-white">
                  <h3 className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</h3>
                  <p className="text-primary font-medium mb-1">{stat.label}</p>
                  <p className="text-sm text-primary/60">{stat.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <Card className="w-full h-[600px] bg-gradient-to-br from-blue-50 to-blue-100/50 relative overflow-hidden border border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-xl" 
                aria-label="Interactive 3D visualization of AI agents working together">
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
            <div className="relative w-full h-full">
              <SplineScene 
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
