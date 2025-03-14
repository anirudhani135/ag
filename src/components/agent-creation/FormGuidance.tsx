
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info } from "lucide-react";

interface FormGuidanceProps {
  fieldName: string;
  title: string;
  description: string;
  examples?: string[];
  bestPractices?: string[];
}

export const FormGuidance = ({ 
  fieldName, 
  title, 
  description, 
  examples, 
  bestPractices 
}: FormGuidanceProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center ml-1 text-muted-foreground hover:text-foreground transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          aria-label={`More information about ${fieldName}`}
        >
          <Info className="h-4 w-4" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4" side="top">
        <div className="space-y-2">
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
          
          {examples && examples.length > 0 && (
            <div className="mt-2">
              <h5 className="text-sm font-medium">Examples:</h5>
              <ul className="text-sm mt-1 space-y-1">
                {examples.map((example, i) => (
                  <li key={i} className="text-muted-foreground">• {example}</li>
                ))}
              </ul>
            </div>
          )}
          
          {bestPractices && bestPractices.length > 0 && (
            <div className="mt-2">
              <h5 className="text-sm font-medium">Best Practices:</h5>
              <ul className="text-sm mt-1 space-y-1">
                {bestPractices.map((practice, i) => (
                  <li key={i} className="text-muted-foreground">• {practice}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
