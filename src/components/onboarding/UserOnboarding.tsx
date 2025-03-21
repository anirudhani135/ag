
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Gift, Star, User, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useCache } from '@/context/CacheContext';

type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  route?: string;
  isCompleted?: boolean;
};

export const UserOnboarding = () => {
  const [open, setOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { prefetchRoute } = useCache();

  // Define onboarding steps
  const steps: OnboardingStep[] = [
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Add your personal information to get the most out of the platform.',
      icon: <User className="h-12 w-12 text-primary" />,
      route: '/user/settings',
    },
    {
      id: 'credits',
      title: 'Get Your Free Credits',
      description: 'Claim your free credits to start using our AI agents.',
      icon: <Gift className="h-12 w-12 text-purple-500" />,
      route: '/user/credits',
    },
    {
      id: 'explore',
      title: 'Explore the Marketplace',
      description: 'Discover AI agents that can help with your tasks.',
      icon: <Star className="h-12 w-12 text-amber-500" />,
      route: '/marketplace',
    },
    {
      id: 'first-agent',
      title: 'Try Your First Agent',
      description: 'Experience the power of AI by trying any agent in the marketplace.',
      icon: <Zap className="h-12 w-12 text-blue-500" />,
    }
  ];

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('onboarding_completed, onboarding_steps')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching onboarding status:", error);
          return;
        }
        
        if (data) {
          if (!data.onboarding_completed) {
            setOpen(true);
            if (data.onboarding_steps) {
              setCompletedSteps(data.onboarding_steps as Record<string, boolean>);
              
              // Find the first incomplete step
              const firstIncompleteIndex = steps.findIndex(
                step => !data.onboarding_steps[step.id]
              );
              
              if (firstIncompleteIndex !== -1) {
                setCurrentStepIndex(firstIncompleteIndex);
              } else {
                // All steps completed
                completeOnboarding();
              }
            }
          }
        }
      }
    };
    
    checkOnboardingStatus();
  }, []);

  const currentStep = steps[currentStepIndex];
  
  const markStepComplete = async (stepId: string) => {
    const updatedSteps = { ...completedSteps, [stepId]: true };
    setCompletedSteps(updatedSteps);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ onboarding_steps: updatedSteps })
        .eq('id', user.id);
    }
    
    // If all steps completed, mark onboarding as done
    if (Object.keys(updatedSteps).length === steps.length && 
        Object.values(updatedSteps).every(v => v)) {
      completeOnboarding();
    }
  };
  
  const completeOnboarding = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);
    }
    
    setOpen(false);
    toast({
      title: "Welcome aboard!",
      description: "You've completed the onboarding process.",
    });
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      markStepComplete(currentStep.id);
      
      // Prefetch data for the next step if it has a route
      const nextStep = steps[currentStepIndex + 1];
      if (nextStep.route) {
        prefetchRoute(nextStep.route);
      }
      
      setCurrentStepIndex(prev => prev + 1);
    } else {
      markStepComplete(currentStep.id);
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    if (currentStepIndex < steps.length - 1) {
      // Prefetch next route even when skipping
      const nextStep = steps[currentStepIndex + 1];
      if (nextStep.route) {
        prefetchRoute(nextStep.route);
      }
      
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleNavigate = () => {
    if (currentStep.route) {
      markStepComplete(currentStep.id);
      navigate(currentStep.route);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Welcome to the Platform</DialogTitle>
          <DialogDescription>
            Complete these steps to get started
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-6">
          <Progress 
            value={(currentStepIndex / (steps.length - 1)) * 100} 
            className="h-2 mb-4" 
          />
          
          <div className="flex items-center justify-center my-4">
            {currentStep.icon}
          </div>
          
          <h3 className="text-xl font-semibold text-center mb-2">
            {currentStep.title}
          </h3>
          <p className="text-center text-muted-foreground mb-6">
            {currentStep.description}
          </p>
          
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div 
                key={step.id}
                className={`flex items-center p-2 rounded-md ${
                  idx === currentStepIndex 
                    ? 'bg-primary/10 border border-primary/30' 
                    : idx < currentStepIndex || completedSteps[step.id]
                    ? 'text-muted-foreground'
                    : ''
                }`}
              >
                {idx < currentStepIndex || completedSteps[step.id] ? (
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center mr-2">
                    {idx + 1}
                  </div>
                )}
                <span>{step.title}</span>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleSkip}
          >
            Skip
          </Button>
          {currentStep.route ? (
            <Button onClick={handleNavigate}>
              Go to {currentStep.title} <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {currentStepIndex < steps.length - 1 ? 'Next' : 'Complete'} <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
