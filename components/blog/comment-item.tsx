import React, { useState } from 'react';
import { BlogComment } from '@/lib/services/blog.service';
import { useToast } from '@/lib/providers/toast-provider';

interface CommentItemProps {
  comment: BlogComment;
  currentUserId?: string;
  onDelete: (commentId: string) => void;
  onLike: (commentId: string) => void;
}

export function CommentItem({ 
  comment, 
  currentUserId, 
  onDelete, 
  onLike 
}: CommentItemProps) {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const handleLike = () => {
    if (!currentUserId) {
      toast({
        title: 'Login Required',
        description: 'Please login to like comments.',
        variant: 'destructive',
      });
      return;
    }

    setIsLiked(!isLiked);
    onLike(comment._id);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete(comment._id);
  };

  const isAuthor = currentUserId === comment.author._id;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Comment Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-lg">
            {comment.author.avatar ? (
              <img
                src={comment.author.avatar}
                alt={comment.author.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              '👤'
            )}
          </div>
          <div>
            <div className="font-semibold text-foreground">
              {comment.author.name}
            </div>
            <div className="text-sm text-muted-foreground">
              @{comment.author.username} • {formatDate(comment.createdAt)}
            </div>
          </div>
        </div>

        {/* Comment Actions */}
        <div className="flex items-center gap-2">
          {isAuthor && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-muted-foreground hover:text-red-500 transition-colors"
              title="Delete comment"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Comment Content */}
      <div className="text-foreground leading-relaxed mb-4">
        {comment.content}
      </div>

      {/* Comment Footer */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 text-sm transition-colors ${
            isLiked
              ? 'text-red-500 hover:text-red-600'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <svg 
            className="w-4 h-4" 
            fill={isLiked ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {comment.likes}
        </button>

        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Reply
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Delete Comment
            </h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
