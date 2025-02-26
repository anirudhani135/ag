
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tag, X, Plus } from "lucide-react";

interface BasicInfoFormData {
  title: string;
  description: string;
  category: string;
  price: string;
  tags: string[];
}

interface BasicInfoStepProps {
  data: BasicInfoFormData;
  onChange: (data: BasicInfoFormData) => void;
}

export const BasicInfoStep = ({ data, onChange }: BasicInfoStepProps) => {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      const updatedTags = [...data.tags, newTag.trim()];
      onChange({ ...data, tags: updatedTags });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = data.tags.filter((tag) => tag !== tagToRemove);
    onChange({ ...data, tags: updatedTags });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Label htmlFor="title" className="text-sm font-medium">
          Agent Title
        </Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="Enter a descriptive title"
          className="h-12 text-base"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="Describe your agent's functionality and capabilities"
          className="min-h-[120px] text-base resize-none"
          rows={4}
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="category" className="text-sm font-medium">
          Category
        </Label>
        <Select
          value={data.category}
          onValueChange={(value) => onChange({ ...data, category: value })}
        >
          <SelectTrigger className="h-12 text-base">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="automation">Automation</SelectItem>
            <SelectItem value="analysis">Analysis</SelectItem>
            <SelectItem value="communication">Communication</SelectItem>
            <SelectItem value="development">Development</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label htmlFor="price" className="text-sm font-medium">
          Price
        </Label>
        <Input
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={data.price}
          onChange={(e) => onChange({ ...data, price: e.target.value })}
          placeholder="Set your agent's price"
          className="h-12 text-base"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="tags" className="text-sm font-medium flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Tags
        </Label>
        <Input
          id="tags"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Add tags and press Enter"
          className="h-12 text-base"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {data.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="px-3 py-1.5 text-sm bg-primary/10 hover:bg-primary/20 transition-colors duration-200"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 hover:text-destructive focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
