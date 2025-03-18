
import { lazy } from 'react';

/**
 * Enhanced lazy loading with retry logic for better reliability
 * during network issues or temporary failures
 */
export function lazyWithRetry(componentImport: () => Promise<any>, retryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  onError: null as ((err: Error) => void) | null
}) {
  const { maxRetries, retryDelay, onError } = retryConfig;
  
  return lazy(async () => {
    let lastError: Error | null = null;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await componentImport();
      } catch (err) {
        lastError = err as Error;
        
        if (onError) onError(lastError);
        
        // Exponential backoff
        const delay = retryDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // If we've exhausted retries, log the error and rethrow
    console.error(`Failed to load component after ${maxRetries} retries:`, lastError);
    throw lastError;
  });
}
