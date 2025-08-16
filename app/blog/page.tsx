"use client";
import React, { useState } from 'react';
import { BlogHeader, CategoryFilter } from '@/components/sections';
import { BlogPostCard, LoadMoreButton } from '@/components/ui';

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
      bio: "Senior Developer"
    },
    category: "Technology",
    readTime: 5,
    publishedAt: "2024-01-15",
    tags: ["Web Development", "AI", "CSS", "JavaScript"],
    featuredImage: "/api/placeholder/400/250",
    views: 1240,
    likes: 89,
    comments: 23
  },
  {
    id: 2,
    title: "Building Scalable React Applications",
    excerpt: "Learn the best practices for building large-scale React applications that can handle millions of users and complex state management.",
    content: "Full article content would go here...",
    author: {
      name: "Mike Chen",
      avatar: "👨‍💻",
      bio: "Tech Lead"
    },
    category: "Programming",
    readTime: 8,
    publishedAt: "2024-01-12",
    tags: ["React", "Scalability", "State Management", "Performance"],
    featuredImage: "/api/placeholder/400/250",
    views: 2156,
    likes: 156,
    comments: 42
  },
  {
    id: 3,
    title: "The Art of Effective Content Writing",
    excerpt: "Discover how to create compelling content that engages readers and drives meaningful conversations in the digital age.",
    content: "Full article content would go here...",
    author: {
      name: "Emma Davis",
      avatar: "👩‍🎨",
      bio: "Content Strategist"
    },
    category: "Writing",
    readTime: 6,
    publishedAt: "2024-01-10",
    tags: ["Content Writing", "SEO", "Engagement", "Digital Marketing"],
    featuredImage: "/api/placeholder/400/250",
    views: 1890,
    likes: 134,
    comments: 31
  },
  {
    id: 4,
    title: "Design Systems: A Complete Guide",
    excerpt: "Master the fundamentals of design systems and learn how to create consistent, scalable design solutions for your products.",
    content: "Full article content would go here...",
    author: {
      name: "Alex Rodriguez",
      avatar: "🎨",
      bio: "UX Designer"
    },
    category: "Design",
    readTime: 10,
    publishedAt: "2024-01-08",
    tags: ["Design Systems", "UX", "UI", "Consistency"],
    featuredImage: "/api/placeholder/400/250",
    views: 1678,
    likes: 98,
    comments: 28
  },
  {
    id: 5,
    title: "Machine Learning for Beginners",
    excerpt: "Start your journey into machine learning with this comprehensive guide covering the basics and practical applications.",
    content: "Full article content would go here...",
    author: {
      name: "Dr. Lisa Wang",
      avatar: "🧠",
      bio: "Data Scientist"
    },
    category: "Technology",
    readTime: 12,
    publishedAt: "2024-01-05",
    tags: ["Machine Learning", "AI", "Data Science", "Python"],
    featuredImage: "/api/placeholder/400/250",
    views: 3420,
    likes: 267,
    comments: 89
  },
  {
    id: 6,
    title: "Remote Work Best Practices",
    excerpt: "Navigate the challenges of remote work with proven strategies for productivity, communication, and work-life balance.",
    content: "Full article content would go here...",
    author: {
      name: "David Kim",
      avatar: "🏠",
      bio: "Product Manager"
    },
    category: "Business",
    readTime: 7,
    publishedAt: "2024-01-03",
    tags: ["Remote Work", "Productivity", "Communication", "Work-Life Balance"],
    featuredImage: "/api/placeholder/400/250",
    views: 1456,
    likes: 112,
    comments: 35
  }
];

const categories = [
  { name: "All", count: blogPosts.length },
  { name: "Technology", count: blogPosts.filter(p => p.category === "Technology").length },
  { name: "Programming", count: blogPosts.filter(p => p.category === "Programming").length },
  { name: "Design", count: blogPosts.filter(p => p.category === "Design").length },
  { name: "Writing", count: blogPosts.filter(p => p.category === "Writing").length },
  { name: "Business", count: blogPosts.filter(p => p.category === "Business").length },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

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

  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <BlogHeader />

      {/* Categories Filter */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Blog Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Load More */}
        <LoadMoreButton
          onClick={handleLoadMore}
          isLoading={isLoading}
          hasMore={true}
        />
      </div>
    </div>
  );
}
