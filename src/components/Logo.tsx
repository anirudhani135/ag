import { Brain } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Brain className="w-8 h-8 text-accent animate-float" />
      <span className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
        AgentVerse
      </span>
    </div>
  );
};

export default Logo;