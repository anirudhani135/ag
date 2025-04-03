
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook for optimized page transition animations
 * @param selector CSS selector for the element to animate
 * @param duration Animation duration in milliseconds
 */
export const useTransitionAnimation = (
  selector: string = '.page-transition-wrapper',
  duration: number = 300
) => {
  const location = useLocation();
  const prevPathRef = useRef<string>(location.pathname);

  useEffect(() => {
    // Skip animation on initial render
    if (prevPathRef.current === location.pathname) return;
    
    const element = document.querySelector(selector);
    if (!element) return;
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Skip animations for users who prefer reduced motion
      return;
    }
    
    // Prepare element for animation (improve performance)
    element.classList.add('will-change-transform', 'will-change-opacity');
    
    // Use requestAnimationFrame for smoother animations
    requestAnimationFrame(() => {
      // Apply enter animation
      element.classList.add('animate-fade-in');
      
      // Clean up animation classes
      const timeout = setTimeout(() => {
        element.classList.remove('animate-fade-in', 'will-change-transform', 'will-change-opacity');
      }, duration);
      
      // Update previous path reference
      prevPathRef.current = location.pathname;
      
      return () => clearTimeout(timeout);
    });
  }, [location.pathname, selector, duration]);
};
