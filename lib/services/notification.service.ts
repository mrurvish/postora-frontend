import { apiService } from '@/lib/api';
import { 
  ApiResponse 
} from '@/lib/types';

export interface Notification {
  _id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system' | 'blog_approved' | 'blog_rejected' | 'comment_approved' | 'comment_rejected';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationData {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;
  notificationTypes: {
    likes: boolean;
    comments: boolean;
    follows: boolean;
    mentions: boolean;
    system: boolean;
    blogUpdates: boolean;
    commentUpdates: boolean;
  };
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

export class NotificationService {
  // Get user's notifications
  static async getUserNotifications(
    page: number = 1,
    limit: number = 20,
    type?: string,
    isRead?: boolean
  ): Promise<{ notifications: Notification[]; pagination: any }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (type) params.append('type', type);
    if (isRead !== undefined) params.append('isRead', isRead.toString());

    const response = await apiService.get(`/notifications?${params}`);
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data;
  }

  // Get unread notifications count
  static async getUnreadCount(): Promise<number> {
    const response = await apiService.get('/notifications/unread-count');
    if (!response.data) {
      throw new Error('No response data received');
    }
    return (response.data as any).count;
  }

  // Mark notification as read
  static async markAsRead(notificationId: string): Promise<ApiResponse> {
    const response = await apiService.patch<ApiResponse>(`/notifications/${notificationId}/read`);
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data;
  }

  // Mark multiple notifications as read
  static async markMultipleAsRead(notificationIds: string[]): Promise<ApiResponse> {
    const response = await apiService.patch<ApiResponse>('/notifications/mark-read', {
      notificationIds
    });
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data;
  }

  // Mark all notifications as read
  static async markAllAsRead(): Promise<ApiResponse> {
    const response = await apiService.patch<ApiResponse>('/notifications/mark-all-read');
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data;
  }

  // Delete notification
  static async deleteNotification(notificationId: string): Promise<ApiResponse> {
    const response = await apiService.delete<ApiResponse>(`/notifications/${notificationId}`);
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data;
  }

  // Delete multiple notifications
  static async deleteMultipleNotifications(notificationIds: string[]): Promise<ApiResponse> {
    const response = await apiService.delete<ApiResponse>('/notifications', {
      data: { notificationIds }
    });
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data;
  }

  // Clear all notifications
  static async clearAllNotifications(): Promise<ApiResponse> {
    const response = await apiService.delete<ApiResponse>('/notifications/clear-all');
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data;
  }

  // Get notification by ID
  static async getNotificationById(notificationId: string): Promise<Notification> {
    const response = await apiService.get<{ notification: Notification }>(`/notifications/${notificationId}`);
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data.notification;
  }

  // Create notification (admin/system use)
  static async createNotification(data: CreateNotificationData): Promise<Notification> {
    const response = await apiService.post<{ notification: Notification }>('/notifications', data);
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data.notification;
  }

  // Create multiple notifications
  static async createMultipleNotifications(notifications: CreateNotificationData[]): Promise<Notification[]> {
    const response = await apiService.post<{ notifications: Notification[] }>('/notifications/bulk', {
      notifications
    });
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data.notifications;
  }

  // Get notification preferences
  static async getNotificationPreferences(): Promise<NotificationPreferences> {
    const response = await apiService.get('/notifications/preferences');
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data.preferences;
  }

  // Update notification preferences
  static async updateNotificationPreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const response = await apiService.put<{ preferences: NotificationPreferences }>('/notifications/preferences', preferences);
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data.preferences;
  }

  // Subscribe to push notifications
  static async subscribeToPushNotifications(subscription: any): Promise<ApiResponse> {
    const response = await apiService.post<ApiResponse>('/notifications/push/subscribe', subscription);
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data;
  }

  // Unsubscribe from push notifications
  static async unsubscribeFromPushNotifications(subscriptionId: string): Promise<ApiResponse> {
    const response = await apiService.delete<ApiResponse>(`/notifications/push/subscribe/${subscriptionId}`);
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data;
  }

  // Test push notification
  static async testPushNotification(): Promise<ApiResponse> {
    const response = await apiService.post<ApiResponse>('/notifications/push/test');
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data;
  }

  // Get notification templates
  static async getNotificationTemplates(): Promise<any[]> {
    const response = await apiService.get('/notifications/templates');
    if (!response.data) {
      throw new Error('No response data received');
    }
    return (response.data as any).templates;
  }

  // Get notification statistics
  static async getNotificationStats(
    period: 'day' | 'week' | 'month' = 'month',
    startDate?: string,
    endDate?: string
  ): Promise<any> {
    const params = new URLSearchParams({ period });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiService.get(`/notifications/stats?${params}`);
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data;
  }

  // Get notification types
  static async getNotificationTypes(): Promise<string[]> {
    const response = await apiService.get('/notifications/types');
    if (!response.data) {
      throw new Error('No response data received');
    }
    return (response.data as any).types;
  }

  // Bulk update notifications
  static async bulkUpdateNotifications(
    notificationIds: string[],
    updates: {
      isRead?: boolean;
      isDeleted?: boolean;
    }
  ): Promise<ApiResponse> {
    const response = await apiService.patch<ApiResponse>('/notifications/bulk-update', {
      notificationIds,
      updates
    });
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data;
  }

  // Get notification history
  static async getNotificationHistory(
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: string;
      startDate?: string;
      endDate?: string;
      isRead?: boolean;
    }
  ): Promise<{ notifications: Notification[]; pagination: any }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiService.get(`/notifications/history?${params}`);
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data;
  }

  // Export notifications
  static async exportNotifications(
    format: 'csv' | 'json' = 'csv',
    filters?: {
      type?: string;
      startDate?: string;
      endDate?: string;
      isRead?: boolean;
    }
  ): Promise<Blob> {
    const params = new URLSearchParams({ format });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiService.get(`/notifications/export?${params}`, {
      responseType: 'blob'
    });
    
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data;
  }

  // Get notification settings for specific types
  static async getNotificationTypeSettings(): Promise<Record<string, boolean>> {
    const response = await apiService.get('/notifications/type-settings');
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data.settings;
  }

  // Update notification settings for specific types
  static async updateNotificationTypeSettings(
    settings: Record<string, boolean>
  ): Promise<Record<string, boolean>> {
    const response = await apiService.put<{ settings: Record<string, boolean> }>('/notifications/type-settings', {
      settings
    });
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data.settings;
  }

  // Get notification delivery status
  static async getNotificationDeliveryStatus(notificationId: string): Promise<any> {
    const response = await apiService.get(`/notifications/${notificationId}/delivery-status`);
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data;
  }

  // Retry failed notification delivery
  static async retryNotificationDelivery(notificationId: string): Promise<ApiResponse> {
    const response = await apiService.post<ApiResponse>(`/notifications/${notificationId}/retry-delivery`);
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data;
  }
}

export default NotificationService;
