
import React, { createContext, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';

type CacheContextType = {
  prefetchRoute: (route: string) => void;
};

const CacheContext = createContext<CacheContextType | undefined>(undefined);

export const useCache = () => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
};

type CacheProviderProps = {
  children: React.ReactNode;
  queryClient: QueryClient;
};

export const CacheProvider: React.FC<CacheProviderProps> = ({ 
  children, 
  queryClient 
}) => {
  const location = useLocation();

  // Define route-specific query keys for prefetching
  const routeQueryMap: Record<string, string[]> = {
    '/user/dashboard': ['user-profile', 'active-agents-count', 'unread-notifications-count'],
    '/user/credits': ['purchase-history', 'credit-balance', 'credit-usage'],
    '/developer/dashboard': ['agent-stats', 'revenue-summary', 'api-health'],
    '/developer/agents': ['agents', 'agent-stats', 'deployments'],
    '/marketplace': ['popular-agents', 'categories', 'featured-agents'],
  };

  useEffect(() => {
    // When route changes, mark related queries as stale but don't refetch immediately
    const currentPath = location.pathname;
    
    // Find parent routes (e.g., /user/credits/purchase would match /user/credits)
    Object.entries(routeQueryMap).forEach(([route, queryKeys]) => {
      if (currentPath.startsWith(route)) {
        queryKeys.forEach(key => {
          queryClient.invalidateQueries({ queryKey: [key], refetchType: 'none' });
        });
      }
    });
  }, [location.pathname, queryClient]);

  // Function to manually prefetch data for a route
  const prefetchRoute = (route: string) => {
    const queryKeys = routeQueryMap[route];
    if (queryKeys) {
      queryKeys.forEach(key => {
        queryClient.prefetchQuery({
          queryKey: [key],
          queryFn: () => Promise.resolve(null), // Will use existing fetcher
          staleTime: 30 * 1000 // 30 seconds
        });
      });
    }
  };

  return (
    <CacheContext.Provider value={{ prefetchRoute }}>
      {children}
    </CacheContext.Provider>
  );
};
