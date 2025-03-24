
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches the user's role from the database
 */
export const fetchUserRole = async (userId: string): Promise<'admin' | 'developer' | 'buyer' | null> => {
  try {
    console.log("Fetching role for user ID:", userId);
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
    
    console.log("Fetched role data:", data);
    return data?.role || null;
  } catch (error) {
    console.error('Error in fetchUserRole:', error);
    return null;
  }
};

/**
 * Logs user activity in the database
 */
export const logUserActivity = async (userId: string, activityType: string) => {
  try {
    await supabase.from('user_activity').insert({
      user_id: userId,
      activity_type: activityType,
      metadata: {
        timestamp: new Date().toISOString(),
        status: 'completed'
      }
    });
  } catch (error) {
    console.error(`Error logging ${activityType} activity:`, error);
  }
};
