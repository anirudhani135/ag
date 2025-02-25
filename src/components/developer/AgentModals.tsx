
import * as React from "react";
import { useState, useCallback } from "react"; // Add this import
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
import { Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/integrations/supabase/client";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configFile, setConfigFile] = useState<File | null>(null);

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      price: 0,
      config: undefined,
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const jsonConfig = JSON.parse(reader.result as string);
          setConfigFile(file);
          form.setValue("config", jsonConfig);
        } catch (e) {
          setError("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  }, [form]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
    },
    maxFiles: 1,
  });

  const handleSubmit = async (data: AgentFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // First create/update the agent
      const agentResponse = await supabase
        .from('agents')
        .upsert({
          title: data.title,
          description: data.description,
          price: data.price,
          status: 'draft',
          developer_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (agentResponse.error) throw agentResponse.error;

      // If we have a config file, process it with our edge function
      if (data.config) {
        const { error: configError } = await supabase.functions.invoke('process-langflow', {
          body: {
            agentId: agentResponse.data.id,
            config: data.config,
          },
        });

        if (configError) throw configError;
      }

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === "deploy" ? "Deploy New Agent" : "Edit Agent"}
          </DialogTitle>
          <DialogDescription>
            {type === "deploy" 
              ? "Fill in the details below to deploy your new AI agent."
              : "Update your agent's details below."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
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
                    <Input {...field} placeholder="Enter agent name" />
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Langflow Configuration</FormLabel>
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 transition-all duration-200",
                  isDragActive ? "border-primary bg-primary/5" : "border-muted",
                  "hover:border-primary hover:bg-primary/5"
                )}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  {configFile ? (
                    <p className="text-sm text-muted-foreground">
                      Selected: {configFile.name}
                    </p>
                  ) : (
                    <>
                      <p className="text-sm font-medium">
                        Drop your Langflow JSON file here
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to select file
                      </p>
                    </>
                  )}
                </div>
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
