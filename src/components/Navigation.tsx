import { Button } from "./ui/button";
import Logo from "./Logo";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Logo />
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-secondary hover:text-primary transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-secondary hover:text-primary transition-colors">
            Pricing
          </a>
          <a href="#about" className="text-secondary hover:text-primary transition-colors">
            About
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="hidden md:inline-flex">
            Sign In
          </Button>
          <Button className="bg-accent text-primary hover:bg-accent/90">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;