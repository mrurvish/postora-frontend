import React from 'react';
import { cn } from '@/lib/utils';

export interface DemoCredentialsProps {
  email: string;
  password: string;
  variant?: 'default' | 'minimal' | 'outlined' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  showTitle?: boolean;
  title?: string;
  className?: string;
}

export function DemoCredentials({ 
  email, 
  password, 
  variant = 'default',
  size = 'md',
  showTitle = true,
  title = "Demo Credentials",
  className 
}: DemoCredentialsProps) {
  const variants = {
    default: 'bg-muted/50 border border-border',
    minimal: 'bg-transparent border border-dashed border-border',
    outlined: 'bg-transparent border-2 border-border',
    glass: 'glass border border-border/20'
  };

  const sizes = {
    sm: 'p-3 text-sm',
    md: 'p-4 text-sm',
    lg: 'p-6 text-base'
  };

  return (
    <div className={cn(
      'rounded-xl transition-all duration-300',
      variants[variant],
      sizes[size],
      className
    )}>
      {showTitle && (
        <div className="flex items-center mb-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </span>
        </div>
      )}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Email:</span>
          <code className="text-xs bg-background px-2 py-1 rounded text-foreground font-mono">
            {email}
          </code>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Password:</span>
          <code className="text-xs bg-background px-2 py-1 rounded text-foreground font-mono">
            {password}
          </code>
        </div>
      </div>
    </div>
  );
}
