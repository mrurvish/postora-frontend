'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SearchService } from '@/lib/services/search.service';
import { Blog } from '@/lib/services/blog.service';
import { PostCard } from '@/components/ui/post-card';
import { Button } from '@/components/ui/button';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'popularity'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const categories = [
    'Technology', 'Design', 'Business', 'Lifestyle', 'Travel', 
    'Food', 'Health', 'Education', 'Entertainment', 'General'
  ];

  useEffect(() => {
    if (category) {
      loadCategoryPosts();
    }
  }, [category, currentPage, sortBy, sortOrder]);

  const loadCategoryPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await SearchService.searchByCategory(
        category,
        undefined,
        currentPage,
        12
      );
      
      if (currentPage === 1) {
        setPosts(results.items);
      } else {
        setPosts(prev => [...prev, ...results.items]);
      }
      
      setPagination(results.pagination);
    } catch (err) {
      console.error('Failed to load category posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleSortChange = (newSortBy: 'date' | 'popularity') => {
    setSortBy(newSortBy);
    setCurrentPage(1);
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

  if (!categories.includes(category)) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Category not found
            </h1>
            <p className="text-muted-foreground mb-6">
              The category "{category}" doesn't exist.
            </p>
            <Link href="/search">
              <Button>Browse All Categories</Button>
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
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                ← Back
              </button>
              <h1 className="text-3xl font-bold text-foreground">
                {category}
              </h1>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {posts.length > 0 ? (
                  <span>
                    {pagination?.total || posts.length} posts in {category}
                  </span>
                ) : !loading ? (
                  <span>No posts found in {category}</span>
                ) : null}
              </p>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={sortBy === 'date' ? 'default' : 'outlined'}
                  size="sm"
                  onClick={() => handleSortChange('date')}
                >
                  Latest
                </Button>
                <Button
                  variant={sortBy === 'popularity' ? 'default' : 'outlined'}
                  size="sm"
                  onClick={() => handleSortChange('popularity')}
                >
                  Popular
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {loading && currentPage === 1 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={loadCategoryPosts}>Try Again</Button>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                No posts yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Be the first to write a post in the {category} category!
              </p>
              <Link href="/create">
                <Button size="lg">Create Post</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-6">
                {posts.map((post) => (
                  <Link key={post._id} href={`/blog/${post.slug}`}>
                    <PostCard
                      post={adaptBlogToPost(post)}
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
                    {loading ? 'Loading...' : 'Load More Posts'}
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
