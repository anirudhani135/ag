import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Star, AlertCircle, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [error, setError] = useState<string | null>(null);
  const [showRelevanceAi, setShowRelevanceAi] = useState(false);
  
  // Convert price to credits - simple conversion for mock data
  const priceInCredits = Math.max(Math.round(agent.price / 10), 1);
  
  useEffect(() => {
    // Check if this is the Content Creator agent
    if (isOpen && agent.title === "Content Creator" && agent.id === "agent-3") {
      setShowRelevanceAi(true);
    } else {
      setShowRelevanceAi(false);
    }
  }, [isOpen, agent]);
  
  const handleHire = async () => {
    if (agent.title === "Content Creator" && agent.id === "agent-3") {
      // For Content Creator, open in a new tab
      window.open("https://app.relevanceai.com/agents/f1db6c/eab09b449107-4982-81be-c44dc78eef1d/b990b2d6-843f-47b7-9395-bf22967974ff/share?hide_tool_steps=false&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Type+your+message...&hide_logo=false", "_blank");
      toast.success("Launching Content Creator", {
        description: "Opening the Content Creator agent in a new tab."
      });
      onClose();
    } else {
      try {
        onPurchase();
        toast.success("Agent hired successfully!", {
          description: "You can now use this agent"
        });
      } catch (error) {
        console.error("Error hiring agent:", error);
        toast.error("Failed to hire agent");
      }
    }
  };
  
  const handleTryAgent = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    setIsLoading(true);
    setResponse("");
    setError(null);
    
    try {
      console.log("Contacting external agent:", agent.id);
      
      // Call the contact-external-agent edge function
      const { data, error } = await supabase.functions.invoke('contact-external-agent', {
        body: { 
          agentId: agent.id, 
          message: prompt.trim() 
        }
      });
      
      if (error) {
        console.error("Function invocation error:", error);
        throw error;
      }
      
      if (data.error) {
        console.error("Agent returned error:", data.error);
        throw new Error(data.details || "Error communicating with agent");
      }
      
      console.log("Response data:", data);
      
      // Handle different response formats
      let formattedResponse;
      
      if (typeof data === 'string') {
        formattedResponse = data;
      } else if (data.text) {
        formattedResponse = data.text;
      } else if (data.output) {
        formattedResponse = data.output;
      } else if (data.response) {
        formattedResponse = data.response;
      } else if (data.answer) {
        formattedResponse = data.answer;
      } else if (data.message) {
        formattedResponse = data.message;
      } else if (data.content) {
        formattedResponse = data.content;
      } else {
        // If we can't extract a specific text field, stringify the whole response
        formattedResponse = JSON.stringify(data, null, 2);
      }
      
      setResponse(formattedResponse);
      
    } catch (error: any) {
      console.error("Error testing agent:", error);
      
      let errorMessage = "There was an error communicating with the agent";
      
      if (error.message) {
        if (error.message.includes("Edge Function returned a non-2xx status code")) {
          errorMessage = "The external agent service returned an error. The agent might be unavailable.";
        } else {
          errorMessage = error.message;
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.details) {
        errorMessage = error.details;
      }
      
      setError(errorMessage);
      toast.error("Failed to get response", {
        description: errorMessage
      });
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
            <Badge variant={agent.status === "live" ? "default" : "secondary"}>
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
                {agent.price === 0 ? "Free" : `${priceInCredits} credits`}
              </span>
            </div>
            
            {agent.title === "Content Creator" && agent.id === "agent-3" ? (
              <Button onClick={handleHire} className="bg-purple-600 hover:bg-purple-700">
                <ExternalLink className="h-4 w-4 mr-2" />
                Launch Content Creator
              </Button>
            ) : (
              <Button onClick={handleHire}>Hire Agent</Button>
            )}
          </div>
          
          {/* Show Relevance AI iframe for Content Creator */}
          {showRelevanceAi ? (
            <div className="h-[500px] w-full border border-gray-200 rounded-md">
              <iframe 
                src="https://app.relevanceai.com/agents/f1db6c/eab09b449107-4982-81be-c44dc78eef1d/b990b2d6-843f-47b7-9395-bf22967974ff/share?hide_tool_steps=false&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Type+your+message...&hide_logo=false" 
                width="100%" 
                height="100%" 
                frameBorder="0"
                title="Content Creator AI Agent"
              />
            </div>
          ) : (
            /* Try agent for non-Content Creator agents */
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
              
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {response && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md border">
                  <h4 className="text-sm font-medium mb-2">Response:</h4>
                  <div className="whitespace-pre-wrap text-sm">{response}</div>
                </div>
              )}
            </Card>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
