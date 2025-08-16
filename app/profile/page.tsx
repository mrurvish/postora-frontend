"use client";

import React, { useState } from 'react';
import { ProfileHeader, ProfileTabs, ProfileSettings } from '@/components/sections';
import { PostCard } from '@/components/ui';

// Demo user data
const demoUser = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  avatar: '👨‍💻',
  bio: 'Passionate writer and tech enthusiast. I love sharing knowledge and experiences through writing.',
  location: 'San Francisco, CA',
  website: 'https://johndoe.dev',
  twitter: '@johndoe',
  joinedDate: '2023-06-15',
  postsCount: 24,
  followersCount: 156,
  followingCount: 89,
  role: 'Writer',
  isVerified: true,
};

const userPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js 14",
    excerpt: "A comprehensive guide to building modern web applications with Next.js 14...",
    status: "published" as const,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    readTime: 8,
    category: "Technology",
    tags: ["Next.js", "React", "Web Development", "JavaScript"]
  },
  {
    id: 2,
    title: "The Future of React Development",
    excerpt: "Exploring the latest features and best practices in React development...",
    status: "published" as const,
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z",
    readTime: 12,
    category: "Programming",
    tags: ["React", "Frontend", "Development", "Best Practices"]
  },
  {
    id: 3,
    title: "Building Scalable APIs with Node.js",
    excerpt: "Learn how to design and implement robust APIs that can handle millions of requests...",
    status: "draft" as const,
    createdAt: "2024-01-05T09:15:00Z",
    updatedAt: "2024-01-08T16:45:00Z",
    readTime: 15,
    category: "Backend",
    tags: ["Node.js", "API", "Scalability", "Performance"]
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);

  const tabs = [
    { id: 'posts', label: 'Posts', count: userPosts.length },
    { id: 'drafts', label: 'Drafts', count: userPosts.filter(p => p.status === 'draft').length },
    { id: 'settings', label: 'Settings', count: null },
  ];

  const handleEditPost = (postId: number) => {
    console.log('Edit post:', postId);
    // Handle edit post logic
  };

  const handlePublishPost = (postId: number) => {
    console.log('Publish post:', postId);
    // Handle publish post logic
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Header */}
      <ProfileHeader
        user={demoUser}
        isEditing={isEditing}
        onEditToggle={() => setIsEditing(!isEditing)}
      />

      {/* Tabs */}
      <ProfileTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Published Posts</h2>
            <div className="grid gap-6">
              {userPosts.filter(post => post.status === 'published').map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  showActions={false}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'drafts' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Draft Posts</h2>
            <div className="grid gap-6">
              {userPosts.filter(post => post.status === 'draft').map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  showActions={true}
                  onEdit={() => handleEditPost(post.id)}
                  onPublish={() => handlePublishPost(post.id)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <ProfileSettings user={demoUser} />
        )}
      </div>
    </div>
  );
}
