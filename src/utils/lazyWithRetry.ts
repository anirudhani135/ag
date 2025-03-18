
import { lazy } from 'react';

// Enhanced lazy loading with retry logic for better reliability
export function lazyWithRetry(componentImport: () => Promise<any>) {
  return lazy(async () => {
    const maxRetries = 3;
    let lastError: any;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await componentImport();
      } catch (err) {
        lastError = err;
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    
    throw lastError;
  });
}
