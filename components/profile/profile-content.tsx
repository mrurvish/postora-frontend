"use client";
import React from 'react';
import { User, Blog } from '@/lib/types';
import { ProfileInfo } from './profile-info';
import { PostsList } from './posts-list';
import { DraftsList } from './drafts-list';
import { CreatePost } from './create-post';

interface ProfileContentProps {
  activeTab: 'profile' | 'posts' | 'drafts' | 'create';
  user: User;
  posts: Blog[];
  drafts: Blog[];
  isLoading: boolean;
  onDataUpdate: () => void;
}

export function ProfileContent({ 
  activeTab, 
  user, 
  posts, 
  drafts, 
  isLoading, 
  onDataUpdate 
}: ProfileContentProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  switch (activeTab) {
    case 'profile':
      return <ProfileInfo user={user} onProfileUpdate={onDataUpdate} />;
    case 'posts':
      return <PostsList posts={posts} onDataUpdate={onDataUpdate} />;
    case 'drafts':
      return <DraftsList drafts={drafts} onDataUpdate={onDataUpdate} />;
    case 'create':
      return <CreatePost onPostCreated={onDataUpdate} />;
    default:
      return <ProfileInfo user={user} onProfileUpdate={onDataUpdate} />;
  }
}
