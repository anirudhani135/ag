import { motion } from "framer-motion";
import { ArrowRight, Play, Star, Users, Shield, Zap } from "lucide-react";
import { RotatingHeadline } from "@/components/RotatingHeadline";
import { StatsCounter } from "@/components/StatsCounter";
import { CategoriesGrid } from "@/components/CategoriesGrid";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 lg:px-8 pt-32 pb-24 sm:pt-40 sm:pb-32">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/5" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-accent/10 rounded-full blur-3xl opacity-20" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-7xl text-center relative"
        >
          {/* Trust Badges */}
          <div className="flex justify-center gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 text-sm text-secondary bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <Shield className="w-4 h-4" /> Enterprise-grade security
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 text-sm text-secondary bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <Users className="w-4 h-4" /> 10k+ active users
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 text-sm text-secondary bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <Star className="w-4 h-4" /> 4.9/5 rating
            </motion.div>
          </div>

          <RotatingHeadline />
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-secondary mt-8 mb-12"
          >
            Discover and deploy production-ready AI agents for your business.
            Built by developers, trusted by enterprises.
          </motion.p>

          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-4 bg-accent text-primary rounded-full font-semibold hover:bg-accent/90 transition-colors flex items-center gap-2"
            >
              Explore Agents <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-4 glass rounded-full hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              Watch Demo <Play className="w-4 h-4" />
            </motion.button>
          </div>

          <StatsCounter />

          {/* Trusted By Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-8">Trusted By Industry Leaders</h2>
            <div className="flex justify-center gap-12 grayscale opacity-50">
              <div className="h-12 w-32 bg-white/10 rounded-lg backdrop-blur-sm" />
              <div className="h-12 w-32 bg-white/10 rounded-lg backdrop-blur-sm" />
              <div className="h-12 w-32 bg-white/10 rounded-lg backdrop-blur-sm" />
              <div className="h-12 w-32 bg-white/10 rounded-lg backdrop-blur-sm" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-surface px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-accent">AI Agents by Category</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Explore Our Marketplace</h2>
            <p className="text-secondary max-w-2xl mx-auto">
              Discover AI agents tailored to your specific needs. From customer support 
              to data analysis, we've got you covered.
            </p>
          </motion.div>
          
          <CategoriesGrid />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-secondary max-w-2xl mx-auto">
              Get started with AgentVerse in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Browse",
                description: "Explore our marketplace of AI agents"
              },
              {
                step: "02",
                title: "Customize",
                description: "Configure the agent to your needs"
              },
              {
                step: "03",
                title: "Deploy",
                description: "Integrate via API or download instantly"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-8"
              >
                <div className="text-6xl font-bold text-accent/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-secondary">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Start your free trial today and experience the power of AI agents
            </p>
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-4 bg-accent text-primary rounded-full font-semibold hover:bg-accent/90 transition-colors"
              >
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-4 glass rounded-full hover:bg-white/20 transition-colors text-white"
              >
                Contact Sales
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;