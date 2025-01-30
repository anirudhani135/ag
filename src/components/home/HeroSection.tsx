import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

export const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-background-gradient opacity-50" />
      <div className="absolute inset-0 bg-grid-white/10" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6 relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-success to-accent bg-clip-text text-transparent">
            Transform Your Business with AI Agents
          </h1>
          <p className="text-xl text-secondary mb-12">
            Deploy powerful AI solutions in minutes. Access a marketplace of pre-trained agents ready to revolutionize your workflow.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-16">
            <Button 
              size="lg" 
              className="bg-primary-gradient text-primary hover:shadow-hover transition-all duration-300 hover:scale-105 group"
            >
              Explore Agents 
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 border-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              Watch Demo <Play className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {[
              { label: "Active Users", value: "10K+" },
              { label: "AI Agents", value: "500+" },
              { label: "Success Rate", value: "98%" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-surface border-border hover:shadow-hover transition-all duration-300">
                  <h3 className="text-4xl font-bold text-success mb-2">{stat.value}</h3>
                  <p className="text-secondary">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Card className="w-full h-[600px] bg-dark-gradient relative overflow-hidden border-none">
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