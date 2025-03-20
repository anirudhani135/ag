
import { SidebarNavigationProps } from "../types/sidebar";
import { SidebarItemWithTooltip } from "./SidebarItem";

export const SidebarNavigation = ({
  menuItems,
  isCollapsed,
  isMobile,
  onClose,
  currentPath,
  onKeyNavigation
}: SidebarNavigationProps) => {
  return (
    <nav className="flex-1 py-2">
      <ul className="space-y-1" role="menu">
        {menuItems.map((item, index) => (
          <li key={item.path} role="none">
            <SidebarItemWithTooltip
              icon={item.icon}
              label={item.label}
              path={item.path}
              ariaLabel={item.ariaLabel}
              isActive={currentPath === item.path}
              isCollapsed={isCollapsed}
              onClick={() => isMobile && onClose()}
              index={index}
              onKeyDown={onKeyNavigation}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};
