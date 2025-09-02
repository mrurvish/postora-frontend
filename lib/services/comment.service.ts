import { apiService } from '@/lib/api';
import { 
  Comment, 
  CreateCommentData, 
  UpdateCommentData, 
  PaginatedResponse,
  ApiResponse 
} from '@/lib/types';

export class CommentService {
  /**
   * Get all comments for a specific blog post
   * Endpoint: GET /comments/blog/:blogId
   * Purpose: Retrieve comments displayed on a blog post
   * Use case: Comment sections, comment threads, blog discussions
   * Parameters: blogId, page, limit, sortBy (newest/oldest/likes)
   * Returns: Paginated list of comments with pagination metadata
   */
  static async getBlogComments(
    blogId: string,
    page: number = 1,
    limit: number = 20,
    sortBy: 'newest' | 'oldest' | 'likes' = 'newest'
  ): Promise<PaginatedResponse<Comment>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy
    });

    const response = await apiService.get(`/comments/blog/${blogId}?${params}`);
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data as PaginatedResponse<Comment>;
  }

  /**
   * Get a specific comment by its ID
   * Endpoint: GET /comments/:id
   * Purpose: Retrieve individual comment details
   * Use case: Comment editing, comment display, comment references
   * Parameters: commentId (string) - unique identifier of the comment
   * Returns: Complete comment object
   */
  static async getCommentById(commentId: string): Promise<Comment> {
    const response = await apiService.get<{ comment: Comment }>(`/comments/${commentId}`);
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data.comment;
  }

  /**
   * Create a new comment on a blog post
   * Endpoint: POST /comments
   * Purpose: Add a new comment to a blog post
   * Use case: Comment forms, user interactions, discussions
   * Parameters: blogId, CreateCommentData (content, parentId if reply)
   * Returns: Newly created comment object
   */
  static async createComment(blogId: string, data: CreateCommentData): Promise<Comment> {
    const response = await apiService.post<{ comment: Comment }>(`/comments`, { ...data, blogId });
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data.comment;
  }

  /**
   * Update an existing comment
   * Endpoint: PUT /comments/:id
   * Purpose: Modify comment content (typically by comment author)
   * Use case: Comment editing, content updates
   * Parameters: commentId, UpdateCommentData (new content)
   * Returns: Updated comment object
   */
  static async updateComment(commentId: string, data: UpdateCommentData): Promise<Comment> {
    const response = await apiService.put<{ comment: Comment }>(`/comments/${commentId}`, data);
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data.comment;
  }

  /**
   * Delete a comment
   * Endpoint: DELETE /comments/:id
   * Purpose: Remove a comment (typically by comment author or admin)
   * Use case: Comment deletion, content moderation
   * Parameters: commentId (string) - ID of comment to delete
   * Returns: API response confirming deletion
   */
  static async deleteComment(commentId: string): Promise<ApiResponse> {
    const response = await apiService.delete<ApiResponse>(`/comments/${commentId}`);
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data;
  }

  /**
   * ❤️ Like a comment
   * Endpoint: POST /comments/:id/like
   * Purpose: Like a comment
   * Use case: Comment engagement, user interaction
   */
  static async likeComment(commentId: string): Promise<{ liked: boolean; likeCount: number }> {
    const response = await apiService.post<{ liked: boolean; likeCount: number }>(`/comments/${commentId}/like`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to like comment');
  }

  /**
   * 👎 Dislike a comment
   * Endpoint: POST /comments/:id/dislike
   * Purpose: Dislike a comment
   * Use case: Comment feedback, user interaction
   */
  static async dislikeComment(commentId: string): Promise<{ disliked: boolean; dislikeCount: number }> {
    const response = await apiService.post<{ disliked: boolean; dislikeCount: number }>(`/comments/${commentId}/dislike`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to dislike comment');
  }

  /**
   * 🔄 Toggle like on a comment
   * Endpoint: POST /comments/:id/like
   * Purpose: Like or unlike a comment
   * Use case: Comment like buttons
   */
  static async toggleLikeComment(commentId: string): Promise<{ liked: boolean; likeCount: number }> {
    const response = await apiService.post<{ liked: boolean; likeCount: number }>(`/comments/${commentId}/like`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to toggle comment like');
  }

  /**
   * 🔄 Toggle dislike on a comment
   * Endpoint: POST /comments/:id/dislike
   * Purpose: Dislike or undislike a comment
   * Use case: Comment dislike buttons
   */
  static async toggleDislikeComment(commentId: string): Promise<{ disliked: boolean; dislikeCount: number }> {
    const response = await apiService.post<{ disliked: boolean; dislikeCount: number }>(`/comments/${commentId}/dislike`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to toggle comment dislike');
  }

  /**
   * Remove like from a comment
   * Endpoint: DELETE /comments/:id/like
   * Purpose: Remove previously given like from a comment
   * Use case: Unlike buttons, like management
   * Parameters: commentId (string) - ID of comment to unlike
   * Returns: API response confirming the unlike action
   */
  static async unlikeComment(commentId: string): Promise<ApiResponse> {
    const response = await apiService.delete<ApiResponse>(`/comments/${commentId}/like`);
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data;
  }

  /**
   * Remove dislike from a comment
   * Endpoint: DELETE /comments/:id/dislike
   * Purpose: Remove previously given dislike from a comment
   * Use case: Undislike buttons, dislike management
   * Parameters: commentId (string) - ID of comment to undislike
   * Returns: API response confirming the undislike action
   */
  static async undislikeComment(commentId: string): Promise<ApiResponse> {
    const response = await apiService.delete<ApiResponse>(`/comments/${commentId}/dislike`);
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data;
  }

  /**
   * Report a comment for inappropriate content
   * Endpoint: POST /comments/:id/report
   * Purpose: Flag problematic comments for moderator review
   * Use case: Report buttons, content moderation, community safety
   * Parameters: commentId, reason, description (optional)
   * Returns: API response confirming the report
   */
  static async reportComment(
    commentId: string, 
    reason: string, 
    description?: string
  ): Promise<ApiResponse> {
    const response = await apiService.post<ApiResponse>(`/comments/${commentId}/report`, {
      reason,
      description
    });
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data;
  }

  /**
   * Get replies to a specific comment
   * Endpoint: GET /comments/:id/replies
   * Purpose: Retrieve nested comments (threaded discussions)
   * Use case: Comment threads, reply displays, nested discussions
   * Parameters: commentId, page, limit
   * Returns: Paginated list of reply comments
   */
  static async getCommentReplies(
    commentId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Comment>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await apiService.get(`/comments/${commentId}/replies?${params}`);
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data as PaginatedResponse<Comment>;
  }

  /**
   * Reply to an existing comment
   * Endpoint: POST /comments/:id/replies
   * Purpose: Create a nested comment in reply to another comment
   * Use case: Reply buttons, threaded discussions, comment conversations
   * Parameters: commentId (parent comment), CreateCommentData
   * Returns: Newly created reply comment
   */
  static async replyToComment(
    commentId: string, 
    data: CreateCommentData
  ): Promise<Comment> {
    const response = await apiService.post<{ comment: Comment }>(`/comments/${commentId}/replies`, data);
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data.comment;
  }

  /**
   * Get all comments by a specific user
   * Endpoint: GET /comments/author/:userId
   * Purpose: Retrieve comment history for a user
   * Use case: User profiles, comment history, user activity
   * Parameters: userId, page, limit
   * Returns: Paginated list of user's comments
   */
  static async getUserComments(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Comment>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await apiService.get(`/comments/author/${userId}?${params}`);
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data as PaginatedResponse<Comment>;
  }
}

export default CommentService;
