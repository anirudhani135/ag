
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  permissions: Record<string, any>; // Changed to Record<string, any> to avoid deep type analysis
  added_at: string;
  status: string;
}

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      try {
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
        
        // Properly convert and handle the data with explicit typing
        const members: TeamMember[] = (data || []).map(member => {
          // Use any to avoid deep type analysis
          let safePermissions: Record<string, any> = {};
          
          if (member.permissions && typeof member.permissions === 'object' && !Array.isArray(member.permissions)) {
            safePermissions = member.permissions as Record<string, any>;
          }
          
          return {
            id: member.id,
            user_id: member.user_id,
            role: member.role || 'member',
            permissions: safePermissions,
            added_at: member.added_at || new Date().toISOString(),
            status: 'active'
          };
        });
        
        return members;
      } catch (error) {
        console.error("Error in team members query:", error);
        return [] as TeamMember[];
      }
    }
  });
};
