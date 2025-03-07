
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Cpu, MessageSquare, FileText, Brain, Zap, Database, BarChart, PenTool, ShoppingBag } from "lucide-react";

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

// Map of category names to corresponding icons
const categoryIcons: Record<string, React.ElementType> = {
  "All": Brain,
  "Analytics": BarChart,
  "Writing": PenTool,
  "Support": MessageSquare,
  "Development": Cpu,
  "Legal": FileText,
  "Marketing": Zap,
  "Data": Database,
  "Shopping": ShoppingBag,
};

export const CategoryNav = ({
  categories,
  selectedCategory,
  onSelect,
  className,
}: CategoryNavProps) => {
  return (
    <ScrollArea className={cn("w-full whitespace-nowrap border-b border-border pb-1", className)}>
      <div className="flex space-x-2 p-2">
        {categories.map((category) => {
          const IconComponent = categoryIcons[category.name] || Brain;
          
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "primary" : "outline"}
              className={cn(
                "transition-all min-w-[120px] px-4 py-2 shadow-sm",
                selectedCategory === category.id 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-primary hover:bg-blue-50"
              )}
              onClick={() => onSelect(category.id)}
            >
              <IconComponent className="mr-2 h-4 w-4" />
              <span className="font-medium">{category.name}</span>
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
