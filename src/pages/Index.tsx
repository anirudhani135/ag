import { motion } from "framer-motion";
import { ArrowRight, Play, Brain, MessageSquare, BarChart, Users, ShoppingCart, Shield } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  // Fetch platform metrics with proper error handling
  const { data: metrics } = useQuery({
    queryKey: ['platform-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_metrics')
        .select('*')
        .order('metric_date', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching metrics:', error);
        return null;
      }
      
      return data;
    }
  });

  // Default metrics if none are found
  const defaultMetrics = {
    daily_active_users: 1000,
    total_revenue: 50000,
    successful_transactions: 500
  };

  const displayMetrics = metrics || defaultMetrics;

  const categories = [
    { icon: Brain, name: 'AI & ML', description: 'Advanced machine learning solutions' },
    { icon: MessageSquare, name: 'Customer Support', description: 'Reduce response times by 50%' },
    { icon: BarChart, name: 'Analytics', description: 'Data-driven insights' },
    { icon: Users, name: 'HR & Recruiting', description: 'Streamline hiring process' },
    { icon: ShoppingCart, name: 'E-commerce', description: 'Boost sales and engagement' },
    { icon: Shield, name: 'Security', description: 'Enhanced protection' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Transform Your Business with AI Agents
          </h1>
          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto">
            Deploy powerful AI solutions in minutes. Access a marketplace of pre-trained agents ready to revolutionize your workflow.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Button size="lg" className="bg-accent text-primary hover:bg-accent/90">
              Explore Agents <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              Watch Demo <Play className="w-4 h-4" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 bg-white/5 backdrop-blur border-white/10">
              <h3 className="text-4xl font-bold text-accent mb-2">
                {displayMetrics.daily_active_users.toLocaleString()}+
              </h3>
              <p className="text-secondary">Active Users</p>
            </Card>
            <Card className="p-6 bg-white/5 backdrop-blur border-white/10">
              <h3 className="text-4xl font-bold text-accent mb-2">500+</h3>
              <p className="text-secondary">AI Agents</p>
            </Card>
            <Card className="p-6 bg-white/5 backdrop-blur border-white/10">
              <h3 className="text-4xl font-bold text-accent mb-2">98%</h3>
              <p className="text-secondary">Success Rate</p>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-surface px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Popular AI Categories</h2>
            <p className="text-secondary max-w-2xl mx-auto">
              Discover AI agents tailored to your specific needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <category.icon className="w-8 h-8 mb-4 text-accent group-hover:text-primary transition-colors" />
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-secondary">{category.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-secondary max-w-2xl mx-auto">
              Get started with AgentVerse in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Browse", description: "Explore our marketplace" },
              { step: "02", title: "Deploy", description: "One-click deployment" },
              { step: "03", title: "Monitor", description: "Track performance" }
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

      {/* Social Proof */}
      <section className="py-24 bg-surface px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold mb-12">Trusted by Industry Leaders</h2>
            <div className="flex justify-center gap-8 opacity-50 mb-16">
              {/* Placeholder company logos */}
              <div className="h-12 w-32 bg-secondary/20 rounded"></div>
              <div className="h-12 w-32 bg-secondary/20 rounded"></div>
              <div className="h-12 w-32 bg-secondary/20 rounded"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary px-6">
        <div className="max-w-7xl mx-auto text-center">
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
              <Button size="lg" className="bg-accent text-primary hover:bg-accent/90">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;