"use client";
import React, { useState } from 'react';
import { Blog } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { H3, P, Muted } from '@/components/ui/text';
import { PostCard } from '@/components/ui/post-card';
import { BlogService } from '@/lib/services/blog.service';
import { useToast } from '@/lib';

interface PostsListProps {
  posts: Blog[];
  onDataUpdate: () => void;
}

export function PostsList({ posts, onDataUpdate }: PostsListProps) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      await BlogService.deleteBlog(postId);
      toast.success('Post deleted successfully');
      onDataUpdate();
    } catch (error: any) {
      console.error('Failed to delete post:', error);
      toast.error(error.message || 'Failed to delete post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPost = (postId: string) => {
    // TODO: Navigate to edit post page or open edit modal
    console.log('Edit post:', postId);
  };

  const handleViewPost = (postId: string) => {
    // TODO: Navigate to view post page
    console.log('View post:', postId);
  };

  if (posts.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <H3 className="mb-2">No published posts yet</H3>
          <Muted className="mb-6">
            Start writing and publishing your thoughts to see them here.
          </Muted>
          <Button onClick={() => window.location.href = '/profile?tab=create'}>
            Create Your First Post
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <H3>Published Posts ({posts.length})</H3>
        <Button onClick={() => window.location.href = '/profile?tab=create'}>
          Create New Post
        </Button>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Card key={post._id} className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Post Image */}
              {post.featuredImage && (
                <div className="lg:w-48 lg:flex-shrink-0">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-32 lg:h-40 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Post Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <H3 className="line-clamp-2">{post.title}</H3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                </div>

                <P className="text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </P>

                {/* Post Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {post.views} views
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {post.likes.length} likes
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {post.commentCount} comments
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {post.readTime} min read
                  </div>
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewPost(post._id)}
                  >
                    View Post
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditPost(post._id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePost(post._id)}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
