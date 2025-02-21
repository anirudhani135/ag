
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
}

export const SearchOverlay = ({ isOpen, onClose, placeholder }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder || "Search..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            autoFocus
          />
        </div>
        <div className="mt-4">
          {/* Search results would go here */}
          <p className="text-sm text-muted-foreground">No results found</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
