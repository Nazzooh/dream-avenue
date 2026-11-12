import * as React from 'react';
import { Check } from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../ui/select';

export interface AdminSelectOption { value: string; label: string; disabled?: boolean; }

interface AdminSelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: AdminSelectOption[];
  placeholder?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

/** Branded, keyboard-safe select that still submits through ordinary FormData. */
export function AdminSelect({
  value, defaultValue, onValueChange, options, placeholder = 'Choose an option', name, required, disabled, ariaLabel, className = '',
}: AdminSelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');
  const selectedValue = value ?? internalValue;
  const selectId = React.useId();
  const change = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <>
      {name && <input type="hidden" name={name} value={selectedValue} required={required} />}
      <Select value={selectedValue || undefined} onValueChange={change} disabled={disabled}>
        <SelectTrigger id={selectId} aria-label={ariaLabel} className={`da-select-trigger ${className}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="da-select-content" position="popper">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled} className="da-select-item">
              {option.label}<Check className="da-select-check" aria-hidden="true" />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
