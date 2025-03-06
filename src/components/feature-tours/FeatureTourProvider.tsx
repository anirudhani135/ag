
import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface FeatureTourStep {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}

interface FeatureTour {
  id: string;
  title: string;
  steps: FeatureTourStep[];
}

interface FeatureTourContextType {
  currentTour: FeatureTour | null;
  startTour: (tourId: string) => void;
  endTour: () => void;
  nextStep: () => void;
  previousStep: () => void;
  currentStep: number;
}

const FeatureTourContext = createContext<FeatureTourContextType | undefined>(undefined);

export const useFeatureTour = () => {
  const context = useContext(FeatureTourContext);
  if (!context) {
    throw new Error('useFeatureTour must be used within a FeatureTourProvider');
  }
  return context;
};

export const FeatureTourProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTour, setCurrentTour] = useState<FeatureTour | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const location = useLocation();

  const { data: tours } = useQuery({
    queryKey: ['feature-tours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_tours')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Safely transform the steps data with proper validation
      return data.map(tour => {
        // Ensure steps is an array
        const stepsData = Array.isArray(tour.steps) ? tour.steps : [];
        
        // Validate and transform each step
        const validSteps: FeatureTourStep[] = stepsData
          .filter((step: any) => 
            typeof step === 'object' && 
            typeof step.target === 'string' && 
            typeof step.title === 'string' && 
            typeof step.content === 'string'
          )
          .map((step: any) => ({
            target: step.target,
            title: step.title,
            content: step.content,
            placement: ['top', 'right', 'bottom', 'left'].includes(step.placement) 
              ? step.placement as 'top' | 'right' | 'bottom' | 'left'
              : 'bottom'
          }));
        
        return {
          id: tour.id,
          title: tour.title,
          steps: validSteps
        } as FeatureTour;
      });
    }
  });

  useEffect(() => {
    // Reset tour when route changes
    setCurrentTour(null);
    setCurrentStep(0);
  }, [location.pathname]);

  const startTour = (tourId: string) => {
    if (!tours) return;
    
    const tour = tours.find(t => t.id === tourId);
    if (tour) {
      setCurrentTour(tour);
      setCurrentStep(0);
    }
  };

  const endTour = () => {
    setCurrentTour(null);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentTour && currentStep < currentTour.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      endTour();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <FeatureTourContext.Provider
      value={{
        currentTour,
        startTour,
        endTour,
        nextStep,
        previousStep,
        currentStep,
      }}
    >
      {children}
    </FeatureTourContext.Provider>
  );
};
