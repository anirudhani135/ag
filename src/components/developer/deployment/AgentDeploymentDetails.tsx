
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface AgentDeploymentDetailsProps {
  agent: any;
  className?: string;
}

export const AgentDeploymentDetails = ({ agent, className }: AgentDeploymentDetailsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      resources: agent.deployments?.[0]?.resource_usage || {
        cpu: "0.5",
        memory: "512Mi",
        timeout: 30
      },
      scaling: {
        minReplicas: 1,
        maxReplicas: 3
      }
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const { data: deployment, error } = await supabase.functions.invoke('deploy-agent', {
        body: {
          agentId: agent.id,
          versionId: agent.current_version_id,
          config: {
            environment: "production",
            resources: data.resources,
            scaling: data.scaling
          }
        }
      });

      if (error) throw error;

    } catch (error) {
      console.error('Deployment failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={cn("p-6", className)}>
      <h4 className="text-sm font-medium mb-4">Deployment Configuration</h4>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="resources.cpu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPU Units</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0.5" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resources.memory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Memory</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="512Mi" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scaling.minReplicas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Replicas</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      min={1} 
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scaling.maxReplicas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Replicas</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      min={1}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Configuration
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};
