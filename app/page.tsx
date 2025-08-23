"use client";
import React, { useState } from 'react';
import { Hero } from '@/components/sections/hero';
import { Stories } from '@/components/sections/stories';
import { PostCard } from '@/components/ui/post-card';
import { SuggestedUsers } from '@/components/sections/suggested-users';
import { TrendingTopics } from '@/components/sections/trending-topics';
import { H2, BodyLarge, Muted } from '@/components/ui/text';

export default function HomePage() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<number>>(new Set());

  const stories = [
    { id: 1, user: 'Sarah Chen', avatar: '👩‍💻', isLive: true },
    { id: 2, user: 'Mike Johnson', avatar: '👨‍🎨', isLive: false },
    { id: 3, user: 'Emma Wilson', avatar: '👩‍🎭', isLive: true },
    { id: 4, user: 'Alex Rivera', avatar: '👨‍🚀', isLive: false },
    { id: 5, user: 'Lisa Park', avatar: '👩‍🔬', isLive: false },
    { id: 6, user: 'David Kim', avatar: '👨‍💼', isLive: true },
    { id: 7, user: 'Anna Lee', avatar: '👩‍🎨', isLive: false },
    { id: 8, user: 'Tom Baker', avatar: '👨‍🍳', isLive: false },
  ];

  const trendingPosts = [
    {
      id: 1,
      title: "The Future of Social Media: Beyond the Algorithm",
      excerpt: "Exploring how AI and human creativity are reshaping the way we connect online...",
      author: { name: "Sarah Chen", avatar: "👩‍💻", verified: true },
      date: "2 hours ago",
      readTime: 5,
      image: "/api/placeholder/400/250",
      tags: ["Technology", "Social Media", "AI"],
      likes: 1247,
      comments: 89,
      shares: 234,
      isTrending: true
    },
    {
      id: 2,
      title: "Building Authentic Communities in the Digital Age",
      excerpt: "How to create meaningful connections when everyone is just a click away...",
      author: { name: "Mike Johnson", avatar: "👨‍🎨", verified: false },
      date: "4 hours ago",
      readTime: 7,
      image: "/api/placeholder/400/250",
      tags: ["Community", "Digital", "Connection"],
      likes: 892,
      comments: 156,
      shares: 78,
      isTrending: true
    },
    {
      id: 3,
      title: "The Art of Storytelling: From Ancient Times to TikTok",
      excerpt: "How storytelling has evolved and what makes content truly engaging...",
      author: { name: "Emma Wilson", avatar: "👩‍🎭", verified: true },
      date: "6 hours ago",
      readTime: 8,
      image: "/api/placeholder/400/250",
      tags: ["Storytelling", "Content", "History"],
      likes: 2156,
      comments: 234,
      shares: 567,
      isTrending: false
    }
  ];

  const suggestedUsers = [
    {
      id: 1,
      name: "Creative Coder",
      avatar: "👨‍💻",
      bio: "Building the future, one line at a time",
      followers: 12.5,
      verified: true
    },
    {
      id: 2,
      name: "Digital Artist",
      avatar: "👩‍🎨",
      bio: "Turning imagination into digital reality",
      followers: 8.9,
      verified: false
    },
    {
      id: 3,
      name: "Tech Explorer",
      avatar: "🚀",
      bio: "Discovering the next big thing in tech",
      followers: 15.2,
      verified: true
    }
  ];

  const trendingTopics = [
    "#TechTrends2024",
    "#DigitalArt",
    "#SocialMedia",
    "#Innovation",
    "#CreativeCoding"
  ];

  const handleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleFollow = (userId: number) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleGetStarted = () => {
    // This will be handled by the navigation component
    console.log('Get Started clicked');
  };

  const handleExplore = () => {
    // This will be handled by the navigation component
    console.log('Explore clicked');
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero onGetStarted={handleGetStarted} onExplore={handleExplore} />

      {/* Stories Section */}
      <Stories stories={stories} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-8">
            <div className="text-center mb-8">
              <H2 className="mb-4">Trending Posts</H2>
              <Muted>Discover what's happening in the community</Muted>
            </div>
            
            {trendingPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isLiked={likedPosts.has(post.id)}
                onLike={handleLike}
                onFollow={(authorName) => {
                  // Handle follow logic here
                  console.log(`Following ${authorName}`);
                }}
              />
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <SuggestedUsers 
              users={suggestedUsers} 
              followedUsers={followedUsers}
              onFollow={handleFollow}
            />
            <TrendingTopics topics={trendingTopics} />
          </div>
        </div>
      </div>
    </main>
  );
}
