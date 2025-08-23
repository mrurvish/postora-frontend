import React from 'react';
import { cn } from '@/lib/utils';

interface TextProps {
  children: React.ReactNode;
  className?: string;
}

// Heading Components
export function H1({ children, className }: TextProps) {
  return (
    <h1 className={cn("text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight", className)}>
      {children}
    </h1>
  );
}

export function H2({ children, className }: TextProps) {
  return (
    <h2 className={cn("text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight", className)}>
      {children}
    </h2>
  );
}

export function H3({ children, className }: TextProps) {
  return (
    <h3 className={cn("text-2xl md:text-3xl font-bold text-foreground leading-tight", className)}>
      {children}
    </h3>
  );
}

export function H4({ children, className }: TextProps) {
  return (
    <h4 className={cn("text-xl md:text-2xl font-semibold text-foreground leading-tight", className)}>
      {children}
    </h4>
  );
}

// Body Text Components
export function BodyLarge({ children, className }: TextProps) {
  return (
    <p className={cn("text-lg md:text-xl text-foreground leading-relaxed", className)}>
      {children}
    </p>
  );
}

export function Body({ children, className }: TextProps) {
  return (
    <p className={cn("text-base text-foreground leading-relaxed", className)}>
      {children}
    </p>
  );
}

export function BodySmall({ children, className }: TextProps) {
  return (
    <p className={cn("text-sm text-foreground leading-relaxed", className)}>
      {children}
    </p>
  );
}

// Muted Text Components
export function MutedLarge({ children, className }: TextProps) {
  return (
    <p className={cn("text-lg md:text-xl text-muted-foreground leading-relaxed", className)}>
      {children}
    </p>
  );
}

export function Muted({ children, className }: TextProps) {
  return (
    <p className={cn("text-base text-muted-foreground leading-relaxed", className)}>
      {children}
    </p>
  );
}

export function MutedSmall({ children, className }: TextProps) {
  return (
    <p className={cn("text-sm text-muted-foreground leading-relaxed", className)}>
      {children}
    </p>
  );
}

// Label Components
export function Label({ children, className, htmlFor }: TextProps & { htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className={cn("text-sm font-medium text-foreground", className)}>
      {children}
    </label>
  );
}

export function LabelSmall({ children, className, htmlFor }: TextProps & { htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className={cn("text-xs font-medium text-foreground", className)}>
      {children}
    </label>
  );
}

// Caption Component
export function Caption({ children, className }: TextProps) {
  return (
    <span className={cn("text-xs text-muted-foreground", className)}>
      {children}
    </span>
  );
}
