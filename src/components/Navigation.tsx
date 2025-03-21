
import { Button } from "./ui/button";
import Logo from "./Logo";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-border shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 h-20 flex items-center justify-between">
        <Logo />
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors font-medium"
            onClick={() => navigate('/auth/login')}
          >
            Sign In
          </Button>
          <Button 
            className="bg-black text-white hover:bg-black/90 shadow-sm transition-all duration-300"
            onClick={() => navigate('/auth/register')}
          >
            Get Started
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
