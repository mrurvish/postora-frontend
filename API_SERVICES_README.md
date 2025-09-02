# Frontend API Services Documentation

This document provides a comprehensive overview of all the API services available in the frontend, their methods, and usage examples.

## Overview

The frontend includes a complete set of API services that mirror all backend endpoints. Each service is implemented as a static class with methods that correspond to specific API operations.

## Services Overview

### 1. AuthService
Handles all authentication-related operations.

**Key Methods:**
- `register(data)` - User registration
- `login(credentials)` - User login
- `googleAuth(data)` - Google OAuth authentication
- `getCurrentUser()` - Get current authenticated user
- `refreshToken()` - Refresh access token
- `logout()` - User logout
- `isAuthenticated()` - Check authentication status
- `storeAuthData(user, token)` - Store auth data locally
- `clearAuthData()` - Clear stored auth data

**Usage Example:**
```typescript
import { AuthService } from '@/lib/services';

// Login user
const authResponse = await AuthService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Store authentication data
AuthService.storeAuthData(authResponse.user, authResponse.token);
```

### 2. UserService
Manages user-related operations and profile management.

**Key Methods:**
- `getAllUsers(filters)` - Get all users (admin only)
- `getUserById(userId)` - Get user by ID
- `getUserByUsername(username)` - Get user by username
- `updateProfile(data)` - Update user profile
- `updateAvatar(avatarUrl)` - Update user avatar
- `changePassword(data)` - Change user password
- `followUser(userId)` - Follow a user
- `unfollowUser(userId)` - Unfollow a user
- `getUserFollowers(userId)` - Get user's followers
- `getUserFollowing(userId)` - Get user's following

**Usage Example:**
```typescript
import { UserService } from '@/lib/services';

// Update user profile
const updatedUser = await UserService.updateProfile({
  name: 'New Name',
  bio: 'Updated bio',
  website: 'https://example.com'
});

// Follow a user
await UserService.followUser('userId123');
```

### 3. ProfileService
Handles profile-specific operations and user statistics.

**Key Methods:**
- `getCurrentProfile()` - Get current user profile
- `updateProfile(data)` - Update profile information
- `getUserStats(userId)` - Get user statistics
- `getUserPosts(userId, status)` - Get user's posts
- `getUserDrafts(userId)` - Get user's drafts
- `getUserBookmarks()` - Get user's bookmarks

**Usage Example:**
```typescript
import { ProfileService } from '@/lib/services';

// Get user statistics
const stats = await ProfileService.getUserStats('userId123');

// Get user's published posts
const posts = await ProfileService.getUserPublishedPosts('userId123', 1, 10);
```

### 4. BlogService
Manages all blog-related operations.

**Key Methods:**
- `getBlogs(filters)` - Get blogs with filters
- `getBlogBySlug(slug)` - Get blog by slug
- `createBlog(data)` - Create new blog
- `updateBlog(id, data)` - Update existing blog
- `deleteBlog(id)` - Delete blog
- `likeBlog(id)` - Like a blog
- `bookmarkBlog(id)` - Bookmark a blog
- `getFeaturedBlogs()` - Get featured blogs
- `getTrendingBlogs()` - Get trending blogs
- `searchBlogs(query)` - Search blogs

**Usage Example:**
```typescript
import { BlogService } from '@/lib/services';

// Create new blog
const newBlog = await BlogService.createBlog({
  title: 'My New Blog',
  content: 'Blog content here...',
  excerpt: 'Short description',
  tags: ['technology', 'programming'],
  status: 'draft'
});

// Get trending blogs
const trending = await BlogService.getTrendingBlogs(5);
```

### 5. CommentService
Handles comment operations and management.

**Key Methods:**
- `getBlogComments(blogId)` - Get comments for a blog
- `createComment(blogId, data)` - Create new comment
- `updateComment(commentId, data)` - Update comment
- `deleteComment(commentId)` - Delete comment
- `likeComment(commentId)` - Like a comment
- `replyToComment(commentId, data)` - Reply to comment
- `getCommentReplies(commentId)` - Get comment replies

**Usage Example:**
```typescript
import { CommentService } from '@/lib/services';

// Create comment
const comment = await CommentService.createComment('blogId123', {
  content: 'Great article!',
  parentId: null
});

// Reply to comment
const reply = await CommentService.replyToComment('commentId123', {
  content: 'I agree with you!'
});
```

### 6. StoriesService
Manages user stories and live content.

**Key Methods:**
- `getActiveStories()` - Get all active stories
- `getUserStories(userId)` - Get stories by user
- `createStory(data)` - Create new story
- `updateStory(storyId, data)` - Update story
- `deleteStory(storyId)` - Delete story
- `likeStory(storyId)` - Like a story
- `unlikeStory(storyId)` - Unlike a story
- `getStoryViews(storyId)` - Get story view count
- `getStoryLikes(storyId)` - Get story like count

**Usage Example:**
```typescript
import { StoriesService } from '@/lib/services';

// Get active stories
const stories = await StoriesService.getActiveStories();

// Create a new story
const story = await StoriesService.createStory({
  content: 'Check out my new post!',
  mediaUrl: 'https://example.com/image.jpg',
  mediaType: 'image'
});
```

### 7. TopicsService
Manages content topics and categories.

