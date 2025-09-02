"use client";
import React, { useState } from 'react';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { H1, H3, Muted, P } from '@/components/ui/text';
import { EditProfileDialog } from './edit-profile-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileHeaderProps {
  user: User;
  stats: {
    totalPosts: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    followers: number;
    following: number;
  };
  onProfileUpdate: () => void;
}

export function ProfileHeader({ user, stats, onProfileUpdate }: ProfileHeaderProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const openEditDialog = () => setIsEditDialogOpen(true);
  const closeEditDialog = () => setIsEditDialogOpen(false);

  const handleProfileUpdate = () => {
    onProfileUpdate();
    closeEditDialog();
  };

  return (
    <>
      <div className="mb-8">
        {/* Profile Banner */}
        <div className="relative h-48 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg mb-6">
          <div className="absolute inset-0 bg-black/10 rounded-lg" />
        </div>

        {/* Profile Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              variant="outline"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              onClick={openEditDialog}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </Button>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <H1 className="mb-2">{user.name}</H1>
                <P className="text-muted-foreground mb-2">
                  @{user.username || user.email?.split('@')[0] || 'user'}
                </P>
                {user.bio && (
                  <P className="text-foreground mb-3 max-w-2xl">{user.bio}</P>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {user.location && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {user.location}
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <a 
                        href={user.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        {user.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={openEditDialog} variant="outline">
                  Edit Profile
                </Button>
                <Button variant="default">
                  Share Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-8">
          <Card className="p-4 text-center">
            <H3 className="text-2xl font-bold text-primary">{stats.totalPosts}</H3>
            <Muted>Posts</Muted>
          </Card>
          <Card className="p-4 text-center">
            <H3 className="text-2xl font-bold text-primary">{stats.totalViews}</H3>
            <Muted>Views</Muted>
          </Card>
          <Card className="p-4 text-center">
            <H3 className="text-2xl font-bold text-primary">{stats.totalLikes}</H3>
            <Muted>Likes</Muted>
          </Card>
          <Card className="p-4 text-center">
            <H3 className="text-2xl font-bold text-primary">{stats.totalComments}</H3>
            <Muted>Comments</Muted>
          </Card>
          <Card className="p-4 text-center">
            <H3 className="text-2xl font-bold text-primary">{stats.followers}</H3>
            <Muted>Followers</Muted>
          </Card>
          <Card className="p-4 text-center">
            <H3 className="text-2xl font-bold text-primary">{stats.following}</H3>
            <Muted>Following</Muted>
          </Card>
        </div>
      </div>

      <EditProfileDialog
        isOpen={isEditDialogOpen}
        onClose={closeEditDialog}
        user={user}
        onProfileUpdate={handleProfileUpdate}
      />
    </>
  );
}
