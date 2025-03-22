
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Beaker, Check, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

type TestResult = {
  id: string;
  agent_name: string;
  timestamp: string;
  success_rate: number;
  total_tests: number;
  passed_tests: number;
  status: string;
};

export const TestResultsCard = () => {
  const { data: testResults, isLoading } = useQuery({
    queryKey: ['agent-test-results'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');
      
      const { data, error } = await supabase
        .from('test_suites')
        .select(`
          id,
          name,
          status,
          results,
          agents!inner(title),
          updated_at
        `)
        .eq('agents.developer_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      return data.map((item) => {
        // Safely extract results with proper type checking
        const results = typeof item.results === 'object' ? item.results : {};
        
        // Safely extract total and passed tests with fallbacks
        const totalTests = typeof results === 'object' && results !== null && 'total' in results 
          ? Number(results.total) || 0 
          : 0;
          
        const passedTests = typeof results === 'object' && results !== null && 'passed' in results 
          ? Number(results.passed) || 0 
          : 0;
        
        return {
          id: item.id,
          agent_name: item.agents?.title || 'Unnamed Agent',
          timestamp: item.updated_at,
          success_rate: totalTests > 0 ? (passedTests / totalTests) * 100 : 0,
          total_tests: totalTests,
          passed_tests: passedTests,
          status: item.status || 'ready'
        } as TestResult;
      });
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Beaker className="h-4 w-4 text-primary" />
          <span>Recent Test Results</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !testResults || testResults.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No test results found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {testResults.map((result) => (
              <div key={result.id} className="p-3 bg-muted/30 rounded-md">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-sm">{result.agent_name}</div>
                  <StatusBadge status={result.status} />
                </div>
                
                <div className="mt-2 flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/10 text-primary border-primary/30">
                      {result.passed_tests}/{result.total_tests} Tests
                    </Badge>
                    <div className="flex items-center">
                      {result.success_rate >= 80 ? (
                        <Check className="h-3 w-3 text-green-600 mr-1" />
                      ) : (
                        <X className="h-3 w-3 text-red-600 mr-1" />
                      )}
                      <span className={result.success_rate >= 80 ? 'text-green-600' : 'text-red-600'}>
                        {Math.round(result.success_rate)}% Success
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(result.timestamp), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
