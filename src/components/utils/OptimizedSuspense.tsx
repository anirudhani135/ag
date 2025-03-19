
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
  delay = 30, // Reduced from 50 to 30ms for faster display
  minHeight = "0",
  priority = 'high' // Changed default to high for faster loading
}: OptimizedSuspenseProps) => {
  const [showFallback, setShowFallback] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Adjust delay based on priority - optimized for faster loading
  const actualDelay = priority === 'high' ? 0 : priority === 'medium' ? delay : delay * 1.5;

  useEffect(() => {
    mountedRef.current = true;
    
    // Only show fallback after a delay to prevent flashing for fast loads
    if (actualDelay === 0) {
      // For high priority, show immediately but still avoid layout shifts
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
