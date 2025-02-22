
import { Users } from "lucide-react";
import { UserProfileProps } from "../types/sidebar";

export const UserProfile = ({ isCollapsed, type }: UserProfileProps) => {
  return (
    <div className="px-4 py-4 border-t border-border">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
          <Users className="w-4 h-4 text-accent" aria-hidden="true" />
        </div>
        {!isCollapsed && (
          <div>
            <p className="text-sm font-medium">
              {type === "developer" ? "John Developer" : "John User"}
            </p>
            <p className="text-xs text-muted-foreground">john@example.com</p>
          </div>
        )}
      </div>
    </div>
  );
};
