
import { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2",
                    currentStep > index || step.isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : currentStep === index
                      ? "border-primary"
                      : "border-muted"
                  )}
                >
                  {currentStep > index || step.isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-[2px] w-16 mx-2",
                      currentStep > index ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <span
                key={`title-${step.id}`}
                className="text-sm text-muted-foreground"
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-lg border p-6"
        >
          {children}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={onPrevious}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            Previous
          </button>
          <div className="space-x-4">
            <button
              onClick={onSaveDraft}
              className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80"
            >
              Save Draft
            </button>
            <button
              onClick={onNext}
              disabled={!canProceed}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