**Key Methods:**
- `getAllTopics()` - Get all topics
- `getTopicById(topicId)` - Get topic by ID
- `getTopicBySlug(slug)` - Get topic by slug
- `createTopic(data)` - Create new topic
- `updateTopic(topicId, data)` - Update topic
- `deleteTopic(topicId)` - Delete topic
- `getTrendingTopics(limit)` - Get trending topics
- `getPopularTopics(limit)` - Get popular topics
- `searchTopics(query)` - Search topics
- `followTopic(topicId)` - Follow a topic
- `unfollowTopic(topicId)` - Unfollow a topic

**Usage Example:**
```typescript
import { TopicsService } from '@/lib/services';

// Get trending topics
const trendingTopics = await TopicsService.getTrendingTopics(10);

// Follow a topic
await TopicsService.followTopic('topicId123');

// Search topics
const searchResults = await TopicsService.searchTopics('technology');
```

### 8. UploadService
Manages file uploads and file operations.

**Key Methods:**
- `uploadImage(file, folder, options)` - Upload single image
- `uploadMultipleImages(files, folder, options)` - Upload multiple images
- `uploadAvatar(file)` - Upload user avatar
- `uploadBlogImage(file, blogId)` - Upload blog featured image
- `uploadDocument(file, folder)` - Upload document
- `deleteFile(fileId)` - Delete uploaded file
- `getFileInfo(fileId)` - Get file information

**Usage Example:**
```typescript
import { UploadService } from '@/lib/services';

// Upload image
const uploadedFile = await UploadService.uploadImage(
  fileInput.files[0],
  'blog-images',
  { maxWidth: 1200, quality: 0.8 }
);

// Upload avatar
const avatar = await UploadService.uploadAvatar(fileInput.files[0]);
```

### 9. SearchService
Provides comprehensive search functionality across all content types.

**Key Methods:**
- `globalSearch(params)` - Search across all content
- `searchBlogs(query, filters)` - Search blogs only
- `searchUsers(query, filters)` - Search users only
- `searchComments(query, filters)` - Search comments only
- `advancedSearch(params)` - Advanced search with multiple criteria
- `searchByTags(tags)` - Search by tags
- `getSearchSuggestions(query)` - Get search suggestions

**Usage Example:**
```typescript
import { SearchService } from '@/lib/services';

// Global search
const results = await SearchService.globalSearch({
  query: 'technology',
  includeBlogs: true,
  includeUsers: true,
  sortBy: 'relevance'
});

// Search blogs with filters
const blogs = await SearchService.searchBlogs('react', {
  tags: ['frontend'],
  status: 'published'
});
```

### 10. NotificationService
Manages user notifications and preferences.

**Key Methods:**
- `getUserNotifications(filters)` - Get user notifications
- `getUnreadCount()` - Get unread notification count
- `markAsRead(notificationId)` - Mark notification as read
- `getNotificationPreferences()` - Get notification preferences
- `updateNotificationPreferences(preferences)` - Update preferences
- `subscribeToPushNotifications(subscription)` - Subscribe to push notifications

**Usage Example:**
```typescript
import { NotificationService } from '@/lib/services';

// Get notifications
const notifications = await NotificationService.getUserNotifications(1, 20);

// Mark as read
await NotificationService.markAsRead('notificationId123');

// Update preferences
await NotificationService.updateNotificationPreferences({
  emailNotifications: false,
  pushNotifications: true
});
```

## Unified API Client

For convenience, all services are accessible through a unified `ApiClient`:

```typescript
import ApiClient from '@/lib/api-client';

// Access any service through the client
const user = await ApiClient.users.getUserById('userId123');
const blogs = await ApiClient.blogs.getBlogs();
const stories = await ApiClient.stories.getActiveStories();
const topics = await ApiClient.topics.getTrendingTopics(10);
```

## Error Handling

All service methods include proper error handling and will throw errors if:
- No response data is received
- API calls fail
- Required parameters are missing

**Example Error Handling:**
```typescript
try {
  const user = await UserService.getUserById('userId123');
  // Handle success
} catch (error) {
  console.error('Failed to get user:', error.message);
  // Handle error appropriately
}
```

## TypeScript Support

All services are fully typed with TypeScript interfaces that match the backend API responses. This provides:
- IntelliSense and autocomplete
- Compile-time type checking
- Better developer experience

## Authentication

Most service methods automatically include authentication headers through the `apiService` interceptor. The `AuthService` handles:
- Token storage and retrieval
- Token validation
- Automatic token refresh
- Logout and cleanup

## Best Practices

1. **Always handle errors** - Wrap API calls in try-catch blocks
2. **Use TypeScript** - Leverage the provided types for better code quality
3. **Check authentication** - Ensure user is authenticated before making protected calls
4. **Handle loading states** - Show loading indicators during API calls
5. **Validate data** - Validate user input before sending to API
6. **Use pagination** - Implement pagination for large data sets

## Service Dependencies

All services depend on the `apiService` from `@/lib/api`, which provides:
- HTTP client (Axios)
- Request/response interceptors
- Authentication headers
- Error handling
- Base URL configuration

## Testing

Services can be easily mocked for testing by creating mock implementations of the service classes. Each service method is independent and can be tested in isolation.

## Future Enhancements

- Caching layer for frequently accessed data
- Offline support with local storage
- Real-time updates with WebSocket integration
- Request/response logging for debugging
- Performance monitoring and metrics
