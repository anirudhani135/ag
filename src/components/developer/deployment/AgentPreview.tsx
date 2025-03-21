
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Smartphone, Desktop, Settings, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AgentPreviewProps {
  agentId?: string;
  agentName?: string;
  agentConfig?: any;
}

export const AgentPreview = ({ agentId, agentName = 'New Agent', agentConfig }: AgentPreviewProps) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState('preview');
  const { toast } = useToast();

  const handleRegenerate = () => {
    toast({
      title: "Regenerating preview",
      description: "Your agent preview is being updated...",
    });
    
    // Simulating preview regeneration
    setTimeout(() => {
      toast({
        title: "Preview updated",
        description: "Your agent preview has been updated with the latest configuration.",
      });
    }, 1500);
  };

  return (
    <Card className="border-2 w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{agentName} Preview</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('desktop')}
            className="h-8 px-2"
          >
            <Desktop className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('mobile')}
            className="h-8 px-2"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            className="h-8 px-2"
          >
            <Eye className="h-4 w-4 mr-1" /> Regenerate
          </Button>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" /> Preview
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="preview" className="p-0">
          <CardContent className={`p-4 flex justify-center ${viewMode === 'mobile' ? 'items-start' : 'items-center'}`}>
            <div 
              className={`bg-white border shadow-sm rounded-lg ${
                viewMode === 'mobile' ? 'w-[320px] h-[520px]' : 'w-full h-[400px]'
              } flex flex-col`}
            >
              <div className="p-3 border-b bg-primary/5 flex items-center justify-between">
                <span className="font-medium">{agentName}</span>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="flex-1 p-4 overflow-auto">
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[80%]">
                      <p className="text-sm">Hello! I'm {agentName}. How can I assist you today?</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 justify-end">
                    <div className="bg-primary/10 p-3 rounded-lg rounded-tr-none max-w-[80%]">
                      <p className="text-sm">Can you tell me more about what you can do?</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">You</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[80%]">
                      <p className="text-sm">I'm designed to {agentConfig?.description || 'help with various tasks'}. You can ask me questions, request information, or get assistance with specific problems related to my expertise.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-3 border-t">
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Type a message..."
                    className="w-full border rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  />
                  <Button 
                    size="sm" 
                    className="absolute right-1 top-1 h-7 w-7 rounded-full p-0"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="settings">
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="font-medium mb-2">Preview Settings</h3>
              <p className="text-sm text-muted-foreground mb-4">Customize how the preview behaves during testing.</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Response Speed</span>
                  <select className="text-sm border rounded px-2 py-1">
                    <option>Fast</option>
                    <option>Medium</option>
                    <option>Slow</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show typing indicator</span>
                  <input type="checkbox" className="h-4 w-4" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Include error responses</span>
                  <input type="checkbox" className="h-4 w-4" />
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="bg-muted/50 px-6 py-4">
        <div className="text-xs text-muted-foreground">
          This is a preview of how your agent will appear to users. The actual behavior may vary slightly in production.
        </div>
      </CardFooter>
    </Card>
  );
};
