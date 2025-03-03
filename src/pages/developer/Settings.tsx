
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Copy, Save, Key, User, CreditCard, Shield, 
  FileText, CheckCircle, AlertCircle, HelpCircle 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Schema for profile form validation
const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  company: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  bio: z.string().optional(),
});

// Schema for notification preferences
const notificationFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  agentUpdates: z.boolean().default(true),
  paymentNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
});

// Schema for billing information
const billingFormSchema = z.object({
  paymentMethod: z.string(),
  taxId: z.string().optional(),
  billingEmail: z.string().email({ message: "Please enter a valid email address." }),
  billingAddress: z.string().optional(),
});

const DeveloperSettings = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [apiKeys, setApiKeys] = useState([
    { id: 1, key: "sk_test_••••••••••••••••", created: "Oct 15, 2023", description: "Test API Key" },
    { id: 2, key: "sk_live_••••••••••••••••", created: "Nov 20, 2023", description: "Production API Key" }
  ]);
  
  const { toast } = useToast();

  // Initialize forms with default values
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "John Developer",
      company: "Acme Inc.",
      email: "john@example.com",
      bio: "Experienced AI developer specializing in agent creation.",
    },
  });

  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      agentUpdates: true,
      paymentNotifications: true,
      marketingEmails: false,
    },
  });

  const billingForm = useForm<z.infer<typeof billingFormSchema>>({
    resolver: zodResolver(billingFormSchema),
    defaultValues: {
      paymentMethod: "creditCard",
      taxId: "",
      billingEmail: "john@example.com",
      billingAddress: "123 Developer St, San Francisco, CA 94103",
    },
  });

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key.replace("••••••••••••••••", "sk_test_example123456789"));
    setIsCopied(true);
    toast({
      title: "API Key Copied",
      description: "API key has been copied to clipboard",
      variant: "success",
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleGenerateNewKey = () => {
    const newKey = {
      id: apiKeys.length + 1,
      key: "sk_new_••••••••••••••••",
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: "New API Key"
    };
    
    setApiKeys([...apiKeys, newKey]);
    
    toast({
      title: "New API Key Generated",
      description: "Your new API key has been generated successfully. Make sure to save it securely.",
      variant: "success",
    });
  };

  const handleRevokeKey = (id: number) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    
    toast({
      title: "API Key Revoked",
      description: "Your API key has been revoked successfully.",
      variant: "success",
    });
  };

  const onProfileSubmit = (data: z.infer<typeof profileFormSchema>) => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
      variant: "success",
    });
  };

  const onNotificationSubmit = (data: z.infer<typeof notificationFormSchema>) => {
    toast({
      title: "Notification Preferences Updated",
      description: "Your notification preferences have been updated successfully.",
      variant: "success",
    });
  };

  const onBillingSubmit = (data: z.infer<typeof billingFormSchema>) => {
    toast({
      title: "Billing Information Updated",
      description: "Your billing information has been updated successfully.",
      variant: "success",
    });
  };

  return (
    <DashboardLayout type="developer">
      <div className="min-h-screen p-6 pt-20 pb-16">
        {/* Page Header with clear hierarchy */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Developer Settings</h2>
          <p className="mt-2 text-muted-foreground">
            Manage your developer account settings, API keys, and preferences
          </p>
        </div>

        {/* Organized settings with tabs for clear structure */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6 bg-muted/50">
            <TabsTrigger value="profile" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Key className="h-4 w-4 mr-2" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <FileText className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings with form validation */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold">Profile Information</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Update your profile information to help us personalize your experience.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4 max-w-md">
                  <FormField
                    control={profileForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your full name" 
                            className="bg-background" 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company/Organization</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your company name" 
                            className="bg-background" 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Enter your email address" 
                            className="bg-background" 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Tell us about yourself" 
                            className="bg-background" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          This will be displayed on your developer profile.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 mt-4"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </Button>
                </form>
              </Form>
            </Card>
          </TabsContent>

          {/* API Keys with clear actions and feedback */}
          <TabsContent value="api" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold">API Keys</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">API keys allow your applications to authenticate with our service. Keep these secure!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="space-y-4">
                {/* API Keys Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/30">
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Key</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Created</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Description</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiKeys.map((apiKey) => (
                        <tr key={apiKey.id} className="border-t border-border">
                          <td className="px-4 py-3 text-sm font-mono">{apiKey.key}</td>
                          <td className="px-4 py-3 text-sm">{apiKey.created}</td>
                          <td className="px-4 py-3 text-sm">{apiKey.description}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleCopyApiKey(apiKey.key)}
                                className="bg-white hover:bg-muted/50 text-foreground border-border"
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                {apiKey.id === 1 && isCopied ? "Copied" : "Copy"}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="bg-white hover:bg-destructive/10 text-destructive border-destructive/20"
                                onClick={() => handleRevokeKey(apiKey.id)}
                              >
                                Revoke
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={handleGenerateNewKey}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Generate New API Key
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Keep your API keys secure. Do not share them in public repositories or client-side code.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Billing Information */}
          <TabsContent value="billing" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold">Billing Information</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Update your billing details for invoices and payments.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <Form {...billingForm}>
                <form onSubmit={billingForm.handleSubmit(onBillingSubmit)} className="space-y-4 max-w-md">
                  <FormField
                    control={billingForm.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="creditCard">Credit Card</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="bankTransfer">Bank Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={billingForm.control}
                    name="billingEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Enter billing email" 
                            className="bg-background" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          We'll send invoices to this email address.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={billingForm.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID/VAT Number (optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your Tax ID" 
                            className="bg-background" 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={billingForm.control}
                    name="billingAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter billing address" 
                            className="bg-background" 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 mt-4"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Billing Information
                  </Button>
                </form>
              </Form>
            </Card>
          </TabsContent>

          {/* Notification Preferences */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold">Notification Preferences</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Control which notifications you receive from AgentVerse.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6 max-w-md">
                  <FormField
                    control={notificationForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-medium">Email Notifications</FormLabel>
                          <FormDescription>
                            Receive updates via email
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="agentUpdates"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-medium">Agent Updates</FormLabel>
                          <FormDescription>
                            Updates about your agents
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="paymentNotifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-medium">Payment Notifications</FormLabel>
                          <FormDescription>
                            Updates about payments and billing
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="marketingEmails"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-medium">Marketing Emails</FormLabel>
                          <FormDescription>
                            Receive news, offers, and updates
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 mt-4"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Notification Preferences
                  </Button>
                </form>
              </Form>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold">Security Settings</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Secure your account with additional protection.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="space-y-6 max-w-md">
                <div className="bg-accent/10 rounded-md p-4 flex items-start">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium mb-1">Account Security Status</h4>
                    <p className="text-sm text-muted-foreground">Your account is currently using password protection.</p>
                  </div>
                </div>
                
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Button 
                      variant="outline"
                      className="bg-white hover:bg-accent/10 text-foreground"
                      onClick={() => toast({
                        title: "Coming Soon",
                        description: "Two-factor authentication will be available soon.",
                        variant: "default",
                      })}
                    >
                      Enable 2FA
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                    <Button 
                      variant="outline"
                      className="bg-white hover:bg-accent/10 text-foreground"
                      onClick={() => toast({
                        title: "Coming Soon",
                        description: "Password change functionality will be available soon.",
                        variant: "default",
                      })}
                    >
                      Change Password
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <h4 className="font-medium">Active Sessions</h4>
                      <p className="text-sm text-muted-foreground">Manage all active sessions for your account</p>
                    </div>
                    <Button 
                      variant="outline"
                      className="bg-white hover:bg-destructive/10 text-destructive border-destructive/20"
                      onClick={() => toast({
                        title: "Coming Soon",
                        description: "Session management will be available soon.",
                        variant: "default",
                      })}
                    >
                      Sign Out All Devices
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 bg-muted/20 rounded-md p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-warning mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">Security Recommendation</h4>
                      <p className="text-sm text-muted-foreground">Enable two-factor authentication for increased account security.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DeveloperSettings;
