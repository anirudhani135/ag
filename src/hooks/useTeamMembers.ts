
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TeamMemberData {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  added_at: string;
  permissions: TeamMemberPermissions;
}

// Define TeamMemberPermissions as a non-recursive simple type
export type TeamMemberPermissions = {
  [key: string]: boolean;
};

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        // Get team members from the database
        const { data, error } = await supabase
          .from('team_members')
          .select(`
            id,
            user_id,
            role,
            permissions,
            added_at
          `)
          .eq('team_id', user.id);
        
        if (error) {
          console.error("Error fetching team members:", error);
          return [];
        }
        
        if (!data || data.length === 0) return [];
        
        // Get user profiles for each team member
        const memberIds = data.map(member => member.user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, email')
          .in('id', memberIds);
        
        if (profilesError) {
          console.error("Error fetching team member profiles:", profilesError);
          return [];
        }
        
        // Map team members with their profiles
        return data.map(member => {
          const profile = profilesData?.find(p => p.id === member.user_id);
          return {
            id: member.id,
            user_id: member.user_id,
            name: profile?.name || "Unknown User",
            email: profile?.email || "unknown@example.com",
            role: member.role || "member",
            status: 'active', // Default status since it doesn't exist in the database
            added_at: member.added_at,
            permissions: member.permissions as TeamMemberPermissions || {}
          } as TeamMemberData;
        });
      } catch (error) {
        console.error("Error in team members query:", error);
        return [];
      }
    }
  });
};
