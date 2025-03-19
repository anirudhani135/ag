
import React, { Suspense, useState, useEffect, useRef, memo } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface OptimizedSuspenseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
  minHeight?: string;
  priority?: 'high' | 'medium' | 'low';
}

/**
 * Optimized Suspense component with intelligent loading capabilities
 * Reduces layout shifts and improves perceived performance
 */
export const OptimizedSuspense = memo(({ 
  children, 
  fallback = <Skeleton className="h-24 w-full" />, // Reduced skeleton height
  delay = 0, 
  minHeight = "0",
  priority = 'high' 
}: OptimizedSuspenseProps) => {
  const [showFallback, setShowFallback] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Immediate rendering for high priority components
  const actualDelay = 0;

  useEffect(() => {
    mountedRef.current = true;
    setShowFallback(true);
    
    return () => {
      mountedRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div 
      style={{ 
        minHeight,
        contentVisibility: 'auto',
        contain: 'content',
      }}
      className="will-change-transform"
    >
      <Suspense fallback={showFallback ? fallback : null}>
        {children}
      </Suspense>
    </div>
  );
});

OptimizedSuspense.displayName = 'OptimizedSuspense';
