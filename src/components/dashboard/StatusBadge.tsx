
import React from 'react';
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status?: string;
  className?: string;
}

export const StatusBadge = ({ status = 'success', className }: StatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case 'success':
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          text: 'Success',
          colorClasses: 'bg-green-50 text-green-700 border-green-100'
        };
      case 'warning':
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          text: 'Warning',
          colorClasses: 'bg-yellow-50 text-yellow-700 border-yellow-100'
        };
      case 'error':
      case 'failed':
        return {
          icon: <XCircle className="h-3 w-3" />,
          text: 'Failed',
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
