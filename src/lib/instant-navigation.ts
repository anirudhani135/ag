
import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Prefetch pages that are likely to be visited next for instant navigation
 */
export const usePrefetchPages = (routes: string[]) => {
  const { pathname } = useLocation();
  const prefetchedRef = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    // Only prefetch routes we haven't prefetched yet
    const routesToPrefetch = routes.filter(route => !prefetchedRef.current.has(route));
    
    if (routesToPrefetch.length === 0) return;
    
    // Create prefetch links with high priority for routes the user is likely to visit
    routesToPrefetch.forEach(route => {
      const prefetchLink = document.createElement('link');
      prefetchLink.rel = 'prefetch';
      prefetchLink.href = route;
      prefetchLink.as = 'document';
      prefetchLink.setAttribute('data-prefetched', 'true');
      document.head.appendChild(prefetchLink);
      
      // Remember we've prefetched this route
      prefetchedRef.current.add(route);
    });

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
 */
export const precacheImages = (imageUrls: string[]) => {
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};

/**
 * Optimize transitions when navigating between pages
 */
export const optimizeTransitions = () => {
  // Add a class to enable smooth transitions
  document.documentElement.classList.add('instant-transition');
  
  // Optimize paint performance during transitions
  document.documentElement.style.contentVisibility = 'auto';
  
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
