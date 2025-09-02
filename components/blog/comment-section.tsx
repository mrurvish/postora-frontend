import React, { useEffect, useState } from 'react';
import { BlogService, BlogComment } from '@/lib/services/blog.service';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useToast } from '@/lib/providers/toast-provider';
import { CommentForm } from './comment-form';
import { CommentItem } from './comment-item';

interface CommentSectionProps {
  blogId: string;
}

export function CommentSection({ blogId }: CommentSectionProps) {
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    loadComments();
  }, [blogId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await BlogService.getBlogComments(blogId, 1, 50);
      setComments(response.items || []);
    } catch (err) {
      console.error('Failed to load comments:', err);
      setError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (content: string) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to add a comment.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const newComment = await BlogService.createComment({
        content,
        blogId,
      });
      
      setComments(prev => [newComment, ...prev]);
      setShowCommentForm(false);
      
      toast({
        title: 'Comment Added',
        description: 'Your comment has been added successfully!',
      });
    } catch (err) {
      console.error('Failed to add comment:', err);
      toast({
        title: 'Error',
        description: 'Failed to add comment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await BlogService.deleteComment(blogId, commentId);
      setComments(prev => prev.filter(comment => comment._id !== commentId));
      
      toast({
        title: 'Comment Deleted',
        description: 'Comment has been deleted successfully.',
      });
    } catch (err) {
      console.error('Failed to delete comment:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete comment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to like comments.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await BlogService.likeComment(blogId, commentId);
      // Update the comment's like count in the UI
      setComments(prev => prev.map(comment => 
        comment._id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      ));
    } catch (err) {
      console.error('Failed to like comment:', err);
      toast({
        title: 'Error',
        description: 'Failed to like comment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="mt-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-foreground">
          Comments ({comments.length})
        </h2>
        {user && (
          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {showCommentForm ? 'Cancel' : 'Add Comment'}
          </button>
        )}
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <div className="mb-8">
          <CommentForm onSubmit={handleAddComment} onCancel={() => setShowCommentForm(false)} />
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading comments...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{error}</p>
            <button
              onClick={loadComments}
              className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
            {user && !showCommentForm && (
              <button
                onClick={() => setShowCommentForm(true)}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add Comment
              </button>
            )}
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUserId={user?._id}
              onDelete={handleDeleteComment}
              onLike={handleLikeComment}
            />
          ))
        )}
      </div>
    </div>
  );
}
