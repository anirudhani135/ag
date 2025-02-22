
interface DashboardHeaderProps {
  userName?: string;
  lastLoginDate?: string;
}

export const DashboardHeader = ({ userName, lastLoginDate }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">
        Welcome back, {userName || 'User'}!
      </h1>
      <p className="text-muted-foreground">
        Last login: {new Date(lastLoginDate || '').toLocaleString()}
      </p>
    </div>
  );
};
