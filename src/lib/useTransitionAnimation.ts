
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useTransitionAnimation = (
  selector: string = '.page-transition-wrapper',
  duration: number = 300
) => {
  const location = useLocation();

  useEffect(() => {
    const element = document.querySelector(selector);
    if (element) {
      // Apply enter animation
      element.classList.add('animate-fade-in');
      
      // Clean up animation classes
      const timeout = setTimeout(() => {
        element.classList.remove('animate-fade-in');
      }, duration);
      
      return () => clearTimeout(timeout);
    }
  }, [location.pathname, selector, duration]);
};
