import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
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
      <section className="relative overflow-hidden px-6 lg:px-8 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-7xl text-center"
        >
          <RotatingHeadline />
          <p className="mx-auto max-w-2xl text-lg text-secondary mt-8 mb-12">
            Experience the future of automation with our AI-powered agents. 
            Build, deploy, and scale your solutions with ease.
          </p>
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

          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-4">Trusted By</h2>
            <div className="flex justify-center gap-8 opacity-50">
              {/* Add company logos here */}
              <div className="h-8 w-32 bg-white/10 rounded"></div>
              <div className="h-8 w-32 bg-white/10 rounded"></div>
              <div className="h-8 w-32 bg-white/10 rounded"></div>
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
            <h2 className="text-3xl font-bold mb-4">Explore Categories</h2>
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