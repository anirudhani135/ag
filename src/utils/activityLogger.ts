
import { supabase } from "@/integrations/supabase/client";
import { handleSupabaseError } from "./errorHandling";

type ActivityType = 
  | 'agent_view'
  | 'agent_purchase' 
  | 'agent_deploy'
  | 'agent_edit'
  | 'agent_delete'
  | 'review_create'
  | 'review_edit'
  | 'credit_purchase'
  | 'user_login'
  | 'user_logout'
  | 'user_register'
  | 'system_error';

interface ActivityDetails {
  [key: string]: any;
}

/**
 * Logs user activity to the database
 * 
 * @param activityType - Type of activity being logged
 * @param details - Additional details about the activity
 * @param userId - User ID (optional, will fetch from session if not provided)
 * @returns Promise resolving to success status
 */
export const logActivity = async (
  activityType: ActivityType, 
  details: ActivityDetails = {}, 
  userId?: string
): Promise<boolean> => {
  try {
    // If userId is not provided, get it from the current session
    if (!userId) {
      const { data: userData } = await supabase.auth.getUser();
      userId = userData?.user?.id;
      
      if (!userId) {
        console.warn('Activity logging failed: No user ID available');
        return false;
      }
    }

    // Add timestamp to metadata
    const metadata = {
      ...details,
      timestamp: new Date().toISOString(),
      browser: navigator.userAgent,
      path: window.location.pathname
    };

    const { error } = await supabase
      .from('user_activity')
      .insert({
        user_id: userId,
        activity_type: activityType,
        metadata
      });

    if (error) {
      handleSupabaseError(error, { 
        operation: 'logActivity', 
        resource: 'user_activity', 
        details: { activityType, userId }
      });
      console.error('Failed to log activity:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in activity logging:', error);
    return false;
  }
};

/**
 * Logs system errors to the activity log
 * 
 * @param error - The error that occurred
 * @param context - Additional context about where the error occurred
 * @returns Promise resolving to success status
 */
export const logError = async (
  error: Error | any,
  context: { component?: string; action?: string; [key: string]: any } = {}
): Promise<void> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    const errorDetails = {
      errorMessage: error.message || String(error),
      errorStack: error.stack,
      ...context
    };

    await logActivity('system_error', errorDetails, userId);
  } catch (secondaryError) {
    // Just log to console if error logging itself fails
    console.error('Failed to log error:', secondaryError);
    console.error('Original error:', error);
  }
};
