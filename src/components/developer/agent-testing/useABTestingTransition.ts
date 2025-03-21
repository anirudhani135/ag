
import { useEffect } from 'react';

export const useABTestingTransition = (
  tabValue: string,
  callback?: (tab: string) => void
) => {
  useEffect(() => {
    // Call the callback when tab changes
    if (callback) {
      callback(tabValue);
    }
    
    // Select all charts to animate them when tab changes
    const charts = document.querySelectorAll('.recharts-wrapper');
    
    charts.forEach(chart => {
      chart.classList.add('animate-in', 'fade-in', 'duration-300');
      
      // Remove animation classes after animation completes
      setTimeout(() => {
        chart.classList.remove('animate-in', 'fade-in', 'duration-300');
      }, 500);
    });
    
  }, [tabValue, callback]);
  
  return null;
};
