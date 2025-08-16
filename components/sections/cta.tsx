import React from 'react';
import Link from 'next/link';

interface CTAProps {
  title: string;
  description: string;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction: {
    label: string;
    href: string;
  };
}

export function CTA({ title, description, primaryAction, secondaryAction }: CTAProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
          {title}
        </h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href={primaryAction.href}
            className="inline-flex items-center px-8 py-4 rounded-xl gradient-primary text-primary-foreground font-semibold text-lg shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-105"
          >
            {primaryAction.label}
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link 
            href={secondaryAction.href}
            className="inline-flex items-center px-8 py-4 rounded-xl bg-card text-card-foreground font-semibold text-lg border border-border shadow-soft hover:shadow-medium transition-all duration-300"
          >
            {secondaryAction.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
