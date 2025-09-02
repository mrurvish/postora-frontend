"use client";
import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface AvatarImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

interface AvatarFallbackProps {
  children: React.ReactNode;
  className?: string;
}

export function Avatar({ 
  src, 
  alt, 
  fallback, 
  className,
  size = 'md'
}: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={cn(
      'relative inline-block rounded-full overflow-hidden bg-muted',
      sizeClasses[size],
      className
    )}>
      {src ? (
        <AvatarImage src={src} alt={alt} />
      ) : (
        <AvatarFallback>{fallback}</AvatarFallback>
      )}
    </div>
  );
}

export function AvatarImage({ src, alt, className }: AvatarImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn('w-full h-full object-cover', className)}
    />
  );
}

export function AvatarFallback({ children, className }: AvatarFallbackProps) {
  return (
    <div className={cn(
      'w-full h-full flex items-center justify-center bg-muted text-muted-foreground font-medium',
      className
    )}>
      {children}
    </div>
  );
}
