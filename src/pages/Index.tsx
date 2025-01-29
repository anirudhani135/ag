import { motion } from "framer-motion";
import { ArrowRight, Play, Shield, Users, Star } from "lucide-react";
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

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Find & Deploy AI Agents <br />
            for Your Business
          </motion.h1>
          
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

          {/* Client Logos */}
          <div className="mt-20">
            <p className="text-sm text-secondary mb-8">Trusted by innovative companies</p>
            <div className="flex justify-center gap-12 grayscale opacity-50">
              <div className="h-12 w-32 bg-white/10 rounded-lg backdrop-blur-sm" />
              <div className="h-12 w-32 bg-white/10 rounded-lg backdrop-blur-sm" />
              <div className="h-12 w-32 bg-white/10 rounded-lg backdrop-blur-sm" />
              <div className="h-12 w-32 bg-white/10 rounded-lg backdrop-blur-sm" />
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;