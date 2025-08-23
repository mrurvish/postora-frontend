import React from 'react';
import { Button } from '@/components/ui/button';
import { H1, H2, BodyLarge, Muted } from '@/components/ui/text';
import { BRAND_CONFIG } from '@/lib/config';

interface HeroProps {
  onGetStarted: () => void;
  onExplore: () => void;
}

export function Hero({ onGetStarted, onExplore }: HeroProps) {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-chart-5/5" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <div className="mb-8">
          <H1 className="mb-6 bg-gradient-to-r from-primary via-chart-5 to-chart-3 bg-clip-text text-transparent">
            Share Your Story with the World
          </H1>
          <H2 className="text-2xl md:text-3xl lg:text-4xl mb-8">
            Connect, Create, and Inspire on the Ultimate Social Platform
          </H2>
        </div>

        {/* Description */}
        <BodyLarge className="max-w-3xl mx-auto mb-12 text-muted-foreground">
          Join millions of creators, thinkers, and storytellers. Share your ideas, discover amazing content, 
          and build meaningful connections in a space designed for authentic expression.
        </BodyLarge>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button 
            onClick={onGetStarted}
            size="lg" 
            className="px-8 py-4 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Sharing Today
          </Button>
          <Button 
            onClick={onExplore}
            variant="outlined" 
            size="lg" 
            className="px-8 py-4 text-lg font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Explore Content
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10M+</div>
            <Muted>Active Users</Muted>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-chart-2 mb-2">50M+</div>
            <Muted>Stories Shared</Muted>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-chart-3 mb-2">100+</div>
            <Muted>Countries</Muted>
          </div>
        </div>

        {/* Brand Badge */}
        <div className="mt-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-full shadow-sm">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-chart-5 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">{BRAND_CONFIG.name.charAt(0)}</span>
            </div>
            <Muted className="font-medium">Powered by {BRAND_CONFIG.name}</Muted>
          </div>
        </div>
      </div>
    </section>
  );
}
