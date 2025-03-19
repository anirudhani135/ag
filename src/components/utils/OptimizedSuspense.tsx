
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
  fallback = <Skeleton className="h-32 w-full" />,
  delay = 0, // Reduced to 0 for immediate rendering
  minHeight = "0",
  priority = 'high' // Default to high priority
}: OptimizedSuspenseProps) => {
  const [showFallback, setShowFallback] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Adjust delay based on priority - optimized for faster loading
  const actualDelay = priority === 'high' ? 0 : priority === 'medium' ? 20 : 50;

  useEffect(() => {
    mountedRef.current = true;
    
    // For high priority, show immediately but still avoid layout shifts
    if (actualDelay === 0) {
      setShowFallback(true);
    } else {
      timerRef.current = setTimeout(() => {
        if (mountedRef.current) {
          setShowFallback(true);
        }
      }, actualDelay);
    }

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
        contentVisibility: 'auto', // Improve paint performance
        contain: 'content', // Improve layout calculation
      }}
      className="will-change-transform" // Hint to browser for optimization
    >
      <Suspense fallback={showFallback ? fallback : null}>
        {children}
      </Suspense>
    </div>
  );
});

OptimizedSuspense.displayName = 'OptimizedSuspense';
