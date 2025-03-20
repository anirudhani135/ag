
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function SecurityGuidancePanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-primary" />
          API Security Best Practices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="bg-amber-50 border-amber-100 mb-4">
          <AlertTitle className="text-amber-800 font-medium">Important</AlertTitle>
          <AlertDescription className="text-amber-700">
            Always secure your API keys and never expose them in client-side code.
          </AlertDescription>
        </Alert>

        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-700">View security guidelines</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="space-y-2">
            <div className="rounded-md bg-white p-3 text-sm">
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Use environment variables for storing API keys</li>
                <li>Implement proper authentication for all API endpoints</li>
                <li>Set up rate limiting to prevent abuse</li>
                <li>Use HTTPS for all API communications</li>
                <li>Implement proper error handling without exposing sensitive information</li>
                <li>Regularly rotate API keys and tokens</li>
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
