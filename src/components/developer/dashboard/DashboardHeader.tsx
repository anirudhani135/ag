
import { memo } from "react";

interface DashboardHeaderProps {
  userName?: string;
  lastLoginDate?: string;
}

export const DeveloperDashboardHeader = memo(({ 
  userName = "Developer", 
  lastLoginDate 
}: DashboardHeaderProps) => {
  // Memoize the date formatting
  const formattedDate = lastLoginDate 
    ? new Date(lastLoginDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : "Recently";

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Welcome, {userName}</h1>
      <p className="text-muted-foreground">
        Last login: {formattedDate}
      </p>
    </div>
  );
});

DeveloperDashboardHeader.displayName = 'DeveloperDashboardHeader';
