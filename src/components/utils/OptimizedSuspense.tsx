
import React, { Suspense, useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface OptimizedSuspenseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
  minHeight?: string;
}

export const OptimizedSuspense = ({ 
  children, 
  fallback = <Skeleton className="h-32 w-full" />,
  delay = 100,
  minHeight = "0"
}: OptimizedSuspenseProps) => {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Don't show fallback immediately to prevent flashing for fast loads
    const timer = setTimeout(() => {
      setShowFallback(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div style={{ minHeight }}>
      <Suspense fallback={showFallback ? fallback : null}>
        {children}
      </Suspense>
    </div>
  );
};
