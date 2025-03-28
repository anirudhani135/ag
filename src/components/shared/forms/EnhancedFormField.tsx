
import React from 'react';
import { 
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Option {
  value: string;
  label: string;
}

type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date';

interface EnhancedFormFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  type?: InputType | 'textarea' | 'select' | 'checkbox';
  options?: Option[];
  required?: boolean;
  disabled?: boolean;
  tooltip?: string;
  className?: string;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: any) => void;
}

export function EnhancedFormField({
  control,
  name,
  label,
  placeholder,
  description,
  type = 'text',
  options = [],
  required = false,
  disabled = false,
  tooltip,
  className,
  rows = 3,
  min,
  max,
  step,
  onChange
}: EnhancedFormFieldProps) {
  const renderFormControl = (field: any) => {
    if (type === 'textarea') {
      return (
        <Textarea
          {...field}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={className}
        />
      );
    } else if (type === 'select') {
      return (
        <Select
          onValueChange={(value) => {
            field.onChange(value);
            if (onChange) onChange(value);
          }}
          value={field.value}
          disabled={disabled}
        >
          <SelectTrigger className={className}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    } else if (type === 'checkbox') {
      return (
        <Checkbox
          checked={field.value}
          onCheckedChange={(checked) => {
            field.onChange(checked);
            if (onChange) onChange(checked);
          }}
          disabled={disabled}
          className={className}
        />
      );
    } else {
      return (
        <Input
          {...field}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={className}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const value = type === 'number' ? parseFloat(e.target.value) : e.target.value;
            field.onChange(value);
            if (onChange) onChange(value);
          }}
        />
      );
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center space-x-2">
            <FormLabel>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
            
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          <FormControl>{renderFormControl(field)}</FormControl>
          
          {description && <FormDescription>{description}</FormDescription>}
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
