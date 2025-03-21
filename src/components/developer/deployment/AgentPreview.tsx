
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Monitor, Smartphone, RefreshCw, Maximize, Minimize, Code } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AgentPreviewProps {
  agentId: string;
  versionId?: string;
}

const AgentPreview: React.FC<AgentPreviewProps> = ({ agentId, versionId }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'desktop' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle refresh with loading state and error handling
  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    
    // Simulate preview refresh
    setTimeout(() => {
      setIsLoading(false);
      
      // Success scenario
      toast({
        title: "Preview refreshed",
        description: "The agent preview has been updated."
      });
    }, 1500);
  };

  // Handle resize for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && activeView === 'desktop') {
        setActiveView('mobile');
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Check on initial load
    
    return () => window.removeEventListener('resize', handleResize);
  }, [activeView]);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Animation variants
  const previewVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={!isFullscreen ? previewVariants : {}}
      className={`transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'w-full'}`}
    >
      <Card className={`w-full overflow-hidden border border-border transition-shadow duration-300 ${isFullscreen ? 'h-full rounded-none' : 'hover:shadow-md'}`}>
        <Tabs defaultValue="desktop" className="w-full" onValueChange={(value) => setActiveView(value as 'desktop' | 'mobile')}>
          <div className="flex items-center justify-between border-b p-2">
            <TabsList>
              <TabsTrigger value="desktop" className="data-[state=active]:bg-muted">
                <Monitor className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Desktop</span>
              </TabsTrigger>
              <TabsTrigger value="mobile" className="data-[state=active]:bg-muted">
                <Smartphone className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Mobile</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCode(!showCode)}
                className="h-7 px-2 sm:px-3"
              >
                <Code className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Code</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRefresh} 
                disabled={isLoading}
                className="h-7 px-2 sm:px-3"
              >
                <RefreshCw className={`h-4 w-4 sm:mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleFullscreen}
                className="h-7 px-2 sm:px-3"
              >
                {isFullscreen ? (
                  <>
                    <Minimize className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Exit</span>
                  </>
                ) : (
                  <>
                    <Maximize className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Expand</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {showCode ? (
              <motion.div
                key="code-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-muted/20 p-4 overflow-auto"
                style={{ height: isFullscreen ? 'calc(100vh - 3.5rem)' : '400px' }}
              >
                <pre className="text-xs sm:text-sm font-mono">
                  {`// Agent Preview Configuration
{
  "agentId": "${agentId}",
  "versionId": "${versionId || 'latest'}",
  "view": "${activeView}",
  "timestamp": "${new Date().toISOString()}"
}

// Preview URL
${`/api/preview?agentId=${agentId}${versionId ? `&versionId=${versionId}` : ''}&view=${activeView}`}`}
                </pre>
              </motion.div>
            ) : (
              <>
                <TabsContent value="desktop" className="m-0">
                  <CardContent className="p-0 aspect-video bg-muted/20">
                    <div className="flex items-center justify-center h-full overflow-hidden">
                      {isLoading ? (
                        <div className="flex flex-col items-center justify-center gap-2">
                          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Loading preview...</p>
                        </div>
                      ) : error ? (
                        <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                          <p className="text-destructive font-medium">Error loading preview</p>
                          <p className="text-sm text-muted-foreground">{error}</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleRefresh}
                            className="mt-2"
                          >
                            Try Again
                          </Button>
                        </div>
                      ) : (
                        <motion.iframe 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          src={`/api/preview?agentId=${agentId}${versionId ? `&versionId=${versionId}` : ''}&view=desktop`}
                          className="w-full h-full border-0"
                          title="Agent Preview - Desktop"
                        />
                      )}
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="mobile" className="m-0">
                  <CardContent className="p-0 flex items-center justify-center min-h-[400px] bg-muted/20" style={{ height: isFullscreen ? 'calc(100vh - 3.5rem)' : 'auto' }}>
                    <motion.div 
                      className="border-8 border-gray-800 rounded-[36px] overflow-hidden h-[600px] w-[300px] shadow-xl"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-2 bg-white">
                          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Loading...</p>
                        </div>
                      ) : error ? (
                        <div className="flex flex-col items-center justify-center h-full gap-2 p-4 text-center bg-white">
                          <p className="text-destructive font-medium">Error</p>
                          <p className="text-xs text-muted-foreground">{error}</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleRefresh}
                            className="mt-2"
                          >
                            Retry
                          </Button>
                        </div>
                      ) : (
                        <iframe 
                          src={`/api/preview?agentId=${agentId}${versionId ? `&versionId=${versionId}` : ''}&view=mobile`}
                          className="w-full h-full border-0"
                          title="Agent Preview - Mobile"
                        />
                      )}
                    </motion.div>
                  </CardContent>
                </TabsContent>
              </>
            )}
          </AnimatePresence>
        </Tabs>
      </Card>
    </motion.div>
  );
};

export default AgentPreview;
