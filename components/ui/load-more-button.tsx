import React from 'react';
import { Button } from './button';

export interface LoadMoreButtonProps {
  onClick?: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
  children?: React.ReactNode;
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function LoadMoreButton({ 
  onClick, 
  isLoading = false, 
  hasMore = true,
  children = "Load More",
  variant = 'outlined',
  size = 'lg',
  className 
}: LoadMoreButtonProps) {
  if (!hasMore) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No more posts to load</p>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <Button
        onClick={onClick}
        variant={variant}
        size={size}
        isLoading={isLoading}
        disabled={isLoading}
        className={className}
      >
        {children}
      </Button>
    </div>
  );
}
