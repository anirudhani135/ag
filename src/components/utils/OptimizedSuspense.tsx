
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
  fallback = <Skeleton className="h-24 w-full rounded-md" />,
  delay = 0, 
  minHeight = "0",
  priority = 'high' 
}: OptimizedSuspenseProps) => {
  const [showFallback, setShowFallback] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Immediate rendering for high priority components
  const actualDelay = priority === 'high' ? 0 : priority === 'medium' ? 100 : 200;

  useEffect(() => {
    mountedRef.current = true;
    
    // Only show fallback after a delay to prevent flickering for fast-loading components
    timerRef.current = setTimeout(() => {
      if (mountedRef.current) {
        setShowFallback(true);
      }
    }, actualDelay);
    
    return () => {
      mountedRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [actualDelay]);

  return (
    <div 
      style={{ 
        minHeight,
        contentVisibility: 'auto',
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
