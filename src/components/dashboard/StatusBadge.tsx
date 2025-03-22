
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status?: string;
  className?: string;
  initialState?: 'loading' | 'ready' | 'error';
  onStatusChange?: (status: 'loading' | 'ready' | 'error') => void;
}

export const StatusBadge = ({ 
  status = 'success', 
  className,
  initialState,
  onStatusChange
}: StatusBadgeProps) => {
  const [currentStatus, setCurrentStatus] = useState(initialState || status);

  useEffect(() => {
    if (initialState && onStatusChange) {
      setCurrentStatus(initialState);
    }
  }, [initialState]);

  useEffect(() => {
    if (onStatusChange && currentStatus !== status && initialState) {
      onStatusChange(currentStatus as 'loading' | 'ready' | 'error');
    }
  }, [currentStatus, onStatusChange]);

  const getStatusConfig = () => {
    const statusToUse = initialState || status;
    
    switch (statusToUse.toLowerCase()) {
      case 'success':
      case 'ready':
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          text: initialState === 'ready' ? 'Ready' : 'Success',
          colorClasses: 'bg-green-50 text-green-700 border-green-100'
        };
      case 'warning':
      case 'loading':
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          text: initialState === 'loading' ? 'Loading' : 'Warning',
          colorClasses: 'bg-yellow-50 text-yellow-700 border-yellow-100'
        };
      case 'error':
      case 'failed':
        return {
          icon: <XCircle className="h-3 w-3" />,
          text: initialState === 'error' ? 'Error' : 'Failed',
          colorClasses: 'bg-red-50 text-red-700 border-red-100'
        };
      default:
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          text: 'Success',
          colorClasses: 'bg-blue-50 text-blue-700 border-blue-100'
        };
    }
  };

  const { icon, text, colorClasses } = getStatusConfig();

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs border",
        colorClasses,
        className
      )}
    >
      {icon}
      <span className="hidden sm:inline">{text}</span>
    </span>
  );
};
