
import { toast } from "@/hooks/use-toast";

// Error categories to classify different types of errors
export enum ErrorCategory {
  Network = 'network',
  Authentication = 'authentication',
  Authorization = 'authorization',
  Validation = 'validation',
  NotFound = 'not_found',
  ServerError = 'server_error',
  ClientError = 'client_error',
  Unknown = 'unknown'
}

// Structure for error context to provide more details
interface ErrorContext {
  operation?: string;
  resource?: string;
  details?: Record<string, any>;
  userId?: string;
}

// Configuration for how errors should be handled
interface ErrorHandlingConfig {
  showToast?: boolean;
  logToConsole?: boolean;
  reportToAnalytics?: boolean;
  fallbackUI?: React.ReactNode;
}

/**
 * Handles API errors from Supabase
 */
export const handleSupabaseError = (
  error: any, 
  context: ErrorContext = {},
  config: ErrorHandlingConfig = { showToast: true, logToConsole: true }
) => {
  let category = ErrorCategory.Unknown;
  let userMessage = "An unexpected error occurred. Please try again.";
  let errorCode = error?.code || 'unknown';
  
  // Categorize Supabase errors
  if (error?.code === 'PGRST116') {
    category = ErrorCategory.Authorization;
    userMessage = "You don't have permission to perform this action.";
  } else if (error?.code?.startsWith('22')) {
    category = ErrorCategory.Validation;
    userMessage = "There was an issue with the data you provided.";
  } else if (error?.code === '23505') {
    category = ErrorCategory.Validation;
    userMessage = "This record already exists.";
  } else if (error?.code === '23503') {
    category = ErrorCategory.Validation;
    userMessage = "This operation references data that doesn't exist.";
  } else if (error?.code === 'PGRST301') {
    category = ErrorCategory.NotFound;
    userMessage = "The requested resource was not found.";
  } else if (error?.status === 401 || error?.code === 'PGRST304') {
    category = ErrorCategory.Authentication;
    userMessage = "Your session has expired. Please log in again.";
  } else if (error?.code?.startsWith('P')) {
    category = ErrorCategory.ServerError;
    userMessage = "There was an issue with our database. Our team has been notified.";
  }
  
  // Enhanced error logging
  if (config.logToConsole) {
    console.error(
      `[${category}] Error during ${context.operation || 'operation'} on ${context.resource || 'resource'}:`, 
      error, 
      context.details
    );
  }
  
  // User feedback via toast
  if (config.showToast) {
    toast({
      title: getErrorTitle(category),
      description: userMessage,
      variant: "destructive",
    });
  }
  
  // Return structured error info for potential UI handling
  return {
    category,
    message: userMessage,
    originalError: error,
    code: errorCode,
    context
  };
};

/**
 * Handles network errors (fetch API, Axios, etc)
 */
export const handleNetworkError = (
  error: any,
  context: ErrorContext = {},
  config: ErrorHandlingConfig = { showToast: true, logToConsole: true }
) => {
  let category = ErrorCategory.Network;
  let userMessage = "Network error. Please check your connection and try again.";
  
  if (error?.message?.includes('Failed to fetch') || error?.name === 'AbortError') {
    userMessage = "Connection issue. Please check your internet connection.";
  } else if (error?.response?.status === 429) {
    userMessage = "Too many requests. Please try again later.";
  } else if (error?.response?.status >= 500) {
    category = ErrorCategory.ServerError;
    userMessage = "Our servers are experiencing issues. Please try again later.";
  } else if (error?.response?.status === 401) {
    category = ErrorCategory.Authentication;
    userMessage = "Your session has expired. Please log in again.";
  } else if (error?.response?.status === 403) {
    category = ErrorCategory.Authorization;
    userMessage = "You don't have permission to perform this action.";
  } else if (error?.response?.status === 404) {
    category = ErrorCategory.NotFound;
    userMessage = "The requested resource was not found.";
  }
  
  if (config.logToConsole) {
    console.error(`[${category}] Network error:`, error, context);
  }
  
  if (config.showToast) {
    toast({
      title: getErrorTitle(category),
      description: userMessage,
      variant: "destructive",
    });
  }
  
  return {
    category,
    message: userMessage,
    originalError: error,
    context
  };
};

/**
 * Get user-friendly error title based on category
 */
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

/**
 * Create a safe async function wrapper that catches errors
 */
export function createSafeAsync<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  errorHandler: (error: any, context: ErrorContext) => any = handleSupabaseError
) {
  return async (...args: Args): Promise<[T | null, any]> => {
    try {
      const result = await fn(...args);
      return [result, null];
    } catch (error) {
      const handledError = errorHandler(error, {
        operation: fn.name,
        details: { args }
      });
      return [null, handledError];
    }
  };
}
