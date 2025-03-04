
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Download, ExternalLink, MessageSquare, Code, Settings, Check, Award, ArrowRight } from "lucide-react";

interface AgentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  features?: string[];
  onPurchase: () => void;
  onTryDemo: () => void;
}

export const AgentDetailsModal = ({
  open,
  onOpenChange,
  title,
  description,
  price,
  category,
  rating,
  features = [],
  onPurchase,
  onTryDemo
}: AgentDetailsModalProps) => {
  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <Badge variant="secondary" className="mb-2">
                {category}
              </Badge>
              <DialogTitle className="text-xl">{title}</DialogTitle>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">
                {price === 0 ? "Free" : `$${price.toFixed(2)}`}
              </div>
              {renderRatingStars(rating)}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="overview" className="space-y-4 min-h-[300px]">
              <DialogDescription className="text-base">
                {description}
              </DialogDescription>
              
              <div>
                <h4 className="font-medium mb-2">Quick Facts</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span className="text-sm">Natural language processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    <span className="text-sm">API integration ready</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <span className="text-sm">Customizable responses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm">Premium support</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Use Cases</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Automated customer support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Data analysis and visualization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Process automation</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4 min-h-[300px]">
              <h3 className="text-base font-medium">Key Features</h3>
              <div className="space-y-2">
                {features.length > 0 ? (
                  features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Natural language processing capabilities</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>24/7 availability and instant responses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Seamless integration with existing systems</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Customizable responses and behavior</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>Data analytics and reporting</span>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4 min-h-[300px]">
              <h3 className="text-base font-medium">Technical Requirements</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium">System Requirements</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                    <li>Supported browsers: Chrome, Firefox, Safari, Edge</li>
                    <li>Internet connection required</li>
                    <li>API integration for advanced features</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium">Integration APIs</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                    <li>RESTful API access</li>
                    <li>Webhook support for events</li>
                    <li>OAuth 2.0 authentication</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4 min-h-[300px]">
              <h3 className="text-base font-medium">User Reviews</h3>
              <div className="space-y-4">
                <div className="p-3 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">Sarah J.</div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm">
                    This agent has been incredibly helpful for our customer support team. 
                    It handles routine inquiries perfectly, allowing our team to focus on more complex issues.
                  </p>
                </div>

                <div className="p-3 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">Michael T.</div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm">
                    Great functionality and easy to set up. The only reason I'm not giving 5 stars is that 
                    I'd like to see more customization options in future updates.
                  </p>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex gap-2 mt-4">
          <Button
            onClick={onPurchase}
            className="flex-1"
          >
            {price === 0 ? "Add to My Agents" : "Purchase"}
          </Button>
          <Button
            variant="outline"
            onClick={onTryDemo}
            className="flex-1"
          >
            Try Demo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
