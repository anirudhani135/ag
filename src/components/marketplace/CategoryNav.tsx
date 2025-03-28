
import { Button } from "@/components/ui/button";

interface CategoryNavProps {
  categories: { id: string; name: string; icon?: string }[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategoryNav({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryNavProps) {
  return (
    <div className="space-y-1">
      <Button
        variant={selectedCategory === null ? "secondary" : "ghost"}
        className="w-full justify-start"
        onClick={() => onSelectCategory(null)}
      >
        All Categories
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onSelectCategory(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
