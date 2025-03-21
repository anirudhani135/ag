
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Monitor, Smartphone, RefreshCw } from "lucide-react";

interface AgentPreviewProps {
  agentId: string;
  versionId?: string;
}

const AgentPreview: React.FC<AgentPreviewProps> = ({ agentId, versionId }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeView, setActiveView] = React.useState<'desktop' | 'mobile'>('desktop');

  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate preview refresh
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Preview refreshed",
        description: "The agent preview has been updated."
      });
    }, 1500);
  };

  return (
    <Card className="w-full overflow-hidden border border-border">
      <Tabs defaultValue="desktop" className="w-full" onValueChange={(value) => setActiveView(value as 'desktop' | 'mobile')}>
        <div className="flex items-center justify-between border-b p-2">
          <TabsList>
            <TabsTrigger value="desktop" className="data-[state=active]:bg-muted">
              <Monitor className="h-4 w-4 mr-2" />
              Desktop
            </TabsTrigger>
            <TabsTrigger value="mobile" className="data-[state=active]:bg-muted">
              <Smartphone className="h-4 w-4 mr-2" />
              Mobile
            </TabsTrigger>
          </TabsList>
          
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <TabsContent value="desktop" className="m-0">
          <CardContent className="p-0 aspect-video bg-muted/20">
            <div className="flex items-center justify-center h-full">
              <iframe 
                src={`/api/preview?agentId=${agentId}${versionId ? `&versionId=${versionId}` : ''}&view=desktop`}
                className="w-full h-full border-0"
                title="Agent Preview - Desktop"
              />
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="mobile" className="m-0">
          <CardContent className="p-0 flex items-center justify-center min-h-[400px] bg-muted/20">
            <div className="border-8 border-gray-800 rounded-[36px] overflow-hidden h-[600px] w-[300px]">
              <iframe 
                src={`/api/preview?agentId=${agentId}${versionId ? `&versionId=${versionId}` : ''}&view=mobile`}
                className="w-full h-full border-0"
                title="Agent Preview - Mobile"
              />
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AgentPreview;
