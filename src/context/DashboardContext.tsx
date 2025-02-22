
import { createContext, useContext, ReactNode } from "react";

type DashboardType = "user" | "developer";

interface DashboardContextType {
  type: DashboardType;
  theme: {
    primary: string;
    accent: string;
    cta: string;
  };
}

const dashboardThemes: Record<DashboardType, DashboardContextType["theme"]> = {
  user: {
    primary: "#1EAEDB", // Bright Blue for users
    accent: "#2ecc71", // Teal accent
    cta: "#ff8c00", // Orange for CTAs
  },
  developer: {
    primary: "#F97316", // Bright Orange for developers
    accent: "#ea384c", // Red accent
    cta: "#2ecc71", // Teal for CTAs
  },
};

const DashboardContext = createContext<DashboardContextType>({
  type: "user",
  theme: dashboardThemes.user,
});

export const DashboardProvider = ({ children, type = "user" }: { children: ReactNode; type?: DashboardType }) => {
  return (
    <DashboardContext.Provider value={{ type, theme: dashboardThemes[type] }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
