
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AgentDetailsModalProps {
  agent: any;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

export const AgentDetailsModal = ({ agent, isOpen, onClose, onPurchase }: AgentDetailsModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  
  const handleHire = async () => {
    try {
      onPurchase();
      toast.success("Agent hired successfully!", {
        description: "You can now use this agent"
      });
    } catch (error) {
      console.error("Error hiring agent:", error);
      toast.error("Failed to hire agent");
    }
  };
  
  const handleTryAgent = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    setIsLoading(true);
    setResponse("");
    
    try {
      // Call the contact-external-agent edge function
      const { data, error } = await supabase.functions.invoke('contact-external-agent', {
        body: { 
          agentId: agent.id, 
          message: prompt 
        }
      });
      
      if (error) throw error;
      
      setResponse(data.output || data.response || data.answer || JSON.stringify(data));
      
    } catch (error) {
      console.error("Error testing agent:", error);
      toast.error("Failed to get response", {
        description: error.message || "There was an error communicating with the agent"
      });
      setResponse("Error: Failed to get a response from the agent. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {agent.title}
            <Badge variant={agent.status === "active" ? "default" : "secondary"}>
              {agent.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>{agent.description}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Agent info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                {agent.rating || 0} Rating
              </span>
              <span className="text-muted-foreground px-2">|</span>
              <span className="text-green-600 font-medium">
                {agent.price === 0 ? "Free" : `$${agent.price}`}
              </span>
            </div>
            
            <Button onClick={handleHire}>Hire Agent</Button>
          </div>
          
          {/* Try agent */}
          <Card className="p-4 border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Try Agent</h3>
            <Textarea 
              placeholder="Enter a prompt to test this agent..."
              className="min-h-24 mb-4"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            
            <div className="flex justify-end">
              <Button 
                onClick={handleTryAgent} 
                disabled={isLoading}
                className="flex items-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
            
            {response && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md border">
                <h4 className="text-sm font-medium mb-2">Response:</h4>
                <div className="whitespace-pre-wrap text-sm">{response}</div>
              </div>
            )}
          </Card>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
