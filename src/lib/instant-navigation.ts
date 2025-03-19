
import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Prefetch pages that are likely to be visited next for instant navigation
 * Enhanced with connection and CPU awareness
 */
export const usePrefetchPages = (routes: string[]) => {
  const { pathname } = useLocation();
  const prefetchedRef = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    // Check for supported browser features
    const supportsRequestIdleCallback = 'requestIdleCallback' in window;
    const supportsConnectionInfo = 'connection' in navigator && 
      (navigator as any).connection?.saveData !== undefined;
    
    // Don't prefetch if user has save-data mode enabled
    if (supportsConnectionInfo && (navigator as any).connection?.saveData) {
      return;
    }
    
    // Only prefetch routes we haven't prefetched yet
    const routesToPrefetch = routes.filter(route => !prefetchedRef.current.has(route));
    
    if (routesToPrefetch.length === 0) return;
    
    const prefetchRoutesWithPriority = () => {
      // Create prefetch links with high priority for routes the user is likely to visit
      routesToPrefetch.forEach(route => {
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = route;
        prefetchLink.as = 'document';
        prefetchLink.setAttribute('data-prefetched', 'true');
        prefetchLink.setAttribute('fetchpriority', 'low');
        document.head.appendChild(prefetchLink);
        
        // Remember we've prefetched this route
        prefetchedRef.current.add(route);
      });
    };
    
    // Use requestIdleCallback if available, otherwise use setTimeout with a short delay
    if (supportsRequestIdleCallback) {
      (window as any).requestIdleCallback(prefetchRoutesWithPriority);
    } else {
      setTimeout(prefetchRoutesWithPriority, 100);
    }

    return () => {
      // Only clean up prefetch links we created
      document.querySelectorAll('link[data-prefetched="true"]').forEach(link => {
        document.head.removeChild(link);
      });
    };
  }, [pathname, routes]);
};

/**
 * Cache images that might be needed on the next page
 * Enhanced with priority loading and connection awareness
 */
export const precacheImages = (imageUrls: string[], priority: 'high' | 'low' = 'low') => {
  // Don't precache on slow connections or if save-data is enabled
  if (
    ('connection' in navigator && 
     (navigator as any).connection?.saveData) ||
    ('connection' in navigator && 
     ['slow-2g', '2g'].includes((navigator as any).connection?.effectiveType))
  ) {
    return;
  }

  const loadImage = (url: string) => {
    const img = new Image();
    img.fetchPriority = priority;
    img.src = url;
  };

  if ('requestIdleCallback' in window) {
    imageUrls.forEach(url => {
      (window as any).requestIdleCallback(() => loadImage(url));
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      imageUrls.forEach(loadImage);
    }, 200);
  }
};

/**
 * Optimize transitions when navigating between pages
 * Enhanced with modern browser APIs
 */
export const optimizeTransitions = () => {
  // Add a class to enable smooth transitions
  document.documentElement.classList.add('instant-transition');
  
  // Optimize paint performance during transitions
  document.documentElement.style.contentVisibility = 'auto';
  
  // Use native lazy loading for images below the fold
  document.querySelectorAll('img:not([loading])').forEach(img => {
    if (!img.hasAttribute('loading') && !isElementInViewport(img)) {
      img.setAttribute('loading', 'lazy');
    }
  });
  
  // Prepare browser for animations that will happen
  if ('startViewTransition' in document) {
    // @ts-ignore - Using new View Transitions API if available
    document.startViewTransition();
  }
  
  return () => {
    document.documentElement.classList.remove('instant-transition');
    document.documentElement.style.contentVisibility = '';
  };
};

// Helper function to check if element is in viewport
function isElementInViewport(el: Element) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
