
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const agentFormSchema = z.object({
  title: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  config: z.any().optional(),
});

type AgentFormValues = z.infer<typeof agentFormSchema>;

interface AgentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "deploy" | "edit";
  initialData?: AgentFormValues;
  onSubmit?: (data: AgentFormValues) => Promise<void>;
}

export const AgentModal = ({
  open,
  onOpenChange,
  type,
  initialData,
  onSubmit,
}: AgentModalProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      price: 0,
      config: undefined,
    },
  });

  const handleSubmit = async (data: AgentFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] transition-all duration-300 ease-in-out">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {type === "deploy" ? "Deploy New Agent" : "Edit Agent"}
          </DialogTitle>
          <DialogDescription>
            {type === "deploy" 
              ? "Fill in the details below to deploy your new AI agent."
              : "Update your agent's details below."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter agent name"
                      className="transition-all duration-200 hover:border-primary/50 focus:border-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Describe your agent's functionality"
                      className="min-h-[100px] transition-all duration-200 hover:border-primary/50 focus:border-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (USD)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      min="0"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                      className="transition-all duration-200 hover:border-primary/50 focus:border-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel htmlFor="config" className="text-muted-foreground">
                Configuration (Coming Soon)
              </FormLabel>
              <div className={cn(
                "border-2 border-dashed rounded-lg p-4 transition-all duration-200",
                "hover:bg-muted/50 cursor-not-allowed opacity-50"
              )}>
                <p className="text-sm text-muted-foreground text-center">
                  Langflow JSON configuration upload will be available soon
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {type === "deploy" ? "Deploying..." : "Updating..."}
                  </>
                ) : (
                  type === "deploy" ? "Deploy Agent" : "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
