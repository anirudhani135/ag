
import React from 'react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { HelpCircle, Info } from 'lucide-react';

interface HelpTooltipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
  icon?: 'help' | 'info';
  iconSize?: number;
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function HelpTooltip({
  content,
  children,
  icon = 'help',
  iconSize = 16,
  className = '',
  side = 'top'
}: HelpTooltipProps) {
  const Icon = icon === 'help' ? HelpCircle : Info;
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {children || (
            <span className={`inline-flex items-center ml-1 cursor-help ${className}`}>
              <Icon className="text-muted-foreground" width={iconSize} height={iconSize} />
            </span>
          )}
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs p-3">
          {typeof content === 'string' ? (
            <p className="text-sm">{content}</p>
          ) : (
            content
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
