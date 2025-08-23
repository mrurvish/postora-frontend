"use client";
import React, { useState } from 'react';
import Image from 'next/image';

// Demo blog posts data
const blogPosts = [
  {
    id: 1,
    title: "The Future of Web Development in 2024",
    excerpt: "Explore the latest trends and technologies that are shaping the future of web development, from AI integration to advanced CSS techniques.",
    content: "Full article content would go here...",
    author: {
      name: "Sarah Johnson",
      avatar: "👩‍💻",
      bio: "Senior Developer",
      verified: true
    },
    category: "Technology",
    readTime: 5,
    publishedAt: "2024-01-15",
    tags: ["Web Development", "AI", "CSS", "JavaScript"],
    featuredImage: "/api/placeholder/400/250",
    views: 1240,
    likes: 89,
    comments: 23,
    shares: 45,
    isTrending: true
  },
  {
    id: 2,
    title: "Building Scalable React Applications",
    excerpt: "Learn the best practices for building large-scale React applications that can handle millions of users and complex state management.",
    content: "Full article content would go here...",
    author: {
      name: "Mike Chen",
      avatar: "👨‍💻",
      bio: "Tech Lead",
      verified: true
    },
    category: "Programming",
    readTime: 8,
    publishedAt: "2024-01-12",
    tags: ["React", "Scalability", "State Management", "Performance"],
    featuredImage: "/api/placeholder/400/250",
    views: 2156,
    likes: 156,
    comments: 42,
    shares: 78,
    isTrending: false
  },
  {
    id: 3,
    title: "The Art of Effective Content Writing",
    excerpt: "Discover how to create compelling content that engages readers and drives meaningful conversations in the digital age.",
    content: "Full article content would go here...",
    author: {
      name: "Emma Davis",
      avatar: "👩‍🎨",
      bio: "Content Strategist",
      verified: false
    },
    category: "Writing",
    readTime: 6,
    publishedAt: "2024-01-10",
    tags: ["Content Writing", "SEO", "Engagement", "Digital Marketing"],
    featuredImage: "/api/placeholder/400/250",
    views: 1890,
    likes: 134,
    comments: 31,
    shares: 56,
    isTrending: true
  },
  {
    id: 4,
    title: "Design Systems: A Complete Guide",
    excerpt: "Master the fundamentals of design systems and learn how to create consistent, scalable design solutions for your products.",
    content: "Full article content would go here...",
    author: {
      name: "Alex Rodriguez",
      avatar: "🎨",
      bio: "UX Designer",
      verified: true
    },
    category: "Design",
    readTime: 10,
    publishedAt: "2024-01-08",
    tags: ["Design Systems", "UX", "UI", "Consistency"],
    featuredImage: "/api/placeholder/400/250",
    views: 1678,
    likes: 98,
    comments: 28,
    shares: 34,
    isTrending: false
  },
  {
    id: 5,
    title: "Machine Learning for Beginners",
    excerpt: "Start your journey into machine learning with this comprehensive guide covering the basics and practical applications.",
    content: "Full article content would go here...",
    author: {
      name: "Dr. Lisa Wang",
      avatar: "🧠",
      bio: "Data Scientist",
      verified: true
    },
    category: "Technology",
    readTime: 12,
    publishedAt: "2024-01-05",
    tags: ["Machine Learning", "AI", "Data Science", "Python"],
    featuredImage: "/api/placeholder/400/250",
    views: 3420,
    likes: 267,
    comments: 89,
    shares: 123,
    isTrending: true
  },
  {
    id: 6,
    title: "Remote Work Best Practices",
    excerpt: "Navigate the challenges of remote work with proven strategies for productivity, communication, and work-life balance.",
    content: "Full article content would go here...",
    author: {
      name: "David Kim",
      avatar: "🏠",
      bio: "Product Manager",
      verified: false
    },
    category: "Business",
    readTime: 7,
    publishedAt: "2024-01-03",
    tags: ["Remote Work", "Productivity", "Communication", "Work-Life Balance"],
    featuredImage: "/api/placeholder/400/250",
    views: 1456,
    likes: 112,
    comments: 35,
    shares: 67,
    isTrending: false
  }
];

const categories = [
  { name: "All", count: blogPosts.length, icon: "🌟" },
  { name: "Technology", count: blogPosts.filter(p => p.category === "Technology").length, icon: "💻" },
  { name: "Programming", count: blogPosts.filter(p => p.category === "Programming").length, icon: "⚡" },
  { name: "Design", count: blogPosts.filter(p => p.category === "Design").length, icon: "🎨" },
  { name: "Writing", count: blogPosts.filter(p => p.category === "Writing").length, icon: "✍️" },
  { name: "Business", count: blogPosts.filter(p => p.category === "Business").length, icon: "📊" },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<number>>(new Set());

  const handleCategoryChange = (categoryName: string) => {
    setActiveCategory(categoryName);
    // Handle category filtering logic here
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleLike = (postId: number) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);
  };

  const handleFollow = (authorName: string) => {
    // In a real app, you'd track by user ID
    console.log('Follow/Unfollow:', authorName);
  };

  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Discover Amazing Content</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore insights, tutorials, and stories from our community of creators and developers
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryChange(category.name)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeCategory === category.name
                    ? 'bg-gradient-to-r from-primary to-chart-5 text-background shadow-lg'
                    : 'bg-accent text-foreground hover:bg-accent/80 hover:scale-105'
                }`}
              >
                <span>{category.icon}</span>
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.id} className="social-card group">
                {post.isTrending && (
                  <div className="trending-badge absolute top-4 right-4 z-10">
                    🔥 Trending
                  </div>
                )}
                
                {/* Post Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/50 rounded-full flex items-center justify-center text-xl">
                    {post.author.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{post.author.name}</span>
                      {post.author.verified && (
                        <span className="text-primary">✓</span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {post.publishedAt} • {post.readTime} min read
                    </div>
                  </div>
                  <button 
                    onClick={() => handleFollow(post.author.name)}
                    className="follow-btn text-sm"
                  >
                    Follow
                  </button>
                </div>

                {/* Post Image */}
                <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-accent">
                  <div className="w-full h-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center">
                    <span className="text-4xl">{post.author.avatar}</span>
                  </div>
                </div>

                {/* Post Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-accent text-sm text-foreground rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Post Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>👁️ {post.views} views</span>
                  <span>❤️ {post.likes} likes</span>
                  <span>💬 {post.comments} comments</span>
                  <span>📤 {post.shares} shares</span>
                </div>

                {/* Post Actions */}
                <div className="post-actions">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`action-btn like ${likedPosts.has(post.id) ? 'text-like' : ''}`}
                  >
                    <svg className="w-5 h-5" fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {post.likes}
                  </button>
                  <button className="action-btn comment">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {post.comments}
                  </button>
                  <button className="action-btn share">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    {post.shares}
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-primary to-chart-5 text-background rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : 'Load More Articles'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
