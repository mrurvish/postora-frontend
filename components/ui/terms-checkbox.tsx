import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface TermsCheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  variant?: 'default' | 'minimal' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  termsUrl?: string;
  privacyUrl?: string;
  className?: string;
}

export function TermsCheckbox({ 
  checked, 
  onChange, 
  error,
  variant = 'default',
  size = 'md',
  termsUrl = '/terms',
  privacyUrl = '/privacy',
  className 
}: TermsCheckboxProps) {
  const variants = {
    default: 'bg-background border border-input focus:border-ring',
    minimal: 'bg-transparent border border-border focus:border-primary',
    outlined: 'bg-transparent border-2 border-border focus:border-primary'
  };

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={cn('space-y-2', className)}>
      <label className="flex items-start space-x-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={cn(
            'rounded border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            variants[variant],
            sizes[size],
            error ? 'border-destructive' : 'border-border',
            className
          )}
          suppressHydrationWarning
        />
        <div className={cn('flex-1', textSizes[size])}>
          <span className="text-foreground">
            I agree to the{' '}
            <Link 
              href={termsUrl} 
              className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link 
              href={privacyUrl} 
              className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </Link>
          </span>
        </div>
      </label>
      {error && (
        <p className={cn('text-destructive', textSizes[size])}>
          {error}
        </p>
      )}
    </div>
  );
}
