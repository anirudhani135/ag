
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Prefetch pages that are likely to be visited next
export const usePrefetchPages = (routes: string[]) => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Prefetch data for the specified routes
    routes.forEach(route => {
      const prefetchLink = document.createElement('link');
      prefetchLink.rel = 'prefetch';
      prefetchLink.href = route;
      prefetchLink.as = 'document';
      document.head.appendChild(prefetchLink);
    });

    return () => {
      // Clean up prefetch links when component unmounts
      document.querySelectorAll('link[rel="prefetch"]').forEach(link => {
        document.head.removeChild(link);
      });
    };
  }, [pathname, routes]);
};

// Cache images that might be needed on the next page
export const precacheImages = (imageUrls: string[]) => {
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};

export const optimizeTransitions = () => {
  // This helps with CSS transitions when navigating
  document.documentElement.classList.add('instant-transition');
  return () => {
    document.documentElement.classList.remove('instant-transition');
  };
};
