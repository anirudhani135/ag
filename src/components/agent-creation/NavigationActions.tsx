
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Save, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavigationActionsProps {
  onSaveDraft: () => Promise<void>;
  onNext: () => Promise<void>;
  canProceed: boolean;
  isSaving: boolean;
  isSubmitting: boolean;
  isLastStep: boolean;
}

export const NavigationActions = ({
  onSaveDraft,
  onNext,
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
        onClick={() => navigate("/developer/agents")}
        className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-sm"
      >
        Cancel
      </Button>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={onSaveDraft}
                disabled={isSaving}
                className="w-full sm:w-auto bg-white hover:bg-primary/5 text-primary border-primary/20 shadow-sm relative"
              >
                {isSaving ? (
                  <>
                    <span className="opacity-0">Save Draft</span>
                    <svg 
                      className="animate-spin h-5 w-5 text-primary absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
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
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 h-11
                  shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLastStep ? (
                  isSubmitting ? "Submitting..." : "Submit Agent"
                ) : (
                  <>
                    Next
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
