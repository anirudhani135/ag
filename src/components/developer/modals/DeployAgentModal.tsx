
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface DeployAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: () => void;
}

interface DeployFormData {
  name: string;
  description: string;
  price: string;
  version: string;
  permissions: string;
  category: string;
}

const DeployAgentModal = ({ isOpen, onClose, onDeploy }: DeployAgentModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<DeployFormData>();

  const steps = ["Upload", "Configure", "Validate", "Publish"];

  const onSubmit = (data: DeployFormData) => {
    toast({
      title: "Coming Soon",
      description: "Agent deployment will be available soon.",
      variant: "default",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deploy New Agent</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex justify-between mb-8">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex flex-col items-center ${
                  index <= currentStep
                    ? "text-primary"
                    : "text-muted-foreground opacity-50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    index <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-xs">{step}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {currentStep === 0 && (
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-not-allowed opacity-50">
                <p>Coming Soon: Upload Langflow JSON</p>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or click to browse
                </p>
              </div>
            )}

            {currentStep === 1 && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter agent name"
                    {...register("name", { required: true })}
                    className="opacity-50 cursor-not-allowed"
                    disabled
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter description"
                    {...register("description", { required: true })}
                    className="opacity-50 cursor-not-allowed"
                    disabled
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter price"
                    {...register("price", { required: true })}
                    className="opacity-50 cursor-not-allowed"
                    disabled
                  />
                </div>
              </>
            )}

            {currentStep === 2 && (
              <div className="text-center p-6 opacity-50">
                <p>Coming Soon: Validation</p>
                <p className="text-sm text-muted-foreground">
                  Agent validation will be available soon
                </p>
              </div>
            )}

            {currentStep === 3 && (
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select disabled>
                  <SelectTrigger className="opacity-50 cursor-not-allowed">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coming-soon">Coming Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev))
                }
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              {currentStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  className="opacity-50 cursor-not-allowed"
                  disabled
                >
                  Deploy
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() =>
                    setCurrentStep((prev) =>
                      prev < steps.length - 1 ? prev + 1 : prev
                    )
                  }
                >
                  Next
                </Button>
              )}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeployAgentModal;
