
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const CreditBalance = () => {
  const { data: profile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('credit_balance')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          Available Credits
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-white text-black border border-gray-200 hover:bg-gray-50"
        >
          <Coins className="h-4 w-4 mr-2" />
          Add Credits
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {profile?.credit_balance || 0} credits
        </div>
        <p className="text-xs text-muted-foreground">
          Credits can be used to access premium features
        </p>
      </CardContent>
    </Card>
  );
};
