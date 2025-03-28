
import React, { useState, useEffect } from 'react';
import { AlertCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { logError } from '@/utils/activityLogger';
import { ErrorCategory } from '@/utils/errorHandling';

interface ErrorHandlerProps {
  error: Error | null;
  resetError?: () => void;
  category?: ErrorCategory;
  title?: string;
  description?: string;
  retry?: () => void;
  className?: string;
}

export function ErrorHandler({
  error,
  resetError,
  category = ErrorCategory.Unknown,
  title,
  description,
  retry,
  className
}: ErrorHandlerProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (error) {
      logError(error, { component: 'ErrorHandler', category });
    }
  }, [error, category]);

  if (!error || dismissed) return null;

  const getIcon = () => {
    switch (category) {
      case ErrorCategory.Network:
      case ErrorCategory.ServerError:
        return <XCircle className="h-6 w-6 text-red-600" />;
      case ErrorCategory.Validation:
      case ErrorCategory.ClientError:
        return <AlertTriangle className="h-6 w-6 text-amber-600" />;
      case ErrorCategory.Authentication:
      case ErrorCategory.Authorization:
        return <AlertCircle className="h-6 w-6 text-blue-600" />;
      default:
        return <Info className="h-6 w-6 text-gray-600" />;
    }
  };

  const getVariant = () => {
    switch (category) {
      case ErrorCategory.Network:
      case ErrorCategory.ServerError:
        return "destructive";
      case ErrorCategory.Validation:
      case ErrorCategory.ClientError:
        return "default";
      case ErrorCategory.Authentication:
      case ErrorCategory.Authorization:
        return "default";
      default:
        return "default";
    }
  };

  const errorTitle = title || getErrorTitle(category);
  const errorDescription = description || error.message || "An unexpected error occurred.";

  const handleDismiss = () => {
    setDismissed(true);
    if (resetError) resetError();
  };

  return (
    <Alert variant={getVariant()} className={`mb-4 ${className || ''}`}>
      <div className="flex items-start">
        {getIcon()}
        <div className="ml-3 flex-1">
          <AlertTitle className="text-lg font-semibold">{errorTitle}</AlertTitle>
          <AlertDescription className="mt-1 text-sm">
            {errorDescription}
          </AlertDescription>
          
          <div className="mt-4 flex space-x-2">
            {retry && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={retry}
              >
                Try Again
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleDismiss}
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </Alert>
  );
}

// Helper function to get a user-friendly title based on error category
function getErrorTitle(category: ErrorCategory): string {
  switch (category) {
    case ErrorCategory.Network:
      return "Connection Problem";
    case ErrorCategory.Authentication:
      return "Authentication Error";
    case ErrorCategory.Authorization:
      return "Permission Denied";
    case ErrorCategory.Validation:
      return "Validation Error";
    case ErrorCategory.NotFound:
      return "Not Found";
    case ErrorCategory.ServerError:
      return "Server Error";
    case ErrorCategory.ClientError:
      return "Application Error";
    default:
      return "Error";
  }
}
