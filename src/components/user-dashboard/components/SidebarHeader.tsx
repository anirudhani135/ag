
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarHeaderProps } from "../types/sidebar";

export const SidebarHeader = ({
  isCollapsed,
  setIsCollapsed,
  setIsSearchOpen,
  isMobile,
  onClose
}: SidebarHeaderProps) => {
  return (
    <div className="px-4 py-3 flex items-center justify-between border-b border-border">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsSearchOpen(true)}
        className="hover:bg-accent/10"
        aria-label="Open search"
      >
        <Search className="h-4 w-4" />
      </Button>
      
      {isMobile ? (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 md:hidden"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : (
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
