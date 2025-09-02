'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BlogService, Blog } from '@/lib/services/blog.service';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useToast } from '@/lib/providers/toast-provider';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/ui/post-card';

export default function MyPostsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'published' | 'drafts'>('published');

  useEffect(() => {
    if (isAuthenticated) {
      loadUserPosts();
    }
  }, [isAuthenticated]);

  const loadUserPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get posts by the current user using username
      const { user } = useAuthStore.getState();
      if (!user) return;
      
      const response = await BlogService.getBlogsByUser(user.username, 1, 50);
      setPosts(response.items || []);
    } catch (err) {
      console.error('Failed to load user posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load posts');
      toast.error('Failed to load your posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      await BlogService.deleteBlog(postId);
      setPosts(prev => prev.filter(post => post._id !== postId));
      toast.success('Post deleted successfully');
    } catch (err) {
      console.error('Failed to delete post:', err);
      toast.error('Failed to delete post');
    }
  };

  const handleEditPost = (post: Blog) => {
    // For now, redirect to create page with post data
    // TODO: Implement edit functionality
    toast.info('Edit functionality coming soon!');
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

  // Filter posts based on active tab
  const publishedPosts = posts.filter(post => post.status === 'published');
  const draftPosts = posts.filter(post => post.status === 'draft');

  // Show sign-in message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Please sign in to view your posts</h1>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to access your blog posts and drafts.
          </p>
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Show loading state while loading posts
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={loadUserPosts}>
              Try Again
            </Button>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Posts</h1>
              <p className="text-muted-foreground mt-2">
                Manage your blog posts and drafts
              </p>
            </div>
            <Link href="/create">
              <Button>
                Create New Post
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('published')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'published'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Published ({publishedPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'drafts'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Drafts ({draftPosts.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'published' ? (
          // Published Posts Tab
          <div>
            {publishedPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  No published posts yet
                </h2>
                <p className="text-muted-foreground mb-6">
                  Start writing your first blog post to share your thoughts with the world.
                </p>
                <Link href="/create">
                  <Button size="lg">
                    Create Your First Post
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    Published Posts ({publishedPosts.length})
                  </h2>
                </div>

                <div className="grid gap-6">
                  {publishedPosts.map((post) => (
                    <div key={post._id} className="relative">
                      <Link href={`/blog/${post.slug}`}>
                        <PostCard
                          post={adaptBlogToPost(post)}
                          isLiked={false}
                          onLike={() => {}}
                          onFollow={() => {}}
                        />
                      </Link>
                      
                      {/* Post Actions */}
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outlined"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditPost(post);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outlined"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeletePost(post._id);
                          }}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Drafts Tab
          <div>
            {draftPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📄</div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  No drafts yet
                </h2>
                <p className="text-muted-foreground mb-6">
                  Start writing a draft and save it for later publication.
                </p>
                <Link href="/create">
                  <Button size="lg">
                    Create Draft
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    Draft Posts ({draftPosts.length})
                  </h2>
                </div>

                <div className="grid gap-6">
                  {draftPosts.map((post) => (
                    <div key={post._id} className="relative">
                      <div className="bg-card border border-border rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                            Draft
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Last edited: {new Date(post.updatedAt || post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-foreground mb-3">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt || post.content.substring(0, 150) + '...'}
                        </p>
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 bg-muted text-sm text-muted-foreground rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="px-3 py-1 bg-muted text-sm text-muted-foreground rounded-full">
                                +{post.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                        
                        {/* Draft Actions */}
                        <div className="flex items-center gap-3 pt-4 border-t border-border">
                          <Button
                            size="sm"
                            onClick={() => handleEditPost(post)}
                          >
                            Continue Editing
                          </Button>
                          <Button
                            size="sm"
                            variant="outlined"
                            onClick={() => handleDeletePost(post._id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Delete Draft
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
