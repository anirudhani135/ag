
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { memo } from "react";

interface DashboardHeaderProps {
  userName?: string;
  lastLoginDate?: string;
}

export const DeveloperDashboardHeader = memo(({ 
  userName = "Developer", 
  lastLoginDate 
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  
  // Memoize the date formatting
  const formattedDate = lastLoginDate 
    ? new Date(lastLoginDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : "Recently";

  const handleCreateAgent = () => {
    // Pre-initialize navigation - this causes the router to prepare the next page
    navigate('/developer/agents/create');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {userName}</h1>
        <p className="text-muted-foreground">
          Last login: {formattedDate}
        </p>
      </div>
      <Button 
        onClick={handleCreateAgent}
        className="shrink-0"
      >
        Create New Agent
      </Button>
    </div>
  );
});

DeveloperDashboardHeader.displayName = 'DeveloperDashboardHeader';
