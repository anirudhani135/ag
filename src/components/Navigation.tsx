import { Button } from "./ui/button";
import Logo from "./Logo";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Logo />
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="hidden md:inline-flex text-white hover:text-accent">
            Sign In
          </Button>
          <Button className="bg-primary-gradient text-primary hover:shadow-hover transition-all duration-300 hover:scale-105">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;