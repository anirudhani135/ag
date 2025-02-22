
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavigationMenuProps } from "../types/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const NavigationMenu = ({
  menuItems,
  isCollapsed,
  isMobile,
  onClose
}: NavigationMenuProps) => {
  const location = useLocation();

  const isActivePath = (itemPath: string) => {
    // Check if we're in developer or user section
    const isDeveloperPath = location.pathname.startsWith('/developer');
    const isItemDeveloperPath = itemPath.startsWith('/developer');

    // Only match paths within the same section (developer or user)
    if (isDeveloperPath !== isItemDeveloperPath) {
      return false;
    }

    // Check if the current path matches the menu item path
    return location.pathname.startsWith(itemPath);
  };

  return (
    <nav className="flex-1">
      <ul className="space-y-1" role="menu">
        {menuItems.map((item) => (
          <li key={item.path} role="none">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 text-sm transition-all duration-200",
                    "hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
                    "relative",
                    isActivePath(item.path) && [
                      "bg-accent/20 text-accent font-medium",
                      "before:absolute before:left-0 before:top-0 before:h-full",
                      "before:w-1 before:bg-accent before:rounded-r"
                    ]
                  )}
                  onClick={() => isMobile && onClose()}
                  role="menuitem"
                  aria-label={item.ariaLabel}
                  aria-current={isActivePath(item.path) ? "page" : undefined}
                >
                  <item.icon 
                    className={cn(
                      "w-5 h-5 transition-transform duration-200",
                      "hover:scale-110"
                    )}
                    aria-hidden="true"
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          </li>
        ))}
      </ul>
    </nav>
  );
};
