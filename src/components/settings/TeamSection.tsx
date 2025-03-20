
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeamMembers, TeamMember } from "@/hooks/useTeamMembers";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const TeamSection = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [isInviting, setIsInviting] = useState(false);
  const { teamMembers, isLoading, addTeamMember, removeTeamMember } = useTeamMembers();

  const handleInvite = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setIsInviting(true);
    try {
      // Here would be the actual invite logic with addTeamMember
      addTeamMember({
        name: email.split('@')[0], // Simple name generation from email
        email: email,
        role: role,
        permissions: {
          viewAnalytics: role === "admin" || role === "editor",
          manageAgents: role === "admin" || role === "editor",
          manageTeam: role === "admin",
          manageSettings: role === "admin",
        },
      });
      
      setEmail("");
      setRole("viewer");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      // Use the removeTeamMember function from the hook
      removeTeamMember(memberId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove team member",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage people who have access to your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <div className="flex gap-2">
                <select
                  className="border rounded px-3 py-2 text-sm"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
                <Button onClick={handleInvite} disabled={isInviting || !email}>
                  {isInviting ? "Inviting..." : "Invite"}
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : teamMembers && teamMembers.length > 0 ? (
              <div className="space-y-2">
                {teamMembers.map((member: TeamMember) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {member.role}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No team members yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
