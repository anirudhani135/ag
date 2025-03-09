
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Save, ChevronRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavigationActionsProps {
  onSaveDraft: () => Promise<void>;
  onNext: () => Promise<void>;
  onPrevious: () => void;
  canProceed: boolean;
  isSaving: boolean;
  isSubmitting: boolean;
  isLastStep: boolean;
}

export const NavigationActions = ({
  onSaveDraft,
  onNext,
  onPrevious,
  canProceed,
  isSaving,
  isSubmitting,
  isLastStep
}: NavigationActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        className="w-full sm:w-auto bg-white text-black hover:bg-gray-50 border-gray-200"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={onSaveDraft}
                disabled={isSaving}
                className="w-full sm:w-auto bg-white text-black hover:bg-gray-50 border-gray-200 relative"
                aria-label="Save draft of your agent"
              >
                {isSaving ? (
                  <>
                    <span className="opacity-0">Save Draft</span>
                    <svg 
                      className="animate-spin h-5 w-5 text-black absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save your progress to continue later</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onNext}
                disabled={!canProceed || isSubmitting}
                className="w-full sm:w-auto bg-blue-500 text-white hover:bg-blue-600 px-8 h-11
                  shadow-sm hover:shadow-md transition-all duration-200"
                aria-label={isLastStep ? "Submit your agent" : "Continue to the next step"}
              >
                {isLastStep ? (
                  isSubmitting ? "Submitting..." : "Submit Agent"
                ) : (
                  <>
                    Continue
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isLastStep ? "Submit your agent" : "Continue to the next step"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
