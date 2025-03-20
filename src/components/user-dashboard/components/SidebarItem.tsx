
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SidebarItemProps, SidebarItemWithTooltipProps } from "../types/sidebar";

// Regular sidebar item without tooltip
export const SidebarItem = ({
  icon: Icon,
  label,
  path,
  ariaLabel,
  isActive,
  isCollapsed,
  onClick,
  index,
  onKeyDown,
}: SidebarItemProps) => (
  <Link
    to={path}
    className={cn(
      "flex items-center gap-3 px-4 py-2 text-sm transition-all duration-200",
      "hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
      "relative rounded-r-lg mr-2",
      isActive && [
        "bg-accent/10 text-accent font-medium",
        "before:absolute before:left-0 before:top-0 before:h-full",
        "before:w-1 before:bg-accent before:rounded-r"
      ]
    )}
    onClick={onClick}
    role="menuitem"
    aria-label={ariaLabel}
    aria-current={isActive ? "page" : undefined}
    data-index={index}
    onKeyDown={(e) => onKeyDown(e, index)}
  >
    <Icon 
      className={cn(
        "w-5 h-5",
        isActive ? "text-accent" : "text-foreground/70"
      )}
      aria-hidden="true"
    />
    {!isCollapsed && <span>{label}</span>}
  </Link>
);

// Sidebar item with tooltip for collapsed state
export const SidebarItemWithTooltip = ({
  icon,
  label,
  path,
  ariaLabel,
  isActive,
  isCollapsed,
  onClick,
  index,
  onKeyDown
}: SidebarItemWithTooltipProps) => {
  if (!isCollapsed) {
    return (
      <SidebarItem
        icon={icon}
        label={label}
        path={path}
        ariaLabel={ariaLabel}
        isActive={isActive}
        isCollapsed={isCollapsed}
        onClick={onClick}
        index={index}
        onKeyDown={onKeyDown}
      />
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarItem
            icon={icon}
            label={label}
            path={path}
            ariaLabel={ariaLabel}
            isActive={isActive}
            isCollapsed={isCollapsed}
            onClick={onClick}
            index={index}
            onKeyDown={onKeyDown}
          />
        </TooltipTrigger>
        <TooltipContent side="right">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
