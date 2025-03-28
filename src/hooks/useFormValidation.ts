
import { useState, useCallback } from 'react';

type ValidationRules<T> = {
  [K in keyof T]?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    min?: number;
    max?: number;
    custom?: (value: T[K], formValues: T) => boolean;
    message?: string;
  };
};

type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Validate field if it's been touched
    if (touched[field]) {
      validateField(field, value);
    }
  }, [touched]);

  // Mark field as touched when user interacts with it
  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, values[field]);
  }, [values]);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({} as Record<keyof T, boolean>);
    setIsSubmitting(false);
  }, [initialValues]);

  // Validate a specific field
  const validateField = useCallback((field: keyof T, value: any) => {
    const rules = validationRules[field];
    
    if (!rules) return true;
    
    let error = '';

    if (rules.required && (value === undefined || value === null || value === '')) {
      error = rules.message || 'This field is required';
    } else if (value !== undefined && value !== null && value !== '') {
      if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
        error = rules.message || `Minimum length is ${rules.minLength} characters`;
      } else if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
        error = rules.message || `Maximum length is ${rules.maxLength} characters`;
      } else if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
        error = rules.message || 'Value does not match the required pattern';
      } else if (rules.min !== undefined && typeof value === 'number' && value < rules.min) {
        error = rules.message || `Minimum value is ${rules.min}`;
      } else if (rules.max !== undefined && typeof value === 'number' && value > rules.max) {
        error = rules.message || `Maximum value is ${rules.max}`;
      } else if (rules.custom && !rules.custom(value, values)) {
        error = rules.message || 'Invalid value';
      }
    }

    setErrors(prev => ({
      ...prev,
      [field]: error || undefined
    }));

    return !error;
  }, [validationRules, values]);

  // Validate all form fields
  const validateForm = useCallback(() => {
    const newErrors: ValidationErrors<T> = {};
    let isValid = true;

    // Mark all fields as touched
    const newTouched = {} as Record<keyof T, boolean>;
    
    for (const field in validationRules) {
      newTouched[field as keyof T] = true;
      const fieldValid = validateField(field as keyof T, values[field as keyof T]);
      if (!fieldValid) {
        isValid = false;
      }
    }
    
    setTouched(newTouched);
    return isValid;
  }, [values, validationRules, validateField]);

  // Handle form submission
  const handleSubmit = useCallback(async (
    onSubmit: (values: T) => Promise<void> | void,
    onError?: (errors: ValidationErrors<T>) => void
  ) => {
    setIsSubmitting(true);
    
    const isValid = validateForm();
    
    if (isValid) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
        if (onError) onError(errors);
      }
    } else {
      if (onError) onError(errors);
    }
    
    setIsSubmitting(false);
  }, [values, errors, validateForm]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues
  };
}
