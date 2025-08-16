import React from 'react';
import Link from 'next/link';

interface HeroProps {
  title: string;
  subtitle?: string;
  description: string;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction: {
    label: string;
    href: string;
  };
  showBrandInfo?: boolean;
  brandName?: string;
  brandTagline?: string;
}

export function Hero({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  showBrandInfo = false,
  brandName,
  brandTagline
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {showBrandInfo && brandName && brandTagline && (
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <span className="mr-2">✨</span>
            Welcome to {brandName} - {brandTagline}
          </div>
        )}
        {subtitle && (
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <span className="mr-2">✨</span>
            {subtitle}
          </div>
        )}
        <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href={primaryAction.href}
            className="px-8 py-4 gradient-primary text-primary-foreground rounded-xl font-semibold text-lg shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105"
          >
            {primaryAction.label}
          </Link>
          <Link 
            href={secondaryAction.href}
            className="px-8 py-4 bg-card border border-border text-foreground rounded-xl font-semibold text-lg hover:bg-accent/50 transition-all duration-300"
          >
            {secondaryAction.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
