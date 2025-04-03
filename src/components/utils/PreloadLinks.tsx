
import { useEffect } from 'react';

/**
 * Component that preloads critical resources to improve performance
 */
const PreloadLinks = () => {
  useEffect(() => {
    // Preload critical resources
    const links = [
      { rel: 'preload', href: '/fonts/Inter-variable.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      // Add preload for critical images here
    ];

    // Create and add link elements for preloading
    links.forEach(linkData => {
      const link = document.createElement('link');
      Object.entries(linkData).forEach(([key, value]) => {
        if (value !== undefined) {
          link.setAttribute(key, value.toString());
        }
      });
      link.setAttribute('data-preload', 'true');
      document.head.appendChild(link);
    });

    // Cleanup function to remove added elements
    return () => {
      document.querySelectorAll('link[data-preload="true"]').forEach(el => {
        el.remove();
      });
    };
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default PreloadLinks;
