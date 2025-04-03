
/**
 * Utility functions for optimizing images on the client side
 */

/**
 * Preloads images for faster perceived loading times
 * @param urls Array of image URLs to preload
 */
export const preloadImages = (urls: string[]) => {
  // Skip preloading if Save Data is enabled
  if (navigator.connection && (navigator as any).connection.saveData) {
    return;
  }
  
  // Use requestIdleCallback or setTimeout as fallback
  const schedulePreload = window.requestIdleCallback || setTimeout;
  
  urls.forEach(url => {
    schedulePreload(() => {
      const img = new Image();
      img.src = url;
    });
  });
};

/**
 * Adds loading="lazy" to images that are below the fold
 */
export const lazyLoadBelowFoldImages = () => {
  if (!('IntersectionObserver' in window)) return;
  
  // This will run after initial render
  setTimeout(() => {
    const images = document.querySelectorAll('img:not([loading])');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.setAttribute('loading', 'lazy');
        }
      });
    });
    
    images.forEach(img => observer.observe(img));
  }, 100);
};

/**
 * Generates correctly sized image URLs based on device capabilities
 * @param baseUrl Base image URL
 * @param width Desired image width
 */
export const responsiveImageUrl = (baseUrl: string, width: number) => {
  // Check if browser supports modern image formats
  const supportsWebp = document.createElement('canvas')
    .toDataURL('image/webp')
    .indexOf('data:image/webp') === 0;
  
  // Get device pixel ratio for high DPI screens
  const pixelRatio = window.devicePixelRatio || 1;
  
  // Add width parameter and format based on support
  const calculatedWidth = Math.round(width * pixelRatio);
  
  if (baseUrl.includes('?')) {
    return `${baseUrl}&width=${calculatedWidth}&format=${supportsWebp ? 'webp' : 'jpg'}`;
  } else {
    return `${baseUrl}?width=${calculatedWidth}&format=${supportsWebp ? 'webp' : 'jpg'}`;
  }
};

/**
 * Initializes all image optimization techniques
 */
export const initImageOptimizations = () => {
  // Apply lazy loading to images below the fold
  lazyLoadBelowFoldImages();
  
  // Add intersection observer for lazy loading
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }
};
