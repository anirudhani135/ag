
import { User } from "lucide-react";
import { SidebarFooterProps } from "../types/sidebar";

export const SidebarFooter = ({ isCollapsed }: SidebarFooterProps) => {
  return (
    <div className="px-4 py-3 mt-auto border-t border-border">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
          <User className="h-4 w-4 text-accent" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">John User</p>
            <p className="text-xs text-muted-foreground truncate">john@example.com</p>
          </div>
        )}
      </div>
    </div>
  );
};
