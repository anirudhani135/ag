
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AgentFiltersProps {
  onSearch: (value: string) => void;
  onSortChange: (value: string) => void;
  onViewChange: (value: 'grid' | 'list') => void;
  view: 'grid' | 'list';
  className?: string; // Added className as optional prop
}

export const AgentFilters = ({
  onSearch,
  onSortChange,
  onViewChange,
  view,
  className = '' // Added default empty string
}: AgentFiltersProps) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search agents..."
          className="pl-10"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <Select onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="created_at">Date Created</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onViewChange(view === 'grid' ? 'list' : 'grid')}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
