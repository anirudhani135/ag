
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

// Define a simple type for permissions to avoid infinite recursion
type TeamMemberPermissions = Record<string, boolean>;

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: TeamMemberPermissions;
  joinedAt: string;
  lastActive: string;
  avatarUrl?: string;
};

export const useTeamMembers = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      permissions: {
        viewAnalytics: true,
        manageAgents: true,
        manageTeam: true,
        manageSettings: true,
      },
      joinedAt: "2023-01-15T10:30:00Z",
      lastActive: "2023-05-20T14:45:00Z",
      avatarUrl: "/avatars/user1.png",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Developer",
      permissions: {
        viewAnalytics: true,
        manageAgents: true,
        manageTeam: false,
        manageSettings: false,
      },
      joinedAt: "2023-02-10T09:15:00Z",
      lastActive: "2023-05-19T16:30:00Z",
      avatarUrl: "/avatars/user2.png",
    },
  ]);

  const addTeamMember = (member: Omit<TeamMember, "id" | "joinedAt" | "lastActive">) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newMember: TeamMember = {
        ...member,
        id: Math.random().toString(36).substring(2, 9),
        joinedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };

      setTeamMembers([...teamMembers, newMember]);
      setIsLoading(false);

      toast({
        title: "Team member added",
        description: `${member.name} has been added to the team.`,
      });
    }, 1000);
  };

  const removeTeamMember = (id: string) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setTeamMembers(teamMembers.filter(member => member.id !== id));
      setIsLoading(false);

      toast({
        title: "Team member removed",
        description: "The team member has been removed.",
      });
    }, 1000);
  };

  const updateTeamMember = (id: string, updates: Partial<Omit<TeamMember, "id" | "joinedAt">>) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setTeamMembers(
        teamMembers.map(member =>
          member.id === id
            ? { ...member, ...updates, lastActive: new Date().toISOString() }
            : member
        )
      );
      setIsLoading(false);

      toast({
        title: "Team member updated",
        description: "The team member has been updated.",
      });
    }, 1000);
  };

  return {
    teamMembers,
    isLoading,
    addTeamMember,
    removeTeamMember,
    updateTeamMember,
  };
};
