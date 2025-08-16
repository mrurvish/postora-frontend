import React from 'react';
import { Input } from './input';

export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
  className?: string;
  variant?: 'default' | 'outlined' | 'filled' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  required = false,
  className,
  variant = 'default',
  size = 'md'
}: FormFieldProps) {
  return (
    <Input
      label={label}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
      icon={icon}
      required={required}
      className={className}
      variant={variant}
      size={size}
    />
  );
}
