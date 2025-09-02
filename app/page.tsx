"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Hero } from '@/components/sections/hero';
import { PostCard } from '@/components/ui/post-card';
import { TrendingTopics } from '@/components/sections/trending-topics';
import { AuthDialog } from '@/components/ui/auth-dialog';
import { CreatePostDialog } from '@/components/ui/create-post-dialog';
import { H2, Muted } from '@/components/ui/text';
import { useAuthStore, useToast, BlogService } from '@/lib';

// Adapter function to transform API data to component interfaces
const adaptBlogToPost = (blog: any): any => ({
  id: blog._id, // Use string ID as expected by PostCard
  title: blog.title,
  excerpt: blog.excerpt || blog.content?.substring(0, 150) + '...',
  author: {
    name: blog.author?.name || 'Unknown Author',
    avatar: blog.author?.avatar || '👤',
    verified: false
  },
  date: new Date(blog.createdAt).toLocaleDateString(),
  readTime: blog.readTime || Math.ceil((blog.content?.length || 0) / 200),
  image: blog.featuredImage,
  tags: blog.tags || [],
  likes: Array.isArray(blog.likes) ? blog.likes.length : (blog.likes || 0),
  comments: blog.commentCount || 0,
  shares: blog.shares?.total || 0,
  isTrending: blog.featured || false,
  slug: blog.slug // Add slug for navigation
});

