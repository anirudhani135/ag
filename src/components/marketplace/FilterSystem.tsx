
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Filter, SortDesc, SortAsc } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
}

interface SortOption {
  id: string;
  label: string;
}

interface FilterSystemProps {
  options: FilterOption[];
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
  sortOptions?: SortOption[];
  selectedSort?: string;
  onSortChange?: (sortId: string) => void;
}

export const FilterSystem = ({
  options,
  selectedFilters,
  onFilterChange,
  sortOptions = [],
  selectedSort = '',
  onSortChange = () => {},
}: FilterSystemProps) => {
  const toggleFilter = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter((id) => id !== filterId)
      : [...selectedFilters, filterId];
    onFilterChange(newFilters);
  };

  return (
    <div className="flex gap-2 bg-white p-3 rounded-md shadow-sm mb-4">
      {sortOptions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-white border-gray-300">
              <SortDesc className="h-4 w-4" />
              Sort
              {selectedSort && (
                <span className="ml-1 text-xs font-medium text-gray-700">
                  {sortOptions.find(o => o.id === selectedSort)?.label || ''}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white shadow-lg border border-gray-200">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={selectedSort} onValueChange={onSortChange}>
              {sortOptions.map((option) => (
                <DropdownMenuRadioItem key={option.id} value={option.id} className="cursor-pointer">
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 bg-white border-gray-300">
            <Filter className="h-4 w-4" />
            Filters
            {selectedFilters.length > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                {selectedFilters.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white shadow-lg border border-gray-200">
          <DropdownMenuLabel>Filter By</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {options.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.id}
                checked={selectedFilters.includes(option.id)}
                onCheckedChange={() => toggleFilter(option.id)}
                className="cursor-pointer"
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
