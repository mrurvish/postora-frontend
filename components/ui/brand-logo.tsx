import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface BrandLogoProps {
  logoLetter: string;
  href?: string;
  variant?: 'default' | 'minimal' | 'outlined' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  tagline?: string;
  className?: string;
}

export function BrandLogo({ 
  logoLetter, 
  href = '/',
  variant = 'default',
  size = 'md',
  showTagline = false,
  tagline,
  className 
}: BrandLogoProps) {
  const variants = {
    default: 'bg-primary text-primary-foreground shadow-medium hover:shadow-strong',
    minimal: 'bg-transparent text-primary border-2 border-primary',
    outlined: 'bg-transparent text-foreground border-2 border-border hover:border-primary',
    gradient: 'gradient-primary text-primary-foreground shadow-medium hover:shadow-strong'
  };

  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-20 h-20 text-3xl'
  };

  const logoContent = (
    <div className={cn(
      'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 transform hover:scale-105',
      variants[variant],
      sizes[size],
      className
    )}>
      <span className="relative">
        {logoLetter}
        <span className="absolute -top-1 -right-1 text-xs animate-pulse">✨</span>
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {logoContent}
        {showTagline && tagline && (
          <div className="ml-3 text-sm text-muted-foreground">{tagline}</div>
        )}
      </Link>
    );
  }

  return (
    <div className="inline-block">
      {logoContent}
      {showTagline && tagline && (
        <div className="ml-3 text-sm text-muted-foreground">{tagline}</div>
      )}
    </div>
  );
}
