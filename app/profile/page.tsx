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
      <section className="py-16 bg-accent/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-foreground rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-background text-4xl">{demoUser.avatar}</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {demoUser.firstName} {demoUser.lastName}
            </h1>
            <p className="text-muted-foreground mb-4">{demoUser.bio}</p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span>{demoUser.postsCount} posts</span>
              <span>{demoUser.followersCount} followers</span>
              <span>{demoUser.followingCount} following</span>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="mt-6 px-6 py-2 border border-border text-foreground rounded-lg hover:bg-accent transition-all duration-200"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 text-sm text-muted-foreground">({tab.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'posts' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-foreground">Published Posts</h2>
              <div className="grid gap-8">
                {userPosts.filter(post => post.status === 'published').map((post) => (
                  <article key={post.id} className="p-6 border border-border rounded-lg hover:border-primary transition-colors">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{post.readTime} min read</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">{post.title}</h3>
                      <p className="text-muted-foreground">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-accent text-xs text-foreground rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'drafts' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-foreground">Draft Posts</h2>
              <div className="grid gap-8">
                {userPosts.filter(post => post.status === 'draft').map((post) => (
                  <article key={post.id} className="p-6 border border-border rounded-lg hover:border-primary transition-colors">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs rounded">
                          Draft
                        </span>
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{post.readTime} min read</span>
                        <span>•</span>
                        <span>Last edited {new Date(post.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">{post.title}</h3>
                      <p className="text-muted-foreground">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-accent text-xs text-foreground rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-3 pt-3">
                        <button
                          onClick={() => handleEditPost(post.id)}
                          className="px-4 py-2 bg-foreground text-background rounded-lg text-sm hover:bg-primary transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handlePublishPost(post.id)}
                          className="px-4 py-2 border border-border text-foreground rounded-lg text-sm hover:bg-accent transition-colors"
                        >
                          Publish
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-foreground mb-8">Profile Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue={demoUser.firstName}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue={demoUser.lastName}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
                  <textarea
                    defaultValue={demoUser.bio}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                  <input
                    type="text"
                    defaultValue={demoUser.location}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <button className="px-6 py-2 bg-foreground text-background rounded-lg hover:bg-primary transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
