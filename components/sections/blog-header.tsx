import React from 'react';

interface BlogHeaderProps {
  title?: string;
  description?: string;
}

export function BlogHeader({ 
  title = "Blog", 
  description = "Discover insights, tutorials, and stories from our community of writers and developers" 
}: BlogHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-primary/10 via-background to-secondary/20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
