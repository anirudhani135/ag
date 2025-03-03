
import { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface WizardStep {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface WizardLayoutProps {
  children: ReactNode;
  currentStep: number;
  steps: WizardStep[];
  onNext: () => void;
  onPrevious: () => void;
  onSaveDraft: () => void;
  canProceed: boolean;
}

export const WizardLayout = ({
  children,
  currentStep,
  steps,
  onNext,
  onPrevious,
  onSaveDraft,
  canProceed
}: WizardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps with improved accessibility */}
        <div className="mb-8">
          <div className="flex items-center justify-between" role="progressbar" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={currentStep + 1}>
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                    currentStep > index || step.isCompleted
                      ? "border-accent bg-accent text-accent-foreground"
                      : currentStep === index
                      ? "border-accent"
                      : "border-muted"
                  )}
                  aria-label={`Step ${index + 1}: ${step.title}`}
                  aria-current={currentStep === index ? "step" : undefined}
                >
                  {currentStep > index || step.isCompleted ? (
                    <Check className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-[2px] w-16 mx-2 transition-colors",
                      currentStep > index ? "bg-accent" : "bg-muted"
                    )}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <span
                key={`title-${step.id}`}
                className={cn(
                  "text-sm",
                  currentStep === index ? "text-foreground font-medium" : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Content Area with animations for feedback */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-lg border p-6 shadow-sm"
        >
          {children}
        </motion.div>

        {/* We're removing the duplicate navigation buttons here since they're now handled in NavigationActions */}
      </div>
    </div>
  );
};
