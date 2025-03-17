import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BasicInfoFormData } from "@/types/agent-creation";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
interface BasicInfoStepProps {
  data: BasicInfoFormData;
  onChange: (formData: BasicInfoFormData) => void;
}
const BasicInfoStep = ({
  data,
  onChange
}: BasicInfoStepProps) => {
  const [tagInput, setTagInput] = useState("");
  const {
    data: categories,
    isLoading
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      return data;
    }
  });
  const handleChange = (field: keyof BasicInfoFormData, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };
  const handleAddTag = () => {
    if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
      onChange({
        ...data,
        tags: [...data.tags, tagInput.trim()]
      });
      setTagInput("");
    }
  };
  const handleRemoveTag = (tag: string) => {
    onChange({
      ...data,
      tags: data.tags.filter(t => t !== tag)
    });
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  return <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Agent Title</Label>
            <Input id="title" placeholder="Enter a descriptive title for your agent" value={data.title} onChange={e => handleChange('title', e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe what your agent does and how it can help users" rows={4} value={data.description} onChange={e => handleChange('description', e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={data.category} onValueChange={value => handleChange('category', value)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? <SelectItem value="loading">Loading categories...</SelectItem> : categories?.map(category => <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (USD)</Label>
            <Input id="price" type="number" min="0" step="0.01" placeholder="0.00" value={data.price} onChange={e => handleChange('price', e.target.value)} />
            <p className="text-sm text-muted-foreground">Set to 0 for free agents</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Features & Tags</Label>
            <div className="flex gap-2">
              <Input id="tags" placeholder="Add features or tags" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleKeyDown} />
              <button onClick={handleAddTag} type="button" className="px-4 py-2 text-primary-foreground rounded-md bg-blue-600 hover:bg-blue-500">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.tags.map(tag => <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                </Badge>)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default BasicInfoStep;