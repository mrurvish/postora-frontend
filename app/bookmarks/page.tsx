'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogService, Blog } from '@/lib/services/blog.service';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useToast } from '@/lib/providers/toast-provider';
import { PostCard } from '@/components/ui/post-card';
import { Button } from '@/components/ui/button';

export default function BookmarksPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [bookmarks, setBookmarks] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (user) {
      loadBookmarks();
    }
  }, [user, currentPage]);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await BlogService.getBookmarkedBlogs(currentPage, 12);
      
      if (currentPage === 1) {
        setBookmarks(results.items);
      } else {
        setBookmarks(prev => [...prev, ...results.items]);
      }
      
      setPagination(results.pagination);
    } catch (err) {
      console.error('Failed to load bookmarks:', err);
      setError(err instanceof Error ? err.message : 'Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Transform Blog to Post format for PostCard
  const adaptBlogToPost = (blog: Blog) => ({
    id: blog._id,
    title: blog.title,
    excerpt: blog.excerpt || blog.content.substring(0, 150) + '...',
    author: {
      name: blog.author.name,
      avatar: blog.author.avatar || '👤',
      verified: false
    },
    date: new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    readTime: blog.readTime || 1,
    image: blog.coverImage || undefined,
    tags: blog.tags || [],
    likes: blog.likes || 0,
    comments: blog.comments || 0,
    shares: blog.shares || 0,
    isTrending: blog.featured || false,
    slug: blog.slug
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Authentication Required
            </h1>
            <p className="text-muted-foreground mb-6">
              Please log in to view your bookmarks.
            </p>
            <Link href="/login">
              <Button size="lg">Log In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-2">Bookmarks</h1>
            <p className="text-muted-foreground">
              Your saved posts and articles
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {loading && currentPage === 1 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading bookmarks...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😕</div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Failed to load bookmarks
              </h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={loadBookmarks}>Try Again</Button>
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔖</div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                No bookmarks yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Start saving posts you want to read later by clicking the bookmark icon.
              </p>
              <Link href="/">
                <Button size="lg">Explore Posts</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-6">
                {bookmarks.map((blog) => (
                  <Link key={blog._id} href={`/blog/${blog.slug}`}>
                    <PostCard
                      post={adaptBlogToPost(blog)}
                      isLiked={false}
                      onLike={() => {}}
                      onFollow={() => {}}
                    />
                  </Link>
                ))}
              </div>

              {/* Load More */}
              {pagination && pagination.hasNextPage && (
                <div className="text-center pt-6">
                  <Button
                    onClick={handleLoadMore}
                    disabled={loading}
                    variant="outlined"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
