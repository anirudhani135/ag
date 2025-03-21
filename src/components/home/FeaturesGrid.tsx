
import { motion } from "framer-motion";
import { Brain, MessageSquare, ChartBar, Users, ShoppingCart, Shield, Cloud, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  { 
    icon: Brain, 
    name: "Advanced AI", 
    description: "State-of-the-art machine learning solutions powered by the latest technologies" 
  },
  { 
    icon: MessageSquare, 
    name: "24/7 Support", 
    description: "Intelligent customer service automation that never sleeps" 
  },
  { 
    icon: ChartBar, 
    name: "Analytics", 
    description: "Real-time insights and detailed reporting on agent performance and user engagement" 
  },
  { 
    icon: Cloud, 
    name: "Scalable Deployment", 
    description: "Effortlessly scale from prototype to production with enterprise-grade infrastructure" 
  },
  { 
    icon: Users, 
    name: "Team Collaboration", 
    description: "Seamless integration with your existing workflow and team management tools" 
  },
  { 
    icon: Zap, 
    name: "Fast Integration", 
    description: "Connect with your existing tools and systems through powerful APIs and webhooks" 
  },
  { 
    icon: ShoppingCart, 
    name: "E-commerce Solutions", 
    description: "Automate sales processes, inventory management, and customer interactions" 
  },
  { 
    icon: Shield, 
    name: "Enterprise Security", 
    description: "Bank-grade security protocols and compliance with industry standards" 
  }
];

export const FeaturesGrid = () => {
  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 font-semibold mb-2 inline-block">POWERFUL CAPABILITIES</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Everything You Need to Succeed
          </h2>
          <p className="text-primary/70 max-w-2xl mx-auto text-lg">
            Our platform provides all the tools and features needed to build, deploy, and scale AI solutions for your business needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(index * 0.1, 0.5) }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="p-6 rounded-xl bg-white shadow hover:shadow-xl border border-gray-100 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary group-hover:text-blue-600 transition-colors">{feature.name}</h3>
              <p className="text-primary/70 group-hover:text-primary/80 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg" 
            className="border-blue-600 text-blue-600 hover:bg-blue-50 transition-all"
            asChild
          >
            <Link to="/features">
              Explore All Features <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
