
import { lazy } from 'react';

/**
 * Enhanced lazy loading with retry logic and performance optimization
 * Reduces initial load time and improves component rendering speed
 */
export function lazyWithRetry(componentImport: () => Promise<any>, retryConfig = {
  maxRetries: 2, // Reduced from 3 to 2 for faster fallback
  retryDelay: 500, // Reduced from 1000 to 500 for faster retry
  onError: null as ((err: Error) => void) | null,
  prefetch: false // Add prefetch option
}) {
  const { maxRetries, retryDelay, onError, prefetch } = retryConfig;
  
  // Optionally prefetch the component
  if (prefetch) {
    // Start loading the component immediately but don't block
    componentImport().catch(() => {});
  }
  
  return lazy(async () => {
    let lastError: Error | null = null;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        // Use Promise.race to implement a timeout
        const component = await Promise.race([
          componentImport(),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 3000)
          )
        ]);
        
        // Cache the component in memory for faster access
        if (component) {
          return component;
        }
      } catch (err) {
        lastError = err as Error;
        
        if (onError) onError(lastError);
        
        // Linear backoff instead of exponential for faster recovery
        const delay = retryDelay * (i + 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    console.error(`Failed to load component after ${maxRetries} retries:`, lastError);
    throw lastError;
  });
}

// Preload function to start loading components before they're needed
export function preloadComponent(componentImport: () => Promise<any>): void {
  componentImport().catch(() => {});
}
