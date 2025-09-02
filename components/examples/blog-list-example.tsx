'use client';

import React, { useState } from 'react';
import { 
  useBlogs, 
  useCreateBlog, 
  useToggleLike, 
  useUser,
  useIsAuthenticated,
  useToast 
} from '@/lib';
import { Button } from '@/components/ui/button';
import { Blog, CreateBlogData } from '@/lib/types';

export const BlogListExample: React.FC = () => {
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [newBlogData, setNewBlogData] = useState<CreateBlogData>({
    title: '',
    content: '',
    excerpt: '',
    tags: []
  });

  // Hooks
  const { data: blogsResponse, isLoading, error } = useBlogs(filters);
  const { data: user } = useUser();
  const isAuthenticated = useIsAuthenticated();
  const createBlog = useCreateBlog();
  const toggleLike = useToggleLike();
  const toast = useToast();

  const blogs = blogsResponse?.data || [];
  const pagination = blogsResponse?.pagination;

  // Handlers
  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogData.title || !newBlogData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createBlog.mutateAsync(newBlogData);
      setNewBlogData({ title: '', content: '', excerpt: '', tags: [] });
      toast.success('Blog created successfully!');
    } catch (error) {
      toast.error('Failed to create blog');
    }
  };

  const handleLike = async (blogId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to like blogs');
      return;
    }

    try {
      await toggleLike.mutateAsync(blogId);
    } catch (error) {
      toast.error('Failed to like blog');
    }
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Error loading blogs: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Blog List Example</h1>

      {/* Create Blog Form */}
      {isAuthenticated && (
        <div className="mb-8 p-6 bg-card rounded-xl border">
          <h2 className="text-xl font-semibold mb-4">Create New Blog</h2>
          <form onSubmit={handleCreateBlog} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={newBlogData.title}
                onChange={(e) => setNewBlogData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-3 border rounded-lg"
                placeholder="Enter blog title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                value={newBlogData.content}
                onChange={(e) => setNewBlogData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full p-3 border rounded-lg h-32"
                placeholder="Enter blog content"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Excerpt</label>
              <input
                type="text"
                value={newBlogData.excerpt}
                onChange={(e) => setNewBlogData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full p-3 border rounded-lg"
                placeholder="Enter blog excerpt"
              />
            </div>
            <Button 
              type="submit" 
              disabled={createBlog.isPending}
              className="w-full"
            >
              {createBlog.isPending ? 'Creating...' : 'Create Blog'}
            </Button>
          </form>
        </div>
      )}

      {/* Blog List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Recent Blogs</h2>
        
        {blogs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No blogs found. {!isAuthenticated && 'Login to create the first blog!'}
          </p>
        ) : (
          <>
            {blogs.map((blog: Blog) => (
              <div key={blog._id} className="p-6 bg-card rounded-xl border hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                    <p className="text-muted-foreground mb-2">{blog.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>By {blog.author.name}</span>
                      <span>•</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{blog.readTime} min read</span>
                    </div>
                  </div>
                  {blog.featured && (
                    <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(blog._id)}
                      disabled={toggleLike.isPending}
                      className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-accent transition-colors"
                    >
                      <span>👍</span>
                      <span>{blog.likes.length}</span>
                    </button>
                    <span className="flex items-center gap-2 px-3 py-1">
                      <span>💬</span>
                      <span>{blog.commentCount}</span>
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1">
                      <span>👁️</span>
                      <span>{blog.views}</span>
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                  variant="outlined"
                  size="sm"
                >
                  Previous
                </Button>
                <span className="px-4 py-2">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                  variant="outlined"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Info */}
      {user && (
        <div className="mt-8 p-4 bg-secondary rounded-lg">
          <h3 className="font-semibold mb-2">Current User</h3>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      )}
    </div>
  );
};
