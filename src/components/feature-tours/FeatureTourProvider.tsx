
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FeatureTourStep {
  target: string;
  title: string;
  content: string;
  placement?: "top" | "right" | "bottom" | "left";
}

interface FeatureTour {
  steps: FeatureTourStep[];
  title: string;
}

interface FeatureTourContextType {
  currentTour: FeatureTour | null;
  currentStep: number;
  startTour: (tourName: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
  isTourActive: boolean;
}

const FeatureTourContext = createContext<FeatureTourContextType | undefined>(undefined);

export const FeatureTourProvider = ({ children }: { children: ReactNode }) => {
  const [currentTour, setCurrentTour] = useState<FeatureTour | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);
  const location = useLocation();

  const { data: tours } = useQuery({
    queryKey: ['feature-tours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_tours')
        .select('*');
      
      if (error) {
        console.error("Error fetching feature tours:", error);
        throw error;
      }
      
      return data || [];
    },
    staleTime: 60 * 1000, // 1 minute
  });

  useEffect(() => {
    // End tour if route changes
    endTour();
  }, [location.pathname]);

  const startTour = (tourName: string) => {
    if (!tours) return;

    const tour = tours.find(t => t.title === tourName);
    if (!tour) {
      console.error(`Tour "${tourName}" not found`);
      return;
    }

    // Validate and transform tour steps
    const validSteps: FeatureTourStep[] = Array.isArray(tour.steps) 
      ? tour.steps
        .filter((step: any) => 
          step && 
          typeof step.target === 'string' && 
          typeof step.title === 'string' && 
          typeof step.content === 'string'
        )
        .map((step: any) => ({
          target: step.target,
          title: step.title,
          content: step.content,
          placement: ['top', 'right', 'bottom', 'left'].includes(step.placement) 
            ? step.placement 
            : 'bottom'
        }))
      : [];

    if (validSteps.length === 0) {
      console.error(`Tour "${tourName}" has no valid steps`);
      return;
    }

    setCurrentTour({
      title: tour.title,
      steps: validSteps
    });
    setCurrentStep(0);
    setIsTourActive(true);
  };

  const nextStep = () => {
    if (!currentTour) return;
    
    if (currentStep < currentTour.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (!currentTour) return;
    
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const endTour = () => {
    setCurrentTour(null);
    setCurrentStep(0);
    setIsTourActive(false);
  };

  return (
    <FeatureTourContext.Provider
      value={{
        currentTour,
        currentStep,
        startTour,
        nextStep,
        prevStep,
        endTour,
        isTourActive,
      }}
    >
      {children}
    </FeatureTourContext.Provider>
  );
};

export const useFeatureTour = () => {
  const context = useContext(FeatureTourContext);
  if (context === undefined) {
    throw new Error("useFeatureTour must be used within a FeatureTourProvider");
  }
  return context;
};
