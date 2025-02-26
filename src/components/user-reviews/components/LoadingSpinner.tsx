
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner = ({ className }: LoadingSpinnerProps) => {
  return (
    <div className={cn(
      "flex h-[200px] w-full items-center justify-center",
      className
    )}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};
