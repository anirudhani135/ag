
import { useState, useCallback, useEffect, useRef } from 'react';

interface UseABTestingTransitionProps {
  duration?: number;
  initialActive?: boolean;
}

export const useABTestingTransition = ({
  duration = 500,
  initialActive = false
}: UseABTestingTransitionProps = {}) => {
  const [isActive, setIsActive] = useState(initialActive);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'in' | 'out'>(initialActive ? 'in' : 'out');
  const timeoutRef = useRef<number | null>(null);

  // Cleanup function to clear any existing timeouts
  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Toggle the active state with transitions
  const toggle = useCallback(() => {
    setIsAnimating(true);
    setDirection(isActive ? 'out' : 'in');
    
    clearTimeouts();
    
    timeoutRef.current = window.setTimeout(() => {
      setIsActive(!isActive);
      setIsAnimating(false);
    }, duration);
  }, [isActive, duration, clearTimeouts]);

  // Force a specific state with transitions
  const setActive = useCallback((active: boolean) => {
    if (active === isActive) return;
    
    setIsAnimating(true);
    setDirection(active ? 'in' : 'out');
    
    clearTimeouts();
    
    timeoutRef.current = window.setTimeout(() => {
      setIsActive(active);
      setIsAnimating(false);
    }, duration);
  }, [isActive, duration, clearTimeouts]);

  // Clean up any timeouts when component unmounts
  useEffect(() => {
    return clearTimeouts;
  }, [clearTimeouts]);

  return {
    isActive,
    isAnimating,
    direction,
    toggle,
    setActive,
    duration
  };
};

export default useABTestingTransition;
