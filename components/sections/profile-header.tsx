import React from 'react';
import Link from 'next/link';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  website?: string;
  twitter?: string;
  joinedDate: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  role: string;
  isVerified: boolean;
}

interface ProfileHeaderProps {
  user: User;
  isEditing: boolean;
  onEditToggle: () => void;
}

export function ProfileHeader({ user, isEditing, onEditToggle }: ProfileHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-primary/10 via-background to-secondary/20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-4xl">
              {user.avatar}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">
                {user.firstName} {user.lastName}
              </h1>
              {user.isVerified && (
                <span className="text-primary" title="Verified">
                  ✓
                </span>
              )}
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                {user.role}
              </span>
            </div>
            
            <p className="text-muted-foreground mb-3 max-w-2xl">
              {user.bio}
            </p>

            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>{user.location}</span>
              </div>
              {user.website && (
                <div className="flex items-center gap-2">
                  <span>🌐</span>
                  <a href={user.website} className="text-primary hover:underline">
                    {user.website.replace('https://', '')}
                  </a>
                </div>
              )}
              {user.twitter && (
                <div className="flex items-center gap-2">
                  <span>🐦</span>
                  <a href={`https://twitter.com/${user.twitter}`} className="text-primary hover:underline">
                    {user.twitter}
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="font-semibold text-foreground">{user.postsCount}</span>
                <span className="text-muted-foreground ml-1">posts</span>
              </div>
              <div>
                <span className="font-semibold text-foreground">{user.followersCount}</span>
                <span className="text-muted-foreground ml-1">followers</span>
              </div>
              <div>
                <span className="font-semibold text-foreground">{user.followingCount}</span>
                <span className="text-muted-foreground ml-1">following</span>
              </div>
              <div>
                <span className="text-muted-foreground">Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onEditToggle}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-accent transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            <Link
              href="/new-post"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              New Post
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
