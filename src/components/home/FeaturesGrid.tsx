import { motion } from "framer-motion";
import { Brain, MessageSquare, ChartBar, Users, ShoppingCart, Shield } from "lucide-react";

const features = [
  { 
    icon: Brain, 
    name: "Advanced AI", 
    description: "State-of-the-art machine learning solutions" 
  },
  { 
    icon: MessageSquare, 
    name: "24/7 Support", 
    description: "Intelligent customer service automation" 
  },
  { 
    icon: ChartBar, 
    name: "Analytics", 
    description: "Real-time insights and reporting" 
  },
  { 
    icon: Users, 
    name: "Team Collaboration", 
    description: "Seamless integration with your team" 
  },
  { 
    icon: ShoppingCart, 
    name: "E-commerce", 
    description: "Automated sales and inventory" 
  },
  { 
    icon: Shield, 
    name: "Enterprise Security", 
    description: "Bank-grade security protocols" 
  }
];

export const FeaturesGrid = () => {
  return (
    <section className="py-24 bg-background px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-primary">Powerful Features</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Everything you need to build, deploy, and scale AI solutions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl bg-surface border border-border hover:shadow-hover transition-all duration-300 hover:scale-105 group"
            >
              <feature.icon className="w-8 h-8 mb-4 text-accent group-hover:text-success transition-colors" />
              <h3 className="text-xl font-semibold mb-2 text-primary">{feature.name}</h3>
              <p className="text-secondary group-hover:text-primary/80 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};