"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PostCard } from '@/components/ui/post-card';
import { H2, BodyLarge, Muted } from '@/components/ui/text';
import { useAuthStore, useToast, BlogService, UserService } from '@/lib';
import { Blog } from '@/lib/services/blog.service';
import { User } from '@/lib/services/auth.service';

export default function BlogPage() {
  const { isAuthenticated } = useAuthStore();
  const toast = useToast();
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load blogs on component mount
  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await BlogService.getAllBlogs({ limit: 20 });
      setBlogs(response.items || []);
    } catch (error: any) {
      console.error('Failed to load blogs:', error);
      toast.error(error.message || 'Failed to load blogs');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate categories from actual blog data
  const categories = React.useMemo(() => {
    const categoryCounts = blogs.reduce((acc, blog) => {
      const category = blog.tags?.[0] || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryList = [
      { name: "All", count: blogs.length, icon: "🌟" },
      ...Object.entries(categoryCounts).map(([name, count]) => ({
        name,
        count,
        icon: "📝"
      }))
    ];

    return categoryList;
  }, [blogs]);

  const handleCategoryChange = (categoryName: string) => {
    setActiveCategory(categoryName);
    // TODO: Implement category filtering with API
  };

  const handleLoadMore = () => {
    // TODO: Implement pagination
    console.log('Load more clicked');
  };

  const handleLike = async (postId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
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
      loadBlogs();
    } catch (error: any) {
      toast.error(error.message || 'Failed to like post');
    }
  };

  const handleFollow = async (authorName: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to follow users');
      return;
    }

    try {
      // Find the user by name and follow them
      const blog = blogs.find(b => b.author.name === authorName);
      if (blog) {
        const userId = blog.author._id;
        if (followedUsers.has(userId)) {
          await UserService.unfollowUser(userId);
          setFollowedUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
          toast.success('User unfollowed');
        } else {
          await UserService.followUser(userId);
          setFollowedUsers(prev => new Set(prev).add(userId));
          toast.success('User followed');
        }
        
        // Refresh data to update follower counts
        loadBlogs();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to follow user');
    }
  };

  // Handle error state
  if (blogs.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-destructive">Failed to load blogs. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  // Filter posts by category
  const filteredPosts = activeCategory === 'All' 
    ? blogs 
    : blogs.filter(blog => blog.tags?.includes(activeCategory));

  // Transform blog data to component interface
  const adaptedPosts = blogs.map(blog => ({
    id: blog._id,
    title: blog.title,
    excerpt: blog.excerpt,
    author: {
      name: blog.author.name,
      avatar: blog.author.avatar || '👤',
      verified: false
    },
    date: new Date(blog.createdAt).toLocaleDateString(),
    readTime: blog.readTime || 5,
          image: blog.coverImage || undefined,
      tags: blog.tags || [],
      likes: blog.likes || 0,
      comments: blog.comments || 0,
      shares: blog.shares || 0,
    isTrending: blog.featured || false
  }));

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-chart-5/10 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <H2 className="mb-4">Discover Amazing Stories</H2>
            <BodyLarge className="text-muted-foreground max-w-2xl mx-auto">
              Explore thought-provoking articles, tutorials, and insights from our community of creators
            </BodyLarge>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto py-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryChange(category.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  activeCategory === category.name
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent text-accent-foreground hover:bg-accent/80'
                }`}
              >
                <span>{category.icon}</span>
                <span className="font-medium">{category.name}</span>
                <span className="text-sm opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((blog) => (
              <PostCard
                key={blog._id}
                post={{
                  id: parseInt(blog._id) || 0,
                  title: blog.title,
                  excerpt: blog.excerpt,
                  author: {
                    name: blog.author.name,
                    avatar: blog.author.avatar || '👤',
                    verified: false
                  },
                  date: new Date(blog.createdAt).toLocaleDateString(),
                  readTime: blog.readTime || 5,
                  image: blog.coverImage || 'https://via.placeholder.com/400x250/6b7280/ffffff?text=No+Image',
                  tags: blog.tags || [],
                  likes: blog.likes || 0,
                  comments: blog.comments || 0,
                  shares: blog.shares || 0,
                  isTrending: blog.featured || false
                }}
                isLiked={likedPosts.has(blog._id)}
                onLike={() => handleLike(blog._id)}
                onFollow={handleFollow}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No blogs found in this category.</p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {/* pagination?.hasNext && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              className="btn-secondary"
            >
              Load More Posts
            </button>
          </div>
        ) */}
      </div>
    </div>
  );
}
