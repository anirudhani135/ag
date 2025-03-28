
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FilterSystemProps {
  minPrice?: number;
  maxPrice?: number;
  selectedPriceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  selectedRating: number | null;
  onRatingChange: (rating: number | null) => void;
}

export function FilterSystem({
  minPrice = 0,
  maxPrice = 1000,
  selectedPriceRange = [0, 1000],
  onPriceChange,
  selectedRating,
  onRatingChange
}: FilterSystemProps) {
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(selectedPriceRange);

  const handlePriceChange = (value: number[]) => {
    const range: [number, number] = [value[0], value[1]];
    setLocalPriceRange(range);
  };

  const handleApplyPrice = () => {
    onPriceChange(localPriceRange);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-sm mb-3">Price Range</h3>
        <div className="space-y-4">
          <Slider
            defaultValue={selectedPriceRange}
            min={minPrice}
            max={maxPrice}
            step={10}
            onValueChange={handlePriceChange}
            className="mb-6"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm">${localPriceRange[0]}</span>
            <span className="text-sm">${localPriceRange[1]}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleApplyPrice}
          >
            Apply
          </Button>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-sm mb-3">Rating</h3>
        <RadioGroup 
          defaultValue={selectedRating?.toString() || ""}
          onValueChange={(value) => onRatingChange(value ? parseInt(value) : null)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="rating-any" />
            <Label htmlFor="rating-any">Any rating</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4" id="rating-4" />
            <Label htmlFor="rating-4">4+ stars</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id="rating-3" />
            <Label htmlFor="rating-3">3+ stars</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2" id="rating-2" />
            <Label htmlFor="rating-2">2+ stars</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => {
            setLocalPriceRange([minPrice, maxPrice]);
            onPriceChange([minPrice, maxPrice]);
            onRatingChange(null);
          }}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
