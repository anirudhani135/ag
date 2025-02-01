import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface CategoryNavProps {
  categories: Category[];
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
  className?: string;
}

export const CategoryNav = ({
  categories,
  selectedCategory,
  onSelect,
  className,
}: CategoryNavProps) => {
  return (
    <ScrollArea className={cn("w-full whitespace-nowrap", className)}>
      <div className="flex space-x-4 p-4">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className="transition-all"
            onClick={() => onSelect(category.id)}
          >
            {category.icon && <span className="mr-2">{category.icon}</span>}
            {category.name}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};