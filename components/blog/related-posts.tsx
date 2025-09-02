import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BlogService, Blog } from '@/lib/services/blog.service';
import { PostCard } from '@/components/ui/post-card';

interface RelatedPostsProps {
  currentBlogId: string;
  category?: string;
  tags?: string[];
}

export function RelatedPosts({ currentBlogId, category, tags }: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRelatedPosts();
  }, [currentBlogId, category, tags]);

  const loadRelatedPosts = async () => {
    try {
      setLoading(true);
      
      // Try to get posts by category first
      let posts: Blog[] = [];
      
      if (category) {
        try {
          const response = await BlogService.getBlogsByCategory(category, 1, 4);
          posts = response.items || [];
        } catch (err) {
          console.error('Failed to load posts by category:', err);
        }
      }
      
      // If not enough posts by category, try to get recent posts
      if (posts.length < 3) {
        try {
          const response = await BlogService.getAllBlogs({
            page: 1,
            limit: 6,
            sortBy: 'createdAt',
            sortOrder: 'desc'
          });
          const recentPosts = response.items || [];
          // Filter out current post and add to existing posts
          const filteredPosts = recentPosts.filter(post => post._id !== currentBlogId);
          posts = [...posts, ...filteredPosts].slice(0, 4);
        } catch (err) {
          console.error('Failed to load recent posts:', err);
        }
      }
      
      // Remove current post and limit to 4 posts
      const filteredPosts = posts
        .filter(post => post._id !== currentBlogId)
        .slice(0, 4);
      
      setRelatedPosts(filteredPosts);
    } catch (err) {
      console.error('Failed to load related posts:', err);
    } finally {
      setLoading(false);
    }
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
    isTrending: blog.featured || false
  });

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Related Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded mb-4"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedPosts.map((blog) => (
          <Link key={blog._id} href={`/blog/${blog.slug}`}>
            <PostCard
              post={adaptBlogToPost(blog)}
              isLiked={false}
              onLike={() => {}} // Will be handled by the blog detail page
              onFollow={() => {}} // Will be handled by the blog detail page
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
