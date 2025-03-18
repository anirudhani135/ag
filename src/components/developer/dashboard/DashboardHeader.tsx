
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  userName?: string;
  lastLoginDate?: string;
}

export const DeveloperDashboardHeader = ({ 
  userName = "Developer", 
  lastLoginDate 
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const formattedDate = lastLoginDate 
    ? new Date(lastLoginDate).toLocaleDateString() 
    : "Recently";

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {userName}</h1>
        <p className="text-muted-foreground">
          Last login: {formattedDate}
        </p>
      </div>
      <Button 
        onClick={() => navigate('/developer/agents/create')}
        className="shrink-0"
      >
        Create New Agent
      </Button>
    </div>
  );
};
