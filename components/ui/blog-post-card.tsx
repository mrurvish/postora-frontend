import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface Author {
  name: string;
  avatar: string;
  bio?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: Author;
  publishedAt: string;
  readTime: number;
  category: string;
  tags: string[];
  featuredImage?: string;
  views: number;
  likes: number;
  comments: number;
}

export interface BlogPostCardProps {
  post: BlogPost;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'featured';
  size?: 'sm' | 'md' | 'lg';
  showStats?: boolean;
  className?: string;
}

export function BlogPostCard({ 
  post, 
  variant = 'default',
  size = 'md',
  showStats = true,
  className 
}: BlogPostCardProps) {
  const variants = {
    default: 'bg-card border border-border hover:shadow-medium',
    elevated: 'bg-card shadow-medium border border-border hover:shadow-strong',
    outlined: 'bg-transparent border-2 border-border hover:border-primary',
    glass: 'glass border border-border/20 hover:shadow-medium',
    featured: 'bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 border-2 border-primary/20 hover:shadow-strong'
  };

  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const imageSizes = {
    sm: 'h-32',
    md: 'h-40',
    lg: 'h-48'
  };

  return (
    <article className={cn(
      'rounded-2xl transition-all duration-300 group cursor-pointer',
      variants[variant],
      sizes[size],
      className
    )}>
      {post.featuredImage && (
        <div className={cn(
          'mb-4 rounded-xl overflow-hidden',
          imageSizes[size]
        )}>
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
            {post.category}
          </span>
          <span>•</span>
          <span>{post.readTime} min read</span>
        </div>

        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-muted-foreground text-sm line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-foreground font-medium">
              {post.author.name}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(post.publishedAt).toLocaleDateString()}
          </span>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {showStats && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {post.views}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {post.likes}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {post.comments}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
