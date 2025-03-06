
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createPortal } from 'react-dom';
import { useFeatureTour } from './FeatureTourProvider';

export const FeatureTourStep = () => {
  const { currentTour, currentStep, nextStep, previousStep, endTour } = useFeatureTour();
  const [stepPosition, setStepPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!currentTour) return;

    const step = currentTour.steps[currentStep];
    const element = document.querySelector(step.target);
    
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      setStepPosition({
        top: rect.bottom + scrollTop + 10,
        left: rect.left + scrollLeft,
      });

      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentTour, currentStep]);

  if (!currentTour) return null;

  const step = currentTour.steps[currentStep];

  return createPortal(
    <div
      className="fixed z-50"
      style={{
        top: `${stepPosition.top}px`,
        left: `${stepPosition.left}px`,
      }}
    >
      <Card className="w-[300px] shadow-lg">
        <CardContent className="p-4 space-y-4">
          <h3 className="font-semibold">{step.title}</h3>
          <p className="text-sm text-muted-foreground">{step.content}</p>
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={previousStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={endTour}
            >
              Skip
            </Button>
            <Button
              size="sm"
              onClick={nextStep}
            >
              {currentStep === currentTour.steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>,
    document.body
  );
};
