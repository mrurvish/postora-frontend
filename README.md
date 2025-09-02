# 🚀 Postora - Modern Blog Platform

A full-featured, modern blog platform built with Next.js 14, TypeScript, and Tailwind CSS. Postora provides a complete blogging experience with social features, user management, and content discovery.

## ✨ Features

### 🔐 Authentication & User Management
- **User Registration & Login** with email/password
- **Google OAuth Integration** for seamless sign-in
- **JWT Token Management** with automatic refresh
- **User Profiles** with customizable avatars, bios, and social links
- **Profile Management** with preferences and settings

### 📝 Content Management
- **Rich Text Editor** for creating engaging blog posts
- **Markdown Support** with HTML rendering
- **Image Upload** with cover image support
- **Draft System** for saving work in progress
- **Post Categories & Tags** for better organization
- **SEO-Friendly URLs** with slug-based routing

### 🏠 Home Page & Discovery
- **Featured Posts** showcase
- **Latest Posts** feed
- **Popular Posts** based on engagement
- **Trending Topics** for content discovery
- **Suggested Users** to follow
- **Category Filtering** for easy navigation

### 🔍 Search & Discovery
- **Global Search** across posts, users, and topics
- **Advanced Filters** by category, date, and popularity
- **Search Suggestions** and popular terms
- **Category Pages** for topic-based browsing
- **Tag Pages** for tag-based content discovery

### 👥 Social Features
- **Follow/Unfollow** other users
- **User Profiles** with posts and stats
- **Followers/Following** lists
- **Like/Dislike** posts and comments
- **Bookmark** posts for later reading
- **Comment System** with nested replies

### 📱 User Experience
- **Responsive Design** for all devices
- **Dark/Light Theme** with system preference detection
- **Loading States** and skeleton screens
- **Toast Notifications** for user feedback
- **Pagination** for large content lists
- **Infinite Scroll** for seamless browsing

### 🎨 Design & UI
- **Modern UI** with Tailwind CSS
- **Component-Based Architecture** for maintainability
- **CSS Variables** for consistent theming
- **Smooth Animations** and transitions
- **Accessibility** features and keyboard navigation

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls

### UI Components
- **Custom Component Library** built with Tailwind
- **Responsive Design** for mobile-first approach
- **Theme System** with dark/light mode support
- **Form Components** with validation
- **Modal & Dialog** components

### State Management
- **Zustand Stores** for global state
- **React Hooks** for local state
- **Context API** for theme and auth
- **Local Storage** for persistence

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── blog/              # Blog detail pages
│   ├── category/          # Category pages
│   ├── create/            # Blog creation
│   ├── my-posts/          # User's posts
│   ├── profile/           # User profile
│   ├── search/            # Search functionality
│   ├── tag/               # Tag pages
│   └── user/              # User profile pages
├── components/            # Reusable UI components
│   ├── blog/              # Blog-specific components
│   ├── profile/           # Profile components
│   ├── sections/          # Page sections
│   └── ui/                # Base UI components
├── lib/                   # Utilities and services
│   ├── api/               # API client and configuration
│   ├── services/          # API service classes
│   ├── stores/            # Zustand stores
│   └── hooks/             # Custom React hooks
├── docs/                  # API documentation
└── public/                # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Backend API server running

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### API Configuration
The platform connects to a backend API. Update the API URL in your environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Google OAuth
To enable Google sign-in, configure your Google OAuth credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Set the client ID in your environment variables

### Theme Configuration
Customize the theme by modifying CSS variables in `app/globals.css`:

```css
:root {
  --primary: 220 14% 96%;
  --primary-foreground: 220 9% 46%;
  /* Add more custom variables */
}
```

## 📖 Usage Guide

### For Content Creators

1. **Create an Account**
   - Register with email or Google OAuth
   - Complete your profile with bio and social links

2. **Write Your First Post**
   - Click "Create Post" in the navigation
   - Use the rich text editor to write content
   - Add categories and tags
   - Upload a cover image
   - Save as draft or publish immediately

3. **Manage Your Content**
   - View all your posts in "My Posts"
   - Edit or delete existing posts
   - Track engagement and analytics

### For Readers

1. **Discover Content**
   - Browse the home page for featured content
   - Use search to find specific topics
   - Explore categories and tags
   - Follow interesting authors

2. **Engage with Content**
   - Like and bookmark posts
   - Leave comments and replies
   - Share posts on social media
   - Follow authors for updates

3. **Personalize Your Experience**
   - Customize your profile
   - Manage your bookmarks
   - Adjust theme preferences
   - Control notification settings

## 🔌 API Integration

The platform uses a RESTful API with the following main endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get specific blog
- `POST /api/blogs` - Create new blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/profile` - Update profile
- `POST /api/users/follow/:id` - Follow user
- `DELETE /api/users/unfollow/:id` - Unfollow user

### Comments
- `GET /api/blogs/:id/comments` - Get blog comments
- `POST /api/blogs/:id/comments` - Add comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

## 🎨 Customization

### Adding New Components
1. Create component in `components/ui/`
2. Export from `components/ui/index.ts`
3. Use throughout the application

### Styling
- Use Tailwind CSS classes for styling
- Follow the design system in `app/globals.css`
- Maintain consistency with existing components

### Theming
- Modify CSS variables for color changes
- Update theme configuration in `lib/config/theme.ts`
- Test both light and dark modes

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
1. Build the project: `pnpm build`
2. Start production server: `pnpm start`
3. Configure your hosting platform accordingly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API collection in `docs/`

## 🎯 Roadmap

- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Newsletter subscription
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Advanced search filters
- [ ] Content moderation tools
- [ ] API rate limiting
- [ ] Performance optimizations

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
