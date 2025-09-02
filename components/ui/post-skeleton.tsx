import React from 'react';

export function PostSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Category */}
            <div className="mb-4">
              <div className="w-20 h-6 bg-muted rounded-full"></div>
            </div>

            {/* Title */}
            <div className="mb-6">
              <div className="h-12 bg-muted rounded mb-2"></div>
              <div className="h-12 bg-muted rounded w-3/4"></div>
            </div>

            {/* Excerpt */}
            <div className="mb-8">
              <div className="h-6 bg-muted rounded mb-2"></div>
              <div className="h-6 bg-muted rounded w-2/3"></div>
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-muted rounded-full"></div>
              <div>
                <div className="h-4 bg-muted rounded w-24 mb-1"></div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-6">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 bg-muted rounded w-16"></div>
              <div className="h-4 bg-muted rounded w-12"></div>
            </div>

            {/* Tags */}
            <div className="flex gap-2 mt-6">
              <div className="h-6 bg-muted rounded-full w-16"></div>
              <div className="h-6 bg-muted rounded-full w-20"></div>
              <div className="h-6 bg-muted rounded-full w-14"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          <div className="mb-8">
            <div className="aspect-video bg-muted rounded-xl"></div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-4/5"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/5"></div>
          </div>

          {/* Actions */}
          <div className="border-t border-border pt-8 mt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="h-4 bg-muted rounded w-16"></div>
                <div className="h-4 bg-muted rounded w-20"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 bg-muted rounded-lg w-20"></div>
                <div className="h-10 bg-muted rounded-lg w-24"></div>
                <div className="h-10 bg-muted rounded-lg w-16"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
