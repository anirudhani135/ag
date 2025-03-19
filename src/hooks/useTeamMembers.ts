
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define a non-recursive type for permissions with a clear structure
export type TeamMemberPermissions = Record<string, boolean>;

export interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  permissions: TeamMemberPermissions; // Explicitly use the non-recursive type
  added_at: string;
  status: string;
}

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const authResult = await supabase.auth.getUser();
      const user = authResult.data.user;
      
      if (!user) return [] as TeamMember[];

      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching team members:", error);
        return [] as TeamMember[];
      }
      
      // Process the data with explicit type casting to avoid recursion
      const members = (data || []).map(member => {
        // Create a safe copy of permissions to avoid reference issues
        const safePermissions: TeamMemberPermissions = {};
        
        // Only copy boolean values to ensure type safety
        if (member.permissions && typeof member.permissions === 'object') {
          Object.entries(member.permissions).forEach(([key, value]) => {
            if (typeof value === 'boolean') {
              safePermissions[key] = value;
            }
          });
        }
        
        return {
          id: member.id,
          user_id: member.user_id,
          role: member.role || 'member',
          permissions: safePermissions,
          added_at: member.added_at || new Date().toISOString(),
          status: 'active'
        } as TeamMember;
      });
      
      return members;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000,   // Garbage collect after 10 minutes
    refetchOnWindowFocus: false // Don't refetch when window gains focus
  });
};
