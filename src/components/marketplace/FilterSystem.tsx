
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

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

  // Apply price change after 500ms of slider stop moving
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localPriceRange[0] !== selectedPriceRange[0] || localPriceRange[1] !== selectedPriceRange[1]) {
        onPriceChange(localPriceRange);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [localPriceRange, onPriceChange, selectedPriceRange]);

  const handlePriceChange = (value: number[]) => {
    const range: [number, number] = [value[0], value[1]];
    setLocalPriceRange(range);
  };

  // Convert dollar values to credits for display
  const minCredits = Math.max(Math.round(localPriceRange[0] / 10), 0);
  const maxCredits = Math.max(Math.round(localPriceRange[1] / 10), 1);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-base mb-3">Credit Range</h3>
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
            <span className="text-sm">{minCredits} credits</span>
            <span className="text-sm">{maxCredits} credits</span>
          </div>
          {/* Apply button removed as filters now apply automatically */}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-base mb-3">Rating</h3>
        <RadioGroup 
          value={selectedRating?.toString() || ""}
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
