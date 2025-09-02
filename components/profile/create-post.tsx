"use client";
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { H3, P, Muted } from '@/components/ui/text';
import { apiService } from '@/lib/api';
import { CreateBlogData } from '@/lib/types';

interface CreatePostProps {
  onPostCreated: () => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateBlogData>({
    title: '',
    content: '',
    excerpt: '',
    tags: [],
    status: 'draft',
    isPublic: true,
    allowComments: true
  });
  const [tagInput, setTagInput] = useState('');

  const handleInputChange = (field: keyof CreateBlogData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in the title and content fields.');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create the blog post
      const response = await apiService.post('/blogs', formData);
      
      if (response.success) {
        // Reset form
        setFormData({
          title: '',
          content: '',
          excerpt: '',
          tags: [],
          status: 'draft',
          isPublic: true,
          allowComments: true
        });
        
        // Notify parent component
        onPostCreated();
        
        // Show success message
        alert('Post created successfully!');
      }
    } catch (error: any) {
      console.error('Failed to create post:', error);
      alert(error.message || 'Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === e.currentTarget) {
      handleAddTag();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8">
        <div className="text-center mb-8">
          <H3 className="mb-2">Create New Post</H3>
          <Muted>Share your thoughts with the world</Muted>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              Title *
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Enter your post title..."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              className="text-lg"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-foreground mb-2">
              Excerpt
            </label>
            <Input
              id="excerpt"
              type="text"
              placeholder="Brief description of your post..."
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              maxLength={200}
            />
            <Muted className="text-xs mt-1">
              {formData.excerpt.length}/200 characters
            </Muted>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
              Content *
            </label>
            <textarea
              id="content"
              rows={12}
              placeholder="Write your post content here..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              required
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <Muted className="text-xs mt-1">
              {formData.content.length} characters
            </Muted>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-foreground mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                id="tags"
                type="text"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
              >
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-primary/20 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div>
              <label htmlFor="isPublic" className="block text-sm font-medium text-foreground mb-2">
                Visibility
              </label>
              <select
                id="isPublic"
                value={formData.isPublic ? 'public' : 'private'}
                onChange={(e) => handleInputChange('isPublic', e.target.value === 'public')}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div>
              <label htmlFor="allowComments" className="block text-sm font-medium text-foreground mb-2">
                Comments
              </label>
              <select
                id="allowComments"
                value={formData.allowComments ? 'enabled' : 'disabled'}
                onChange={(e) => handleInputChange('allowComments', e.target.value === 'enabled')}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Creating...' : 'Create Post'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  title: '',
                  content: '',
                  excerpt: '',
                  tags: [],
                  status: 'draft',
                  isPublic: true,
                  allowComments: true
                });
              }}
              className="flex-1"
            >
              Reset Form
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
