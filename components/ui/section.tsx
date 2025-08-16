import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: 'section' | 'div' | 'main' | 'article' | 'aside';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  background?: 'default' | 'muted' | 'primary' | 'secondary' | 'accent' | 'glass' | 'gradient';
  container?: boolean;
  containerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function Section({
  className,
  children,
  as: Component = 'section',
  padding = 'lg',
  background = 'default',
  container = true,
  containerSize = 'lg',
  ...props
}: SectionProps) {
  const paddings = {
    none: '',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-20',
    '2xl': 'py-24'
  };

  const backgrounds = {
    default: 'bg-background',
    muted: 'bg-muted',
    primary: 'bg-primary/5',
    secondary: 'bg-secondary/5',
    accent: 'bg-accent/5',
    glass: 'glass',
    gradient: 'bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10'
  };

  const content = container ? (
    <div className={cn(
      'w-full px-4 sm:px-6 lg:px-8',
      containerSize === 'xs' && 'max-w-xs',
      containerSize === 'sm' && 'max-w-sm',
      containerSize === 'md' && 'max-w-md',
      containerSize === 'lg' && 'max-w-lg',
      containerSize === 'xl' && 'max-w-xl',
      containerSize === 'full' && 'max-w-full',
      'mx-auto'
    )}>
      {children}
    </div>
  ) : children;

  return React.createElement(Component, {
    className: cn(
      paddings[padding],
      backgrounds[background],
      className
    ),
    ...props
  }, content);
}
