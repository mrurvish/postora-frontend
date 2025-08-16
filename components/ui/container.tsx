import React from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  as?: 'div' | 'section' | 'main' | 'article' | 'aside';
  centered?: boolean;
  className?: string;
}

export function Container({
  children,
  size = 'lg',
  as: Component = 'div',
  centered = true,
  className,
  ...props
}: ContainerProps) {
  const sizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full'
  };

  return React.createElement(Component, {
    className: cn(
      'w-full px-4 sm:px-6 lg:px-8',
      sizes[size],
      centered && 'mx-auto',
      className
    ),
    ...props
  }, children);
}
