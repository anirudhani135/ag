
import { useEffect, useCallback } from 'react';

export const useABTestingTransition = (
  tabValue: string,
  callback?: (tab: string) => void
) => {
  const animateCharts = useCallback(() => {
    // Select all charts to animate them when tab changes
    const charts = document.querySelectorAll('.recharts-wrapper');
    
    charts.forEach(chart => {
      chart.classList.add('animate-in', 'fade-in', 'duration-300');
      
      // Remove animation classes after animation completes
      setTimeout(() => {
        chart.classList.remove('animate-in', 'fade-in', 'duration-300');
      }, 500);
    });
  }, []);

  const animateContent = useCallback(() => {
    // Select tab content
    const content = document.querySelectorAll('.transition-element');
    
    content.forEach((element, index) => {
      const delay = index * 100; // stagger animations
      
      setTimeout(() => {
        element.classList.add('animate-in', 'fade-in', 'slide-in-from-bottom-4', 'duration-300');
        
        // Remove animation classes
        setTimeout(() => {
          element.classList.remove('animate-in', 'fade-in', 'slide-in-from-bottom-4', 'duration-300');
        }, 500);
      }, delay);
    });
  }, []);
  
  useEffect(() => {
    // Call the callback when tab changes
    if (callback) {
      callback(tabValue);
    }
    
    // Animate charts
    animateCharts();
    
    // Animate other content
    animateContent();
    
    // Prefetch images for better performance
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      const element = img as HTMLImageElement;
      if (element.dataset.src) {
        const newImg = new Image();
        newImg.src = element.dataset.src;
        newImg.onload = () => {
          element.src = element.dataset.src || '';
        };
      }
    });
    
  }, [tabValue, callback, animateCharts, animateContent]);
  
  return null;
};
