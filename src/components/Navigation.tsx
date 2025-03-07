
import { Button } from "./ui/button";
import Logo from "./Logo";
import { motion } from "framer-motion";

const Navigation = () => {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Logo />
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="hidden md:inline-flex text-gray-600 hover:text-blue-600 transition-colors"
          >
            Sign In
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md transition-all duration-300"
          >
            Get Started
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
