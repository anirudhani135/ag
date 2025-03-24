
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

/**
 * Verifies the database schema for profiles table
 * This is a helper function to debug database schema issues
 */
export const verifyProfilesSchema = async () => {
  try {
    // Use direct query instead of RPC to get table information
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error verifying profiles schema:', error);
      return null;
    }
    
    // Get the column names from the first row
    const columnNames = data && data.length > 0 ? Object.keys(data[0]) : [];
    console.log("Profiles table columns:", columnNames);
    
    return columnNames;
  } catch (error) {
    console.error('Error in verifyProfilesSchema:', error);
    return null;
  }
};
