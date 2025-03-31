import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Check, Info, ExternalLink, Download, Clock, CreditCard, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface Agent {
  id: string;
  title: string;
  description: string;
  price: number;
  rating?: number;
  categories?: {
    name: string;
  };
  features?: string[];
  developer_id?: string;
  documentation_url?: string;
  version?: string;
  created_at?: string;
  updated_at?: string;
  technical_requirements?: {
    min_memory?: string;
    recommended_cpu?: string;
    compatible_platforms?: string[];
  };
}

interface AgentDetailsModalProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (agentId: string) => void;
}

export function AgentDetailsModal({ 
  agent, 
  isOpen, 
  onClose,
  onPurchase 
}: AgentDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleHire = async () => {
    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to hire this agent",
          variant: "destructive",
        });
        return;
      }

      // Create transaction record
      const { error } = await supabase.from('transactions').insert({
        user_id: userData.user.id,
        agent_id: agent.id,
        amount: agent.price,
        status: 'pending',
        metadata: {
          type: 'hire',
          agent_name: agent.title,
          timestamp: new Date().toISOString()
        }
      });

      if (error) throw error;

      toast({
        title: "Hiring in progress",
        description: "Your request is being processed",
      });

      // Simulate successful hire after delay
      setTimeout(() => {
        setIsLoading(false);
        onPurchase(agent.id);
        toast({
          title: "Agent Hired Successfully",
          description: "You now have access to this agent",
        });
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Hire error:', error);
      setIsLoading(false);
      toast({
        title: "Hire Failed",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderRating = (rating?: number) => {
    const ratingValue = rating || 0;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= ratingValue ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
        <span className="text-sm ml-1">{ratingValue.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{agent.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                {renderRating(agent.rating)}
                {agent.categories && (
                  <Badge variant="outline" className="ml-2">
                    {agent.categories.name}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-lg font-bold">${agent.price}</div>
              <div className="text-xs text-muted-foreground">One-time payment</div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="technical">Technical Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="text-sm">{agent.description}</div>

            <Card className="p-4 mt-4">
              <h3 className="font-medium mb-2">Features</h3>
              <ul className="space-y-1">
                {(agent.features || [
                  "Natural language understanding",
                  "Context awareness",
                  "24/7 availability",
                  "Customizable responses",
                  "Multi-platform support"
                ]).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-4 bg-muted/50 border-none">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Before you hire:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground">
                    <li>This agent connects to an external API service</li>
                    <li>Technical support is provided by the developer</li>
                    <li>Refer to documentation for integration help</li>
                  </ul>
                </div>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row mt-6 gap-3">
              <Button 
                onClick={handleHire} 
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Hire Now"}
              </Button>
              {agent.documentation_url && (
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <a href={agent.documentation_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Documentation
                  </a>
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-medium flex items-center gap-2 mb-3">
                  <Download className="h-4 w-4 text-blue-500" />
                  System Requirements
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Minimum Memory:</span>
                    <span>{agent.technical_requirements?.min_memory || "512MB"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recommended CPU:</span>
                    <span>{agent.technical_requirements?.recommended_cpu || "2 cores"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compatible Platforms:</span>
                    <span>{agent.technical_requirements?.compatible_platforms?.join(", ") || "All platforms"}</span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <h3 className="font-medium flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-blue-500" />
                  Version Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Version:</span>
                    <span>{agent.version || "1.0.0"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Released:</span>
                    <span>{agent.created_at ? new Date(agent.created_at).toLocaleDateString() : "Recently"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span>{agent.updated_at ? new Date(agent.updated_at).toLocaleDateString() : "Recently"}</span>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <Card className="p-4">
                <h3 className="font-medium flex items-center gap-2 mb-3">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                  Pricing & Licensing
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span>${agent.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">License Type:</span>
                    <span>Perpetual (one-time purchase)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credit Usage:</span>
                    <span>Varies based on usage</span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <h3 className="font-medium flex items-center gap-2 mb-3">
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                  Security Information
                </h3>
                <div className="text-sm space-y-1">
                  <p>• All agents undergo security review before publication</p>
                  <p>• Data encryption for all communications</p>
                  <p>• Regular security updates and patches</p>
                  <p>• Compliant with privacy regulations</p>
                </div>
              </Card>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button onClick={handleHire} disabled={isLoading}>
                {isLoading ? "Processing..." : "Purchase Now"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="relative">
            <div className="pb-4 border-b mb-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Reviews</h3>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {renderRating(agent.rating)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { 
                  id: '1', 
                  user: { name: 'Sophie Lin', image: '' },
                  rating: 5,
                  date: '2 weeks ago',
                  comment: 'This agent has been a game-changer for our customer service team. The response quality is excellent and it handles complex queries with ease.'
                },
                { 
                  id: '2', 
                  user: { name: 'Michael Torres', image: '' },
                  rating: 4,
                  date: '1 month ago',
                  comment: 'Very good overall, but took some time to configure properly. Once set up, it works great and saves us a lot of time.'
                }
              ].map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={review.user.image} />
                        <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{review.user.name}</div>
                        <div className="text-xs text-muted-foreground">{review.date}</div>
                      </div>
                    </div>
                    <div>
                      {renderRating(review.rating)}
                    </div>
                  </div>
                  <p className="text-sm">{review.comment}</p>
                </div>
              ))}
              
              <div className="text-center py-2">
                <Button variant="ghost" size="sm" className="text-primary">
                  <Link to={`/agent/${agent.id}/reviews`}>View All Reviews</Link>
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button onClick={handleHire} disabled={isLoading}>
                {isLoading ? "Processing..." : "Purchase Now"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
