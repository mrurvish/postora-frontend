'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BlogService, Blog } from '@/lib/services/blog.service';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useToast } from '@/lib/providers/toast-provider';
import { BlogHeader } from '@/components/blog/blog-header';
import { BlogContent } from '@/components/blog/blog-content';
import { BlogActions } from '@/components/blog/blog-actions';
import { CommentSection } from '@/components/blog/comment-section';
import { RelatedPosts } from '@/components/blog/related-posts';
import { PostSkeleton } from '@/components/ui/post-skeleton';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (slug) {
      loadBlog();
    }
  }, [slug]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const blogData = await BlogService.getBlogBySlug(slug);
      setBlog(blogData);
      
      // Check if user has liked/bookmarked this blog
      if (user) {
        setIsLiked(blogData.likes?.includes(user._id) || false);
        setIsBookmarked(blogData.bookmarks?.includes(user._id) || false);
      }
    } catch (err) {
      console.error('Failed to load blog:', err);
      setError(err instanceof Error ? err.message : 'Failed to load blog');
      toast({
        title: 'Error',
        description: 'Failed to load blog post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to like this post.',
        variant: 'destructive',
      });
      return;
    }

    if (!blog) return;

    try {
      if (isLiked) {
        await BlogService.unlikeBlog(blog._id);
        setIsLiked(false);
        setBlog(prev => prev ? { ...prev, likes: prev.likes - 1 } : null);
        toast({
          title: 'Post Unliked',
          description: 'You unliked this post.',
        });
      } else {
        await BlogService.likeBlog(blog._id);
        setIsLiked(true);
        setBlog(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
        toast({
          title: 'Post Liked',
          description: 'You liked this post!',
        });
      }
    } catch (err) {
      console.error('Failed to like/unlike blog:', err);
      toast({
        title: 'Error',
        description: 'Failed to update like. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    if (!blog) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt || blog.content.substring(0, 100),
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link Copied',
          description: 'Blog link copied to clipboard!',
        });
      }
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <PostSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {error || 'Blog not found'}
          </h1>
          <p className="text-muted-foreground mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Blog Header */}
      <BlogHeader blog={blog} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Blog Content */}
          <BlogContent blog={blog} />
          
          {/* Blog Actions */}
          <BlogActions
            blog={blog}
            isLiked={isLiked}
            isBookmarked={isBookmarked}
            onLike={handleLike}
            onShare={handleShare}
          />
          
          {/* Comments Section */}
          <CommentSection blogId={blog._id} />
          
          {/* Related Posts */}
          <RelatedPosts 
            currentBlogId={blog._id}
            category={blog.category}
            tags={blog.tags}
          />
        </div>
      </div>
    </div>
  );
}
