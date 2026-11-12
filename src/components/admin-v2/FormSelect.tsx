import React from 'react';
import { AdminSelect } from './AdminSelect';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  helpText?: string;
}

export function FormSelect({ label, options, error, helpText, className = '', onChange, value, defaultValue, ...props }: FormSelectProps) {
  const [selectedValue, setSelectedValue] = React.useState(String(value ?? defaultValue ?? options[0]?.value ?? ''));
  React.useEffect(() => { if (value !== undefined) setSelectedValue(String(value)); }, [value]);
  return (
    <div className="admin-form-group">
      <label className="admin-label">
        {label}
        {props.required && <span style={{ color: 'var(--dream-danger)' }}> *</span>}
      </label>
      <AdminSelect
        name={props.name}
        required={props.required}
        disabled={props.disabled}
        ariaLabel={label}
        value={selectedValue}
        options={options}
        className={`admin-form-select ${className}`}
        onValueChange={(nextValue) => {
          setSelectedValue(nextValue);
          onChange?.({ target: { value: nextValue, name: props.name } } as React.ChangeEvent<HTMLSelectElement>);
        }}
      />
      {helpText && (
        <p className="text-xs mt-2" style={{ color: 'var(--dream-text-muted)' }}>
          {helpText}
        </p>
      )}
      {error && (
        <p className="text-xs mt-2" style={{ color: 'var(--dream-danger)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
