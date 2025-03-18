
import React, { Suspense, useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface OptimizedSuspenseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
}

export const OptimizedSuspense = ({ 
  children, 
  fallback = <Skeleton className="h-32 w-full" />,
  delay = 200 
}: OptimizedSuspenseProps) => {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Only show the fallback if the loading takes longer than the delay
    const timer = setTimeout(() => {
      setShowFallback(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Suspense fallback={showFallback ? fallback : null}>
      {children}
    </Suspense>
  );
};
