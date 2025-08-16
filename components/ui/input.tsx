import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'filled' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Input({
  label,
  error,
  helperText,
  icon,
  variant = 'default',
  size = 'md',
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const variants = {
    default: 'bg-background border border-input focus:border-ring',
    outlined: 'bg-transparent border-2 border-border focus:border-primary',
    filled: 'bg-muted border border-transparent focus:border-ring',
    ghost: 'bg-transparent border-none focus:ring-2 focus:ring-ring'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const inputClasses = cn(
    'flex w-full rounded-xl transition-all duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant],
    sizes[size],
    error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            inputClasses,
            icon && 'pl-10'
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
