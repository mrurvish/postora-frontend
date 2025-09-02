"use client";
import React, { useState } from 'react';
import { Blog } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { H3, P, Muted } from '@/components/ui/text';
import { BlogService } from '@/lib/services/blog.service';
import { useToast } from '@/lib';

interface DraftsListProps {
  drafts: Blog[];
  onDataUpdate: () => void;
}

export function DraftsList({ drafts, onDataUpdate }: DraftsListProps) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleDeleteDraft = async (draftId: string) => {
    if (!confirm('Are you sure you want to delete this draft? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      await BlogService.deleteBlog(draftId);
      toast.success('Draft deleted successfully');
      onDataUpdate();
    } catch (error: any) {
      console.error('Failed to delete draft:', error);
      toast.error(error.message || 'Failed to delete draft');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDraft = (draftId: string) => {
    // TODO: Navigate to edit draft page or open edit modal
    console.log('Edit draft:', draftId);
  };

  const handlePublishDraft = async (draftId: string) => {
    try {
      setIsLoading(true);
      await BlogService.updateBlog(draftId, { status: 'published' });
      toast.success('Draft published successfully');
      onDataUpdate();
    } catch (error: any) {
      console.error('Failed to publish draft:', error);
      toast.error(error.message || 'Failed to publish draft');
    } finally {
      setIsLoading(false);
    }
  };

  if (drafts.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <H3 className="mb-2">No drafts yet</H3>
          <Muted className="mb-6">
            Start writing to save your drafts here. You can work on them anytime and publish when ready.
          </Muted>
          <Button onClick={() => window.location.href = '/profile?tab=create'}>
            Start Writing
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <H3>Draft Posts ({drafts.length})</H3>
        <Button onClick={() => window.location.href = '/profile?tab=create'}>
          Create New Draft
        </Button>
      </div>

      <div className="grid gap-6">
        {drafts.map((draft) => (
          <Card key={draft._id} className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Draft Image */}
              {draft.featuredImage && (
                <div className="lg:w-48 lg:flex-shrink-0">
                  <img
                    src={draft.featuredImage}
                    alt={draft.title}
                    className="w-full h-32 lg:h-40 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Draft Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <H3 className="line-clamp-2">{draft.title}</H3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      Draft
                    </span>
                  </div>
                </div>

                <P className="text-muted-foreground mb-4 line-clamp-3">
                  {draft.excerpt || 'No excerpt available'}
                </P>

                {/* Draft Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {draft.wordCount || 0} words
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(draft.lastModified).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {draft.readTime || 0} min read
                  </div>
                </div>

                {/* Tags */}
                {draft.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {draft.tags.map((tag) => (
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
                    variant="default"
                    size="sm"
                    onClick={() => handlePublishDraft(draft._id)}
                    disabled={isLoading}
                  >
                    Publish
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditDraft(draft._id)}
                  >
                    Continue Editing
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteDraft(draft._id)}
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
