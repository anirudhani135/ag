import { Brain } from "lucide-react";
import { motion } from "framer-motion";

const Logo = () => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2 cursor-pointer"
    >
      <Brain className="w-8 h-8 text-accent" />
      <span className="text-2xl font-bold text-primary">
        AgentVerse
      </span>
    </motion.div>
  );
};

export default Logo;