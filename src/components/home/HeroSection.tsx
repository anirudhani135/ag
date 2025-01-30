import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

export const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-background-gradient">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
            Transform Your Business with AI Agents
          </h1>
          <p className="text-xl text-secondary mb-12">
            Deploy powerful AI solutions in minutes. Access a marketplace of pre-trained agents ready to revolutionize your workflow.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-16">
            <Button size="lg" className="bg-primary-gradient text-primary hover:shadow-hover transition-all duration-300 hover:scale-105">
              Explore Agents <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2 border-primary hover:bg-primary hover:text-white transition-all duration-300">
              Watch Demo <Play className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <Card className="p-6 bg-surface border-border hover:shadow-hover transition-all duration-300">
              <h3 className="text-4xl font-bold text-success mb-2">10K+</h3>
              <p className="text-secondary">Active Users</p>
            </Card>
            <Card className="p-6 bg-surface border-border hover:shadow-hover transition-all duration-300">
              <h3 className="text-4xl font-bold text-success mb-2">500+</h3>
              <p className="text-secondary">AI Agents</p>
            </Card>
            <Card className="p-6 bg-surface border-border hover:shadow-hover transition-all duration-300">
              <h3 className="text-4xl font-bold text-success mb-2">98%</h3>
              <p className="text-secondary">Success Rate</p>
            </Card>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
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