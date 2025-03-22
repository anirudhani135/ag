
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  RotateCw, 
  PlayCircle,
  PauseCircle
} from "lucide-react";

interface StatusBadgeProps {
  status: string;
  className?: string;
  onStatusChange?: (status: string) => void;
}

export const StatusBadge = ({ status, className, onStatusChange }: StatusBadgeProps) => {
  // Define status configurations
  const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    // Success states
    'completed': { color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle className="h-3 w-3 mr-1" />, label: 'Completed' },
    'success': { color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle className="h-3 w-3 mr-1" />, label: 'Success' },
    'healthy': { color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle className="h-3 w-3 mr-1" />, label: 'Healthy' },
    'live': { color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle className="h-3 w-3 mr-1" />, label: 'Live' },
    'active': { color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle className="h-3 w-3 mr-1" />, label: 'Active' },
    'ready': { color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle className="h-3 w-3 mr-1" />, label: 'Ready' },
    
    // Warning states
    'warning': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <AlertTriangle className="h-3 w-3 mr-1" />, label: 'Warning' },
    'pending': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock className="h-3 w-3 mr-1" />, label: 'Pending' },
    'processing': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <RotateCw className="h-3 w-3 mr-1" />, label: 'Processing' },
    
    // Error states
    'failed': { color: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="h-3 w-3 mr-1" />, label: 'Failed' },
    'error': { color: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="h-3 w-3 mr-1" />, label: 'Error' },
    'unhealthy': { color: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="h-3 w-3 mr-1" />, label: 'Unhealthy' },
    
    // Neutral states
    'paused': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <PauseCircle className="h-3 w-3 mr-1" />, label: 'Paused' },
    'draft': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <Clock className="h-3 w-3 mr-1" />, label: 'Draft' },
    'inactive': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <PauseCircle className="h-3 w-3 mr-1" />, label: 'Inactive' },
    'loading': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <RotateCw className="h-3 w-3 mr-1 animate-spin" />, label: 'Loading' },
  };
  
  // Normalize status to lowercase for matching
  const normalizedStatus = status.toLowerCase();
  
  // Get configuration or use default
  const config = statusConfig[normalizedStatus] || {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: <Clock className="h-3 w-3 mr-1" />,
    label: status
  };
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "flex items-center text-xs font-medium px-2 py-0.5",
        config.color,
        className
      )}
      onClick={() => onStatusChange && onStatusChange(status)}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
};
