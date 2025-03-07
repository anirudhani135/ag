
import { useFeatureTour } from './FeatureTourProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, X } from 'lucide-react';

export const FeatureTourDisplay = () => {
  const { currentTour, currentStep, nextStep, prevStep, endTour } = useFeatureTour();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!currentTour) return;
    
    const currentStepData = currentTour.steps[currentStep];
    const targetElement = document.querySelector(currentStepData.target);
    
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const placement = currentStepData.placement || 'bottom';
      
      let top = 0;
      let left = 0;
      
      switch (placement) {
        case 'top':
          top = rect.top - 10 - 150; // card height
          left = rect.left + rect.width / 2 - 150; // card width / 2
          break;
        case 'bottom':
          top = rect.bottom + 10;
          left = rect.left + rect.width / 2 - 150;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - 75;
          left = rect.left - 10 - 300;
          break;
        case 'right':
          top = rect.top + rect.height / 2 - 75;
          left = rect.right + 10;
          break;
      }
      
      // Keep the tooltip within the viewport
      if (left < 10) left = 10;
      if (left > window.innerWidth - 310) left = window.innerWidth - 310;
      if (top < 10) top = 10;
      if (top > window.innerHeight - 160) top = window.innerHeight - 160;
      
      setPosition({ top, left });
      
      // Highlight the target element
      targetElement.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
      
      return () => {
        targetElement.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
      };
    }
  }, [currentTour, currentStep]);
  
  if (!currentTour) return null;
  
  const currentStepData = currentTour.steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === currentTour.steps.length - 1;
  
  return (
    <div 
      className="fixed z-50 transition-all duration-300"
      style={{ top: position.top, left: position.left }}
    >
      <Card className="w-[300px] p-4 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">{currentStepData.title}</h3>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={endTour}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">{currentStepData.content}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {currentStep + 1} of {currentTour.steps.length}
          </div>
          
          <div className="flex space-x-2">
            {!isFirstStep && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={prevStep}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            )}
            
            <Button 
              size="sm" 
              onClick={nextStep}
            >
              {isLastStep ? 'Finish' : 'Next'} {!isLastStep && <ArrowRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
