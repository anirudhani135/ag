
import { Search, ChevronRight, ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SidebarHeaderProps } from "../types/sidebar";

export const SidebarHeader = ({
  isCollapsed,
  setIsCollapsed,
  isDarkMode,
  setIsDarkMode,
  setIsSearchOpen,
  isMobile
}: SidebarHeaderProps) => {
  return (
    <div className="px-4 mb-4 flex items-center justify-between">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsSearchOpen(true)}
        className="hover:bg-accent/10"
        aria-label="Open search"
      >
        <Search className="h-4 w-4" />
      </Button>
      <Switch
        checked={isDarkMode}
        onCheckedChange={setIsDarkMode}
        aria-label="Toggle dark mode"
      />
      {!isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-accent/10"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
};
