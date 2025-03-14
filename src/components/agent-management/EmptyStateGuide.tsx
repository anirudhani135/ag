
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, PlusCircle, BookOpen, PlayCircle, LightbulbIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmptyStateGuideProps {
  onCreateAgent: () => void;
}

export const EmptyStateGuide = ({ onCreateAgent }: EmptyStateGuideProps) => {
  const navigate = useNavigate();

  return (
    <Card className="w-full border-dashed border-2 bg-muted/40">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
          <Bot className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-xl">No Agents Created Yet</CardTitle>
      </CardHeader>
      <CardContent className="text-center px-6">
        <p className="text-muted-foreground mb-6">
          Get started by creating your first AI agent. Your agents will appear here once they're created.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-background">
            <CardContent className="p-4 text-left">
              <PlusCircle className="h-8 w-8 mb-2 text-primary" />
              <h3 className="text-sm font-medium">1. Create an Agent</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Define your agent's purpose, personality, and capabilities
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-background">
            <CardContent className="p-4 text-left">
              <BookOpen className="h-8 w-8 mb-2 text-primary" />
              <h3 className="text-sm font-medium">2. Train Your Agent</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Upload knowledge and configure your agent's behavior
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-background">
            <CardContent className="p-4 text-left">
              <PlayCircle className="h-8 w-8 mb-2 text-primary" />
              <h3 className="text-sm font-medium">3. Deploy & Share</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Make your agent available to users and monitor performance
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <CardFooter className="justify-center gap-3 pb-6">
        <Button 
          onClick={onCreateAgent}
          className="gap-2 px-6"
          size="lg"
        >
          <PlusCircle className="h-4 w-4" />
          Create Your First Agent
        </Button>
        <Button 
          variant="outline"
          onClick={() => window.open("https://docs.example.com/agent-creation-guide", "_blank")}
          className="gap-2"
          size="lg"
        >
          <LightbulbIcon className="h-4 w-4" />
          View Agent Guide
        </Button>
      </CardFooter>
    </Card>
  );
};
