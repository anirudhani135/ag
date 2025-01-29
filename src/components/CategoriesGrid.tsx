import { motion } from 'framer-motion';
import { 
  Brain, 
  MessageSquare, 
  BarChart, 
  Users, 
  ShoppingCart, 
  FileText, 
  Code, 
  Shield, 
  Search 
} from 'lucide-react';

const categories = [
  { icon: Brain, name: 'AI & ML', description: 'Advanced machine learning solutions' },
  { icon: MessageSquare, name: 'Customer Support', description: 'Reduce response times by 50%' },
  { icon: BarChart, name: 'Analytics', description: 'Data-driven insights' },
  { icon: Users, name: 'HR & Recruiting', description: 'Streamline hiring process' },
  { icon: ShoppingCart, name: 'E-commerce', description: 'Boost sales and engagement' },
  { icon: FileText, name: 'Documentation', description: 'Automated documentation' },
  { icon: Code, name: 'Development', description: 'Accelerate development' },
  { icon: Shield, name: 'Security', description: 'Enhanced protection' },
  { icon: Search, name: 'Research', description: 'Intelligent research assistant' }
];

export const CategoriesGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categories.map((category, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 cursor-pointer group"
        >
          <category.icon className="w-8 h-8 mb-4 text-accent group-hover:text-white transition-colors" />
          <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
          <p className="text-secondary group-hover:text-white/80 transition-colors">
            {category.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
};