
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  permissions: Record<string, unknown>; // Changed to Record<string, unknown> to avoid deep type analysis
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
        
        // Explicitly cast each field to ensure type compatibility
        const members: TeamMember[] = (data || []).map(member => ({
          id: member.id,
          user_id: member.user_id,
          role: member.role || 'member',
          permissions: member.permissions || {} as Record<string, unknown>, // Cast to Record<string, unknown> to prevent deep analysis
          added_at: member.added_at || new Date().toISOString(),
          status: 'active'
        }));
        
        return members;
      } catch (error) {
        console.error("Error in team members query:", error);
        return [] as TeamMember[];
      }
    }
  });
};
