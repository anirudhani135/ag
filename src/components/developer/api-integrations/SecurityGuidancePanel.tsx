
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, Lock, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const SecurityGuidancePanel = () => {
  const [open, setOpen] = useState(false);

  return (
    <Card className="bg-muted/30 border-muted mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-base">API Security Best Practices</CardTitle>
          </div>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setOpen(!open)}
              className="h-8"
            >
              {open ? "Hide Details" : "Show Details"}
            </Button>
          </CollapsibleTrigger>
        </div>
      </CardHeader>
      
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <Alert className="bg-background mb-3">
              <Lock className="h-4 w-4" />
              <AlertTitle>Protect Your API Keys</AlertTitle>
              <AlertDescription>
                Never expose API keys in client-side code or public repositories. Use backend services 
                to make authenticated API calls.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Do's
                </h4>
                <ul className="text-sm space-y-2">
                  <li className="flex gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Store keys in environment variables</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Implement rate limiting on your endpoints</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Rotate API keys regularly</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Use separate keys for different environments</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <ShieldAlert className="h-4 w-4 text-red-500" />
                  Don'ts
                </h4>
                <ul className="text-sm space-y-2">
                  <li className="flex gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Embed API keys in mobile or frontend code</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Commit API keys to version control</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Share API keys via insecure channels</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">✗</span>
                    <span>Grant unnecessary permissions to API keys</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <div className="text-sm">
                Need more guidance? Check our 
                <Button variant="link" className="h-auto p-0 px-1">
                  <span>security documentation</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
              
              <Button variant="outline" size="sm" className="gap-1">
                <Copy className="h-3 w-3" />
                <span>Copy Example Implementation</span>
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
