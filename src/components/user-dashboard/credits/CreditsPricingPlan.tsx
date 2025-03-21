
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, Star, Sparkles, Zap } from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  bonusCredits: number;
  popular: boolean;
  features: string[];
  cta: string;
}

export const CreditsPricingPlan = () => {
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  
  const pricingPlans: PricingPlan[] = [
    {
      id: "starter",
      name: "Starter",
      price: selectedBillingPeriod === "monthly" ? 19 : 190,
      credits: 500,
      bonusCredits: selectedBillingPeriod === "yearly" ? 100 : 0,
      popular: false,
      features: [
        "Access to all basic agents",
        "Standard support",
        "Basic analytics",
        "Single user access"
      ],
      cta: "Get Started"
    },
    {
      id: "pro",
      name: "Professional",
      price: selectedBillingPeriod === "monthly" ? 49 : 490,
      credits: 1500,
      bonusCredits: selectedBillingPeriod === "yearly" ? 300 : 0,
      popular: true,
      features: [
        "Access to all premium agents",
        "Priority support",
        "Advanced analytics",
        "Up to 3 team members",
        "Custom agent deployment"
      ],
      cta: "Upgrade to Pro"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: selectedBillingPeriod === "monthly" ? 99 : 990,
      credits: 3500,
      bonusCredits: selectedBillingPeriod === "yearly" ? 700 : 0,
      popular: false,
      features: [
        "Access to all premium agents",
        "24/7 dedicated support",
        "Enterprise analytics",
        "Unlimited team members",
        "Custom agent deployment",
        "White-labeling options",
        "API access"
      ],
      cta: "Contact Sales"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Pricing Plans</h3>
        
        <div className="flex items-center bg-muted/30 p-1 rounded-lg">
          <Button 
            variant={selectedBillingPeriod === "monthly" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setSelectedBillingPeriod("monthly")}
            className={selectedBillingPeriod === "monthly" ? "" : "hover:text-blue-600"}
          >
            Monthly
          </Button>
          <Button 
            variant={selectedBillingPeriod === "yearly" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setSelectedBillingPeriod("yearly")}
            className={selectedBillingPeriod === "yearly" ? "" : "hover:text-blue-600"}
          >
            Yearly
            <Badge 
              variant="outline" 
              className="ml-1.5 bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
            >
              Save 20%
            </Badge>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {pricingPlans.map((plan) => (
          <Card 
            key={plan.id}
            className={`border ${
              plan.popular 
                ? "border-blue-200 shadow-md hover:shadow-xl hover:border-blue-300" 
                : "hover:shadow-md"
            } transition-all duration-200 relative overflow-hidden`}
          >
            {plan.popular && (
              <>
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                  <div className="absolute top-0 right-0 transform translate-y-[-50%] translate-x-[50%] rotate-45 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-1 px-10 shadow-md">
                    <Star className="h-4 w-4" />
                  </div>
                </div>
                <div className="absolute top-6 right-6">
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    Popular
                  </Badge>
                </div>
              </>
            )}
            
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                {plan.id === "starter" && <Zap className="mr-2 h-5 w-5 text-amber-500" />}
                {plan.id === "pro" && <Star className="mr-2 h-5 w-5 text-blue-500" />}
                {plan.id === "enterprise" && <Sparkles className="mr-2 h-5 w-5 text-purple-500" />}
                {plan.name}
              </CardTitle>
              <div className="flex items-baseline mt-2">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground ml-1.5">/{selectedBillingPeriod === "monthly" ? "mo" : "yr"}</span>
              </div>
              <div className="mt-1.5 text-sm text-muted-foreground">
                <span className="text-blue-600 font-medium">{plan.credits} credits</span>
                {plan.bonusCredits > 0 && (
                  <span className="ml-1.5 text-green-600">
                    + {plan.bonusCredits} bonus credits
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant={plan.popular ? "primary" : "outline"} 
                className={`w-full ${
                  plan.popular 
                    ? "shadow-lg" 
                    : "border-blue-200 text-blue-600 hover:bg-blue-50"
                }`}
              >
                {plan.id === "enterprise" && <CreditCard className="mr-2 h-4 w-4" />}
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-6">
        <div className="flex items-start">
          <Sparkles className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900">Need a custom plan?</h4>
            <p className="text-sm text-blue-700 mt-1">
              Our team can create a tailored package based on your specific requirements and usage patterns.
            </p>
            <Button variant="link" className="text-blue-600 p-0 h-auto mt-2 text-sm hover:text-blue-800">
              Contact our sales team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