// Skeleton Loader Component
const PostSkeleton = () => (
  <div className="bg-card rounded-lg shadow-md p-6 animate-pulse">
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-10 h-10 bg-muted rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
      </div>
    </div>
    <div className="h-6 bg-muted rounded w-full mb-3"></div>
    <div className="h-4 bg-muted rounded w-full mb-2"></div>
    <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
    <div className="flex justify-between items-center">
      <div className="flex space-x-4">
        <div className="h-4 bg-muted rounded w-16"></div>
        <div className="h-4 bg-muted rounded w-16"></div>
        <div className="h-4 bg-muted rounded w-16"></div>
      </div>
      <div className="h-4 bg-muted rounded w-20"></div>
    </div>
  </div>
);

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const toast = useToast();
  
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  
  // Data state for the 4 API endpoints
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
  const [popularPosts, setPopularPosts] = useState<any[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Debug featured posts state changes
  useEffect(() => {
    console.log('Featured posts state changed:', featuredPosts);
  }, [featuredPosts]);
  
  // Loading states
  const [isLoadingLatest, setIsLoadingLatest] = useState(false);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(false);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load data in parallel using the 4 specific API endpoints
      await Promise.all([
        loadLatestPosts(),
        loadFeaturedPosts(),
        loadPopularPosts(),
        loadTrendingPosts()
      ]);
      
      // Debug: Log all loaded data
      console.log('All data loaded:');
      console.log('Latest posts:', latestPosts);
      console.log('Featured posts:', featuredPosts);
      console.log('Popular posts:', popularPosts);
      console.log('Trending posts:', trendingPosts);
      
    } catch (error: any) {
      console.error('Failed to load data:', error);
      setError(error.message || 'Failed to load data');
      toast.error(error.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadLatestPosts = async () => {
    try {
      setIsLoadingLatest(true);
      
      const response = await BlogService.getAllBlogs({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      const blogs = response?.items || [];
      setLatestPosts(blogs);
      
    } catch (err) {
      console.error('Error loading latest posts:', err);
    } finally {
      setIsLoadingLatest(false);
    }
  };

  const loadFeaturedPosts = async () => {
    try {
      setIsLoadingFeatured(true);
      
      // Try the featured endpoint first
      let blogs = await BlogService.getFeaturedBlogs(5);
      console.log('Featured blogs response:', blogs);
      console.log('Featured blogs type:', typeof blogs);
      console.log('Featured blogs length:', blogs?.length);
      
      // If no featured posts, try to get some posts and mark them as featured
      if (!blogs || blogs.length === 0) {
        console.log('No featured posts found, trying alternative approach...');
        const allBlogs = await BlogService.getAllBlogs({
          page: 1,
          limit: 5,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });
        blogs = allBlogs?.items || [];
        console.log('Alternative blogs response:', blogs);
      }
      
      setFeaturedPosts(blogs || []);
      
    } catch (err) {
      console.error('Error loading featured posts:', err);
      setFeaturedPosts([]);
    } finally {
      setIsLoadingFeatured(false);
    }
  };

  const loadPopularPosts = async () => {
    try {
      setIsLoadingPopular(true);
      
      const response = await BlogService.getAllBlogs({
        page: 1,
        limit: 5,
        sortBy: 'likes',
        sortOrder: 'desc'
      });
      
      const blogs = response?.items || [];
      setPopularPosts(blogs);
      
    } catch (err) {
      console.error('Error loading popular posts:', err);
    } finally {
      setIsLoadingPopular(false);
    }
  };

  const loadTrendingPosts = async () => {
    try {
      setIsLoadingTrending(true);
      
      const response = await BlogService.getAllBlogs({
        page: 1,
        limit: 5,
        sortBy: 'views',
        sortOrder: 'desc'
      });
      
      const blogs = response?.items || [];
      setTrendingPosts(blogs);
      
    } catch (err) {
      console.error('Error loading trending posts:', err);
    } finally {
      setIsLoadingTrending(false);
    }
  };

  const openAuthDialog = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthDialogOpen(true);
  };

  const closeAuthDialog = () => {
    setAuthDialogOpen(false);
  };

  const openCreatePost = () => {
    setIsCreatePostOpen(true);
  };

  const closeCreatePost = () => {
    setIsCreatePostOpen(false);
  };

  const handleCreatePostSuccess = () => {
    loadData();
    toast.success('Post created successfully!');
  };

  // Transform API data to component interfaces
  console.log('Raw featured posts:', featuredPosts);
  const adaptedLatestPosts = latestPosts.map(adaptBlogToPost);
  const adaptedFeaturedPosts = featuredPosts.map(adaptBlogToPost);
  const adaptedPopularPosts = popularPosts.map(adaptBlogToPost);
  const adaptedTrendingPosts = trendingPosts.map(adaptBlogToPost);
  console.log('Adapted featured posts:', adaptedFeaturedPosts);

  const handleLike = async (postId: string) => {
    if (!isAuthenticated) {
      openAuthDialog('login');
      return;
    }

    try {
      if (likedPosts.has(postId)) {
        await BlogService.unlikeBlog(postId);
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
        toast.success('Post unliked');
      } else {
        await BlogService.likeBlog(postId);
        setLikedPosts(prev => new Set(prev).add(postId));
        toast.success('Post liked');
      }
      
      // Refresh data to update like counts
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to like post');
    }
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/create');
    } else {
      openAuthDialog('register');
    }
  };

  const handleExplore = () => {
    const postsSection = document.getElementById('posts-section');
    if (postsSection) {
      postsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle loading states
  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Hero onGetStarted={handleGetStarted} onExplore={handleExplore} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading content...</p>
          </div>
        </div>
      </main>
    );
  }

  // Handle errors
  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <Hero onGetStarted={handleGetStarted} onExplore={handleExplore} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero onGetStarted={handleGetStarted} onExplore={handleExplore} />

      {/* Main Content */}
      <div id="posts-section" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-8">
            {/* Latest Posts Section */}
            <div>
              <H2 className="mb-6">Latest Posts</H2>
              
              {isLoadingLatest ? (
                <div className="space-y-8">
                  {[1, 2, 3].map((i) => (
                    <PostSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  {adaptedLatestPosts.map((post: any) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <PostCard
                        post={post}
                        isLiked={likedPosts.has(post.id)}
                        onLike={handleLike}
                        onFollow={(authorName) => {
                          console.log(`Following ${authorName}`);
                        }}
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Featured Posts Section */}
            <div>
              <H2 className="mb-6 text-primary">Featured Posts</H2>
              {isLoadingFeatured ? (
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <PostSkeleton key={i} />
                  ))}
                </div>
              ) : adaptedFeaturedPosts.length > 0 ? (
                <div className="space-y-6">
                  {adaptedFeaturedPosts.map((post: any) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <PostCard
                        post={post}
                        isLiked={likedPosts.has(post.id)}
                        onLike={handleLike}
                        onFollow={(authorName) => {
                          console.log(`Following ${authorName}`);
                        }}
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-muted-foreground mb-4">No featured posts available</p>
                  <p className="text-sm text-muted-foreground">Featured posts will appear here when they become available</p>
                </div>
              )}
            </div>

            {/* Popular Posts Section */}
            {adaptedPopularPosts.length > 0 && (
              <div className="mb-8">
                <H2 className="mb-6 text-green-600">Popular Posts</H2>
                {isLoadingPopular ? (
                  <div className="space-y-6">
                    {[1, 2].map((i) => (
                      <PostSkeleton key={i} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {adaptedPopularPosts.map((post: any) => (
                      <Link key={post.id} href={`/blog/${post.slug}`}>
                        <PostCard
                          post={post}
                          isLiked={likedPosts.has(post.id)}
                          onLike={handleLike}
                          onFollow={(authorName) => {
                            console.log(`Following ${authorName}`);
                          }}
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Trending Posts Section */}
            {adaptedTrendingPosts.length > 0 && (
              <div className="mb-8">
                <H2 className="mb-6 text-orange-600">Trending Posts</H2>
                {isLoadingTrending ? (
                  <div className="space-y-6">
                    {[1, 2].map((i) => (
                      <PostSkeleton key={i} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {adaptedTrendingPosts.map((post: any) => (
                      <Link key={post.id} href={`/blog/${post.slug}`}>
                        <PostCard
                          post={post}
                          isLiked={likedPosts.has(post.id)}
                          onLike={handleLike}
                          onFollow={(authorName) => {
                            console.log(`Following ${authorName}`);
                          }}
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Trending Topics */}
            <TrendingTopics topics={[]} />
            
            {/* Welcome Message */}
            {isAuthenticated && (
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <H2 className="mb-3">Welcome Back!</H2>
                <Muted className="mb-4">
                  Ready to share your thoughts? Use the floating button to create your next post.
                </Muted>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      {isAuthenticated ? (
        <button 
          className="fab"
          onClick={openCreatePost}
          title="Create Post"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      ) : (
        <button 
          className="fab"
          onClick={() => openAuthDialog('register')}
          title="Sign Up to Create Posts"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </button>
      )}

      {/* Auth Dialog */}
      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={closeAuthDialog}
        initialMode={authMode}
      />

      {/* Create Post Dialog */}
      <CreatePostDialog
        isOpen={isCreatePostOpen}
        onClose={closeCreatePost}
        onSuccess={handleCreatePostSuccess}
      />
    </main>
  );
}
