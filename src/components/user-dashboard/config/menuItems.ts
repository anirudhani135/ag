
import { 
  Home,
  Bot,
  CreditCard,
  BarChart2,
  MessageSquare,
  LifeBuoy,
  Settings,
  Star
} from "lucide-react";

export const userMenuItems = [
  { 
    icon: Home, 
    label: "Overview", 
    path: "/dashboard",
    ariaLabel: "Go to Dashboard Overview"
  },
  { 
    icon: Bot, 
    label: "My Agents", 
    path: "/dashboard/agents",
    ariaLabel: "View My AI Agents"
  },
  { 
    icon: CreditCard, 
    label: "Credits", 
    path: "/dashboard/credits",
    ariaLabel: "Manage Credits and Transactions"
  },
  { 
    icon: Star, 
    label: "Saved Agents", 
    path: "/dashboard/saved",
    ariaLabel: "View Saved Agents"
  },
  { 
    icon: BarChart2, 
    label: "Analytics", 
    path: "/dashboard/analytics",
    ariaLabel: "View Usage Analytics"
  },
  { 
    icon: MessageSquare, 
    label: "Reviews", 
    path: "/dashboard/reviews",
    ariaLabel: "Manage Reviews"
  },
  { 
    icon: LifeBuoy, 
    label: "Support", 
    path: "/dashboard/support",
    ariaLabel: "Access Support"
  },
  { 
    icon: Settings, 
    label: "Settings", 
    path: "/dashboard/settings",
    ariaLabel: "Manage Account Settings"
  }
];
