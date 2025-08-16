import React from 'react';
import { cn } from '@/lib/utils';

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  readTime: number;
  category: string;
  tags: string[];
}

export interface PostCardProps {
  post: Post;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  showActions?: boolean;
  onEdit?: () => void;
  onPublish?: () => void;
  className?: string;
}

export function PostCard({ 
  post, 
  variant = 'default',
  size = 'md',
  showActions = false, 
  onEdit, 
  onPublish,
  className 
}: PostCardProps) {
  const variants = {
    default: 'bg-card border border-border',
    elevated: 'bg-card shadow-medium border border-border',
    outlined: 'bg-transparent border-2 border-border',
    glass: 'glass border border-border/20'
  };

  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    published: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  };

  return (
    <div className={cn(
      'rounded-2xl transition-all duration-300 hover:shadow-medium',
      variants[variant],
      sizes[size],
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3">
            {post.excerpt}
          </p>
        </div>
        <span className={cn(
          'ml-3 px-2 py-1 rounded-full text-xs font-medium capitalize',
          statusColors[post.status]
        )}>
          {post.status}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
        <span>{post.category}</span>
        <span>{post.readTime} min read</span>
      </div>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
              +{post.tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
        <span>Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
      </div>

      {showActions && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
          <button
            onClick={onEdit}
            className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Edit
          </button>
          {post.status === 'draft' && (
            <button
              onClick={onPublish}
              className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Publish
            </button>
          )}
        </div>
      )}
    </div>
  );
}
