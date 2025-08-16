"use client";
import Image from 'next/image';
import Link from 'next/link';
import { BRAND_CONFIG } from '../lib/config';
import { Hero, Stats, FeaturedArticles, Categories, CTA } from '@/components/sections';

export default function HomePage() {
  const featuredPosts = [
    {
      id: 1,
      title: 'The Future of Web Development',
      excerpt: 'Exploring the latest trends and technologies shaping the future of web development...',
      author: 'Sarah Chen',
      date: '2024-01-15',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop',
      tags: ['Web Development', 'Technology', 'Future']
    },
    {
      id: 2,
      title: 'Building Scalable Applications',
      excerpt: 'Learn the best practices for building applications that can grow with your business...',
      author: 'Mike Johnson',
      date: '2024-01-12',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
      tags: ['Architecture', 'Scalability', 'Best Practices']
    },
    {
      id: 3,
      title: 'The Art of Code Review',
      excerpt: 'Discover how effective code reviews can improve code quality and team collaboration...',
      author: 'Emily Rodriguez',
      date: '2024-01-10',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop',
      tags: ['Code Review', 'Collaboration', 'Quality']
    }
  ];

  const categories = [
    { name: 'Technology', count: 45, icon: '💻', color: 'from-blue-500 to-cyan-500' },
    { name: 'Design', count: 32, icon: '🎨', color: 'from-purple-500 to-pink-500' },
    { name: 'Business', count: 28, icon: '📊', color: 'from-green-500 to-emerald-500' },
    { name: 'Lifestyle', count: 23, icon: '🌟', color: 'from-orange-500 to-red-500' },
    { name: 'Science', count: 19, icon: '🔬', color: 'from-indigo-500 to-blue-500' },
    { name: 'Travel', count: 15, icon: '✈️', color: 'from-teal-500 to-green-500' }
  ];

  const stats = [
    { label: 'Articles Published', value: '2,847' },
    { label: 'Active Writers', value: '156' },
    { label: 'Monthly Readers', value: '45.2K' },
    { label: 'Countries Reached', value: '89' }
  ];

  return (
    <main className="flex-1">
      {/* Hero Section - Now using component */}
      <Hero
        title="Discover, Write, and Inspire"
        description="Join thousands of writers sharing their stories, insights, and experiences with the world. Start your writing journey today."
        primaryAction={{
          label: "Start Writing",
          href: "/register"
        }}
        secondaryAction={{
          label: "Explore Articles",
          href: "/blog"
        }}
        showBrandInfo={true}
        brandName={BRAND_CONFIG.name}
        brandTagline={BRAND_CONFIG.tagline}
      />

      {/* Stats Section - Now using component */}
      <Stats stats={stats} />

      {/* Featured Articles - Now using component */}
      <FeaturedArticles posts={featuredPosts} />

      {/* Categories Section - Now using component */}
      <Categories categories={categories} />

      {/* CTA Section - Now using component */}
      <CTA
        title="Ready to Share Your Story?"
        description="Join thousands of writers who are already sharing their knowledge and experiences with our global community."
        primaryAction={{
          label: "Get Started Today",
          href: "/register"
        }}
        secondaryAction={{
          label: "Sign In",
          href: "/login"
        }}
      />
    </main>
  );
}
