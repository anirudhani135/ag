
import { 
  LayoutDashboard, 
  Bot,
  DollarSign,
  Settings,
  Share2,
  BarChart2,
  MessageSquare,
  LifeBuoy,
  Star
} from "lucide-react";
import { MenuItem } from "../types/sidebar";

export const userMenuItems: MenuItem[] = [
  { 
    icon: LayoutDashboard, 
    label: "Dashboard", 
    path: "/user/dashboard", 
    ariaLabel: "Go to User Dashboard Overview"
  },
  { 
    icon: Bot, 
    label: "My Agents", 
    path: "/user/agents",
    ariaLabel: "Manage Your AI Agents"
  },
  { 
    icon: DollarSign, 
    label: "Transactions & Credits", 
    path: "/user/credits",
    ariaLabel: "View Transactions and Credits"
  },
  { 
    icon: BarChart2, 
    label: "Analytics", 
    path: "/user/analytics",
    ariaLabel: "View Your Analytics"
  },
  { 
    icon: Star, 
    label: "Reviews", 
    path: "/user/reviews",
    ariaLabel: "Manage Reviews"
  },
  { 
    icon: LifeBuoy, 
    label: "Support", 
    path: "/user/support",
    ariaLabel: "Access Support"
  },
  { 
    icon: Settings, 
    label: "Settings", 
    path: "/user/settings",
    ariaLabel: "Manage Settings"
  }
];

export const developerMenuItems: MenuItem[] = [
  { 
    icon: LayoutDashboard, 
    label: "Developer Overview", 
    path: "/developer/dashboard", 
    ariaLabel: "Go to Developer Dashboard Overview"
  },
  { 
    icon: Bot, 
    label: "Agent Management", 
    path: "/developer/agents",
    ariaLabel: "Manage Your Developed Agents"
  },
  { 
    icon: DollarSign, 
    label: "Revenue Analytics", 
    path: "/developer/revenue",
    ariaLabel: "View Revenue Analytics"
  },
  { 
    icon: Share2, 
    label: "API & Integrations", 
    path: "/developer/api-integrations",
    ariaLabel: "Access API and Integration Tools"
  },
  { 
    icon: BarChart2, 
    label: "Developer Analytics", 
    path: "/developer/analytics",
    ariaLabel: "View Developer Analytics"
  },
  { 
    icon: MessageSquare, 
    label: "Developer Reviews", 
    path: "/developer/reviews",
    ariaLabel: "Manage Developer Reviews and Feedback"
  },
  { 
    icon: LifeBuoy, 
    label: "Developer Support", 
    path: "/developer/support",
    ariaLabel: "Access Developer Support"
  },
  { 
    icon: Settings, 
    label: "Developer Settings", 
    path: "/developer/settings",
    ariaLabel: "Manage Developer Settings"
  }
];
